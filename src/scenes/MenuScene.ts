import Phaser from 'phaser';
import { SaveSystem } from '../systems/SaveSystem';

export class MenuScene extends Phaser.Scene {
  private saveSystem!: SaveSystem;

  constructor() {
    super('MenuScene');
  }

  create(): void {
    this.saveSystem = new SaveSystem();
    const { width, height } = this.scale;
    this.add.text(width / 2, 120, 'Arena Waves: Rogue Shooter', {
      fontSize: '32px',
      color: '#e6edf3'
    }).setOrigin(0.5);

    const start = this.add.text(width / 2, 260, 'Start Run', {
      fontSize: '24px',
      color: '#8be9fd'
    }).setOrigin(0.5).setInteractive();

    const meta = this.add.text(width / 2, 320, 'Meta', {
      fontSize: '22px',
      color: '#f1fa8c'
    }).setOrigin(0.5).setInteractive();

    const settings = this.add.text(width / 2, 380, 'Settings', {
      fontSize: '20px',
      color: '#bd93f9'
    }).setOrigin(0.5);

    const credits = this.add.text(width / 2, 440, 'Credits', {
      fontSize: '20px',
      color: '#50fa7b'
    }).setOrigin(0.5);

    const version = this.add.text(width / 2, height - 40, 'v0.1.0', {
      fontSize: '14px',
      color: '#6272a4'
    }).setOrigin(0.5);

    start.on('pointerup', () => {
      this.scene.start('GameScene', { mode: 'standard' });
    });

    meta.on('pointerup', () => {
      this.scene.start('MetaScene');
    });

    settings.on('pointerup', () => {
      this.saveSystem.toggleSetting('screenshake');
      settings.setText(`Settings (screenshake: ${this.saveSystem.getSettings().screenshake ? 'on' : 'off'})`);
    });

    credits.on('pointerup', () => {
      this.add.text(width / 2, 520, 'Built by Arena Waves Team', {
        fontSize: '14px',
        color: '#6272a4'
      }).setOrigin(0.5);
    });

    version.setInteractive().on('pointerup', () => {
      this.add.text(width / 2, height - 20, 'Powered by Phaser 3 + Vite', {
        fontSize: '12px',
        color: '#6272a4'
      }).setOrigin(0.5);
    });
  }
}
