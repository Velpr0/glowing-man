import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { MenuScene } from './scenes/MenuScene';
import { GameScene } from './scenes/GameScene';
import { UpgradeScene } from './scenes/UpgradeScene';
import { ResultScene } from './scenes/ResultScene';
import { MetaScene } from './scenes/MetaScene';
import { PauseScene } from './scenes/PauseScene';
import { SettingsScene } from './scenes/SettingsScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  width: 1200,
  height: 800,
  backgroundColor: '#0d0f16',
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scene: [BootScene, MenuScene, MetaScene, SettingsScene, GameScene, UpgradeScene, ResultScene, PauseScene]
};

new Phaser.Game(config);
