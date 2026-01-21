import Phaser from 'phaser';
import { SaveSystem } from '../systems/SaveSystem';

export class ResultScene extends Phaser.Scene {
  private saveSystem = new SaveSystem();

  constructor() {
    super('ResultScene');
  }

  create(data: { wave: number; seed: number }): void {
    const { width, height } = this.scale;
    const reward = data.wave * 10;
    this.saveSystem.addCurrency(reward);

    this.add.text(width / 2, 120, 'Run Complete', { fontSize: '32px', color: '#e6edf3' }).setOrigin(0.5);
    this.add.text(width / 2, 200, `Wave Reached: ${data.wave}`, { fontSize: '18px', color: '#f1fa8c' }).setOrigin(0.5);
    this.add.text(width / 2, 240, `Seed: ${data.seed}`, { fontSize: '14px', color: '#8be9fd' }).setOrigin(0.5);
    this.add.text(width / 2, 280, `Currency Earned: ${reward}`, { fontSize: '18px', color: '#50fa7b' }).setOrigin(0.5);

    const retry = this.add.text(width / 2, 380, 'Run Again', { fontSize: '22px', color: '#8be9fd' }).setOrigin(0.5).setInteractive();
    retry.on('pointerup', () => {
      this.scene.start('GameScene', { mode: 'standard' });
    });

    const menu = this.add.text(width / 2, 440, 'Back to Menu', { fontSize: '20px', color: '#bd93f9' }).setOrigin(0.5).setInteractive();
    menu.on('pointerup', () => {
      this.scene.start('MenuScene');
    });
  }
}
