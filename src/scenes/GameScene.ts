import Phaser from 'phaser';
import { Bullet } from '../entities/Bullet';
import { Enemy } from '../entities/Enemy';
import { Player } from '../entities/Player';
import { GameData, WeaponConfig } from '../config/schema';
import { RNG, createSeed } from '../utils/rng';
import { InputSystem } from '../systems/InputSystem';
import { WaveDirector } from '../systems/WaveDirector';
import { UpgradeSystem, PlayerStats } from '../systems/UpgradeSystem';
import { CombatSystem } from '../systems/CombatSystem';
import { DebugSystem } from '../systems/DebugSystem';
import { AudioSystem } from '../systems/AudioSystem';
import { SaveSystem } from '../systems/SaveSystem';

export class GameScene extends Phaser.Scene {
  private data!: GameData;
  private rng!: RNG;
  private seed!: number;
  private player!: Player;
  private bullets!: Phaser.Physics.Arcade.Group;
  private enemies!: Phaser.Physics.Arcade.Group;
  private inputSystem!: InputSystem;
  private waveDirector!: WaveDirector;
  private upgradeSystem!: UpgradeSystem;
  private combatSystem!: CombatSystem;
  private debugSystem?: DebugSystem;
  private audioSystem = new AudioSystem();
  private saveSystem = new SaveSystem();
  private lastShotTime = 0;
  private currentWeapon!: WeaponConfig;
  private stats!: PlayerStats;
  private hudText!: Phaser.GameObjects.Text;
  private isPaused = false;
  private mode: 'standard' | 'endless' = 'standard';
  private lastDashTime = -Infinity;
  private dashEndTime = 0;
  private invulnerableUntil = 0;
  private lastSkillTime = -Infinity;
  private dashDirection = new Phaser.Math.Vector2(1, 0);
  private dashSpeedMultiplier = 1;

  constructor() {
    super('GameScene');
  }

  init(data: { mode: 'standard' | 'endless' }): void {
    this.mode = data.mode ?? 'standard';
  }

  create(): void {
    this.data = this.registry.get('gameData') as GameData;
    this.seed = createSeed();
    this.rng = new RNG(this.seed);
    this.inputSystem = new InputSystem(this);
    this.waveDirector = new WaveDirector(this.data.waves, this.rng);
    this.upgradeSystem = new UpgradeSystem(this.data.upgrades, this.rng);
    this.combatSystem = new CombatSystem(this.rng);

    const map = this.data.maps[0];
    this.physics.world.setBounds(0, 0, map.width, map.height);
    this.cameras.main.setBounds(0, 0, map.width, map.height);

    this.add.rectangle(map.width / 2, map.height / 2, map.width, map.height, 0x151a26);
    map.obstacles.forEach((obs) => {
      this.add.rectangle(obs.x, obs.y, obs.w, obs.h, 0x1f2937);
    });

    this.createTextures();

    this.currentWeapon = this.data.weapons[0];
    const playerConfig = this.data.player;
    this.stats = {
      damage: this.currentWeapon.baseDamage,
      fireRate: this.currentWeapon.fireRate,
      spread: this.currentWeapon.spread,
      critChance: playerConfig.critChance,
      critDamage: playerConfig.critDamage,
      maxHp: playerConfig.maxHp,
      moveSpeed: playerConfig.moveSpeed,
      dashCooldown: playerConfig.dash.cooldown,
      bulletSpeed: this.currentWeapon.speed,
      shield: 0
    };

    this.player = new Player(this, map.width / 2, map.height / 2, this.stats);
    this.cameras.main.startFollow(this.player);

    this.bullets = this.physics.add.group({
      classType: Bullet,
      maxSize: 300,
      runChildUpdate: false
    });

    this.enemies = this.physics.add.group({
      classType: Enemy,
      maxSize: 200,
      runChildUpdate: false
    });

    this.physics.world.on('worldbounds', (body: Phaser.Physics.Arcade.Body) => {
      const bullet = body.gameObject as Bullet;
      if (bullet instanceof Bullet) {
        bullet.deactivate();
      }
    });

    this.physics.add.overlap(this.bullets, this.enemies, (bulletObj, enemyObj) => {
      const bullet = bulletObj as Bullet;
      const enemy = enemyObj as Enemy;
      const { damage } = this.combatSystem.rollDamage({
        damage: bullet.damage,
        critChance: this.stats.critChance,
        critDamage: this.stats.critDamage
      });
      const killed = enemy.takeDamage(damage);
      if (killed) {
        enemy.destroy();
      }
      bullet.pierce -= 1;
      if (bullet.pierce < 0) {
        bullet.deactivate();
      }
    });

    this.physics.add.overlap(this.player, this.enemies, (_, enemyObj) => {
      const enemy = enemyObj as Enemy;
      if (this.time.now < this.invulnerableUntil) {
        return;
      }
      this.player.applyDamage(enemy.config.damage);
    });

    this.hudText = this.add.text(16, 16, '', { fontSize: '14px', color: '#e6edf3' }).setScrollFactor(0);
    if (import.meta.env.DEV) {
      this.debugSystem = new DebugSystem(this);
    }

    this.events.on('upgrade-selected', (upgrade) => {
      this.stats = this.upgradeSystem.applyUpgrade(this.stats, upgrade);
      this.player.stats = this.stats;
      this.scene.resume();
    });

    this.events.on('resume-game', () => {
      this.isPaused = false;
    });
  }

