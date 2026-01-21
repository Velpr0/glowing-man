import Phaser from 'phaser';
import { EnemyConfig } from '../config/schema';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  config: EnemyConfig;
  hp: number;

  constructor(scene: Phaser.Scene, x: number, y: number, config: EnemyConfig) {
    super(scene, x, y, 'enemy');
    this.config = config;
    this.hp = config.hp;
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  takeDamage(amount: number): boolean {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.hp = 0;
      return true;
    }
    return false;
  }
}
