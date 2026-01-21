import Phaser from 'phaser';
import { GameData } from '../config/schema';
import { SaveSystem } from '../systems/SaveSystem';

export class MetaScene extends Phaser.Scene {
  private saveSystem = new SaveSystem();

  constructor() {
    super('MetaScene');
  }

  create(): void {
    const data = this.registry.get('gameData') as GameData;
    const { width, height } = this.scale;
    this.add.text(width / 2, 80, 'Meta Growth', { fontSize: '28px', color: '#e6edf3' }).setOrigin(0.5);

    const currencyText = this.add.text(width / 2, 120, `Currency: ${this.saveSystem.getCurrency()}`, {
      fontSize: '16px',
      color: '#f1fa8c'
    }).setOrigin(0.5);

    const startY = 170;
    data.meta.forEach((node, index) => {
      const y = startY + index * 26;
      const unlocked = this.saveSystem.isMetaUnlocked(node.id);
      const text = this.add.text(80, y, `${node.name} (${node.cost})`, {
        fontSize: '14px',
        color: unlocked ? '#50fa7b' : '#bd93f9'
      }).setInteractive();
      text.on('pointerup', () => {
        if (!unlocked && this.saveSystem.getCurrency() >= node.cost) {
          this.saveSystem.addCurrency(-node.cost);
          this.saveSystem.unlockMeta(node.id);
          text.setColor('#50fa7b');
          currencyText.setText(`Currency: ${this.saveSystem.getCurrency()}`);
        }
      });
    });

    const back = this.add.text(width / 2, height - 60, 'Back', { fontSize: '18px', color: '#8be9fd' }).setOrigin(0.5).setInteractive();
    back.on('pointerup', () => {
      this.scene.start('MenuScene');
    });
  }
}