  update(time: number, delta: number): void {
    if (this.isPaused) {
      return;
    }
    const deltaSeconds = delta / 1000;
    this.waveDirector.update(deltaSeconds);

    if (this.waveDirector.spawnAllowed()) {
      const spawnCount = this.waveDirector.takeSpawnBatch(2);
      for (let i = 0; i < spawnCount; i += 1) {
        this.spawnEnemy();
      }
    }

    const movement = this.inputSystem.getMovementVector();
    if (this.inputSystem.isDashPressed()) {
      this.tryDash(movement, time);
    }

    if (time < this.dashEndTime) {
      const dashSpeed = this.stats.moveSpeed * this.dashSpeedMultiplier;
      this.player.setVelocity(this.dashDirection.x * dashSpeed, this.dashDirection.y * dashSpeed);
    } else {
      this.player.setVelocity(movement.x * this.stats.moveSpeed, movement.y * this.stats.moveSpeed);
    }

    if (this.inputSystem.isPausePressed()) {
      this.isPaused = true;
      this.scene.pause();
      this.scene.launch('PauseScene');
    }

    if (this.inputSystem.isSkillPressed()) {
      this.trySkill(time);
    }

    this.handleShooting(time);

    this.enemies.getChildren().forEach((enemyObj) => {
      const enemy = enemyObj as Enemy;
      this.physics.moveToObject(enemy, this.player, enemy.config.speed);
    });

    if (this.waveDirector.shouldEndWave(this.enemies.countActive(true))) {
      const options = this.upgradeSystem.drawOptions();
      this.scene.pause();
      this.scene.launch('UpgradeScene', { options });
      this.waveDirector.nextWave();
    }

    if (this.player.currentHp <= 0) {
      this.scene.start('ResultScene', { wave: this.waveDirector.getWaveIndex(), seed: this.seed });
    }

    this.updateHud();
    this.debugSystem?.update({
      fps: this.game.loop.actualFps,
      bullets: this.bullets.countActive(true),
      enemies: this.enemies.countActive(true),
      wave: this.waveDirector.getWaveIndex(),
      seed: this.seed
    });
  }

  private handleShooting(time: number): void {
    const pointer = this.input.activePointer;
    const shouldFire = this.currentWeapon.auto ? pointer.isDown : pointer.justDown || pointer.isDown;
    const canFire = time > this.lastShotTime + 1000 / this.stats.fireRate;
    if (shouldFire && canFire) {
      this.fireWeapon(pointer.worldX, pointer.worldY);
      this.lastShotTime = time;
    }
  }

