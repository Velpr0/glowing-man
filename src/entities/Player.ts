import Phaser from 'phaser';
import { PlayerStats } from '../systems/UpgradeSystem';

export class Player extends Phaser.Physics.Arcade.Sprite {
  stats: PlayerStats;
  currentHp: number;

  constructor(scene: Phaser.Scene, x: number, y: number, stats: PlayerStats) {
    super(scene, x, y, 'player');
    this.stats = stats;
    this.currentHp = stats.maxHp;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
  }

  applyDamage(amount: number): void {
    this.currentHp = Math.max(0, this.currentHp - amount);
  }
}
