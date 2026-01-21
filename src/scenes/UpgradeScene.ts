import Phaser from 'phaser';
import { UpgradeConfig } from '../config/schema';

export class UpgradeScene extends Phaser.Scene {
  constructor() {
    super('UpgradeScene');
  }

  create(data: { options: UpgradeConfig[] }): void {
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x0b0f1a, 0.85).setScrollFactor(0);
    this.add.text(width / 2, 120, 'Choose an Upgrade', { fontSize: '24px', color: '#e6edf3' }).setOrigin(0.5);

    const options = data.options.length > 0 ? data.options : [];
    const startX = width / 2 - 320;
    options.forEach((option, index) => {
      const x = startX + index * 320;
      const card = this.add.rectangle(x, height / 2, 240, 200, 0x1f2937).setInteractive();
      this.add.text(x, height / 2 - 60, option.name, { fontSize: '18px', color: '#8be9fd' }).setOrigin(0.5);
      this.add.text(x, height / 2 - 20, option.rarity.toUpperCase(), { fontSize: '12px', color: '#f1fa8c' }).setOrigin(0.5);
      this.add.text(x, height / 2 + 20, option.description, { fontSize: '12px', color: '#e6edf3', wordWrap: { width: 200 } }).setOrigin(0.5);

      card.on('pointerup', () => {
        this.scene.stop();
        const game = this.scene.get('GameScene');
        game.events.emit('upgrade-selected', option);
      });
    });

    if (options.length === 0) {
      this.add.text(width / 2, height / 2, 'Paused', { fontSize: '22px', color: '#e6edf3' }).setOrigin(0.5);
      this.input.once('pointerup', () => {
        this.scene.stop();
        this.scene.resume('GameScene');
      });
    }
  }
}
