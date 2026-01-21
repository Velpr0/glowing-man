import Phaser from 'phaser';
import { loadGameData } from '../config/data';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create(): void {
    try {
      const data = loadGameData();
      this.registry.set('gameData', data);
      this.scene.start('MenuScene');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.add.text(40, 40, `Data load failed: ${message}`, { color: '#ff7b7b' });
    }
  }
}
