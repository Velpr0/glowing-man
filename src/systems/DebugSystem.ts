import Phaser from 'phaser';

export class DebugSystem {
  private text: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.text = scene.add.text(10, 10, '', {
      fontSize: '12px',
      color: '#8be9fd'
    }).setDepth(1000);
  }

  update(data: { fps: number; bullets: number; enemies: number; wave: number; seed: number }): void {
    this.text.setText([
      `FPS: ${data.fps.toFixed(0)}`,
      `Bullets: ${data.bullets}`,
      `Enemies: ${data.enemies}`,
      `Wave: ${data.wave}`,
      `Seed: ${data.seed}`
    ]);
  }
}
