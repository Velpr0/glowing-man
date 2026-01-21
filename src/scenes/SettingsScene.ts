import Phaser from 'phaser';
import { SaveSystem } from '../systems/SaveSystem';

export class SettingsScene extends Phaser.Scene {
  private saveSystem = new SaveSystem();

  constructor() {
    super('SettingsScene');
  }

  create(): void {
    const { width, height } = this.scale;
    this.add.text(width / 2, 120, 'Settings', { fontSize: '28px', color: '#e6edf3' }).setOrigin(0.5);

    const screenshake = this.add.text(width / 2, 220, '', {
      fontSize: '18px',
      color: '#8be9fd'
    }).setOrigin(0.5).setInteractive();

    const language = this.add.text(width / 2, 270, '', {
      fontSize: '18px',
      color: '#f1fa8c'
    }).setOrigin(0.5).setInteractive();

    const updateTexts = () => {
      const settings = this.saveSystem.getSettings();
      screenshake.setText(`Screenshake: ${settings.screenshake ? 'On' : 'Off'}`);
      language.setText(`Language: ${settings.language}`);
    };

    updateTexts();

    screenshake.on('pointerup', () => {
      this.saveSystem.toggleSetting('screenshake');
      updateTexts();
    });

    language.on('pointerup', () => {
      const current = this.saveSystem.getSettings().language;
      this.saveSystem.setLanguage(current === 'en-US' ? 'zh-CN' : 'en-US');
      updateTexts();
    });

    const back = this.add.text(width / 2, height - 80, 'Back', {
      fontSize: '20px',
      color: '#bd93f9'
    }).setOrigin(0.5).setInteractive();

    back.on('pointerup', () => {
      this.scene.start('MenuScene');
    });
  }
}
