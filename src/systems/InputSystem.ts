import Phaser from 'phaser';

export class InputSystem {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys: Record<string, Phaser.Input.Keyboard.Key>;

  constructor(scene: Phaser.Scene) {
    this.cursors = scene.input.keyboard?.createCursorKeys() ?? ({} as Phaser.Types.Input.Keyboard.CursorKeys);
    this.keys = scene.input.keyboard?.addKeys('W,A,S,D,SHIFT,Q,ESC') as Record<string, Phaser.Input.Keyboard.Key>;
  }

  getMovementVector(): Phaser.Math.Vector2 {
    const left = this.cursors.left?.isDown || this.keys.A?.isDown;
    const right = this.cursors.right?.isDown || this.keys.D?.isDown;
    const up = this.cursors.up?.isDown || this.keys.W?.isDown;
    const down = this.cursors.down?.isDown || this.keys.S?.isDown;
    const vec = new Phaser.Math.Vector2(
      (right ? 1 : 0) - (left ? 1 : 0),
      (down ? 1 : 0) - (up ? 1 : 0)
    );
    return vec.length() > 0 ? vec.normalize() : vec;
  }

  isDashPressed(): boolean {
    return Phaser.Input.Keyboard.JustDown(this.keys.SHIFT);
  }

  isSkillPressed(): boolean {
    return Phaser.Input.Keyboard.JustDown(this.keys.Q);
  }

  isPausePressed(): boolean {
    return Phaser.Input.Keyboard.JustDown(this.keys.ESC);
  }
}