  private fireWeapon(targetX: number, targetY: number): void {
    const direction = new Phaser.Math.Vector2(targetX - this.player.x, targetY - this.player.y).normalize();
    for (let i = 0; i < this.currentWeapon.projectiles; i += 1) {
      const bullet = this.bullets.get(this.player.x, this.player.y) as Bullet;
      if (!bullet) {
        continue;
      }
      const spread = this.stats.spread + (this.rng.next() - 0.5) * this.stats.spread;
      const angle = direction.angle() + spread;
      const velocity = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle)).scale(this.stats.bulletSpeed);
      bullet.fire(this.player.x, this.player.y, velocity, this.stats.damage, this.currentWeapon.pierce);
      bullet.setCollideWorldBounds(true);
      bullet.body.onWorldBounds = true;
    }
    this.audioSystem.play('shoot');
  }

  private spawnEnemy(): void {
    const map = this.data.maps[0];
    const spawn = this.rng.pick(map.spawnPoints);
    const enemyId = this.waveDirector.pickEnemy();
    const config = this.data.enemies.find((entry) => entry.id === enemyId);
    if (!config) {
      return;
    }
    const enemy = new Enemy(this, spawn.x, spawn.y, config);
    this.enemies.add(enemy, true);
  }

  private createTextures(): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(8, 8, 8);
    graphics.generateTexture('player', 16, 16);
    graphics.clear();
    graphics.fillStyle(0xff5555, 1);
    graphics.fillCircle(6, 6, 6);
    graphics.generateTexture('enemy', 12, 12);
    graphics.clear();
    graphics.fillStyle(0x8be9fd, 1);
    graphics.fillRect(0, 0, 6, 2);
    graphics.generateTexture('bullet', 6, 2);
    graphics.destroy();
  }

  private updateHud(): void {
    const dashRemaining = Math.max(0, this.stats.dashCooldown - (this.time.now - this.lastDashTime) / 1000);
    const skillRemaining = Math.max(0, this.data.player.skill.cooldown - (this.time.now - this.lastSkillTime) / 1000);
    this.hudText.setText([
      `HP: ${Math.ceil(this.player.currentHp)} / ${this.stats.maxHp}`,
      `Wave: ${this.waveDirector.getWaveIndex()}`,
      `Time: ${this.waveDirector.getTimeRemaining().toFixed(0)}s`,
      `Seed: ${this.seed}`,
      `Weapon: ${this.currentWeapon.name}`,
      `Dash CD: ${dashRemaining.toFixed(1)}s`,
      `${this.data.player.skill.name} CD: ${skillRemaining.toFixed(1)}s`
    ]);
  }

  private tryDash(movement: Phaser.Math.Vector2, time: number): void {
    if (time < this.lastDashTime + this.stats.dashCooldown * 1000) {
      return;
    }
    const playerConfig = this.data.player;
    this.lastDashTime = time;
    this.dashEndTime = time + playerConfig.dash.duration * 1000;
    this.invulnerableUntil = time + playerConfig.dash.iFrames * 1000;
    const direction = movement.length() > 0 ? movement.clone() : this.getAimDirection();
    this.dashDirection = direction.normalize();
    this.dashSpeedMultiplier = playerConfig.dash.speedMultiplier;
  }

  private trySkill(time: number): void {
    const skill = this.data.player.skill;
    if (time < this.lastSkillTime + skill.cooldown * 1000) {
      return;
    }
    this.lastSkillTime = time;
    const pulse = this.add.circle(this.player.x, this.player.y, skill.radius, 0x8be9fd, 0.25);
    this.tweens.add({
      targets: pulse,
      alpha: 0,
      duration: 300,
      onComplete: () => pulse.destroy()
    });
    this.enemies.getChildren().forEach((enemyObj) => {
      const enemy = enemyObj as Enemy;
      const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
      if (distance <= skill.radius) {
        const killed = enemy.takeDamage(skill.damage);
        if (killed) {
          enemy.destroy();
        }
      }
    });
  }

  private getAimDirection(): Phaser.Math.Vector2 {
    const pointer = this.input.activePointer;
    const direction = new Phaser.Math.Vector2(pointer.worldX - this.player.x, pointer.worldY - this.player.y);
    return direction.length() > 0 ? direction.normalize() : new Phaser.Math.Vector2(1, 0);
  }
}
