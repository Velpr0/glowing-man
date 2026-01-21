import Phaser from 'phaser';

export class Bullet extends Phaser.Physics.Arcade.Image {
  damage = 0;
  pierce = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'bullet');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setActive(false);
    this.setVisible(false);
  }

  fire(x: number, y: number, velocity: Phaser.Math.Vector2, damage: number, pierce: number): void {
    this.setActive(true);
    this.setVisible(true);
    this.setPosition(x, y);
    this.damage = damage;
    this.pierce = pierce;
    this.setVelocity(velocity.x, velocity.y);
  }

  deactivate(): void {
    this.setActive(false);
    this.setVisible(false);
    this.setVelocity(0, 0);
  }
}
