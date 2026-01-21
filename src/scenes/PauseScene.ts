import Phaser from 'phaser';

export class PauseScene extends Phaser.Scene {
  constructor() {
    super('PauseScene');
  }

  create(): void {
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x0b0f1a, 0.85).setScrollFactor(0);
    this.add.text(width / 2, 160, 'Paused', { fontSize: '28px', color: '#e6edf3' }).setOrigin(0.5);

    const resume = this.add.text(width / 2, 260, 'Resume', { fontSize: '22px', color: '#8be9fd' }).setOrigin(0.5).setInteractive();
    const quit = this.add.text(width / 2, 320, 'Quit to Menu', { fontSize: '20px', color: '#bd93f9' }).setOrigin(0.5).setInteractive();

    resume.on('pointerup', () => {
      const gameScene = this.scene.get('GameScene');
      gameScene.events.emit('resume-game');
      this.scene.stop();
      this.scene.resume('GameScene');
    });

    quit.on('pointerup', () => {
      this.scene.stop('GameScene');
      this.scene.start('MenuScene');
    });
  }
}
