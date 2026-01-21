import weapons from '../data/weapons.json';
import enemies from '../data/enemies.json';
import waves from '../data/waves.json';
import upgrades from '../data/upgrades.json';
import meta from '../data/meta.json';
import maps from '../data/maps.json';
import localization from '../data/localization.json';
import player from '../data/player.json';
import { gameDataSchema, GameData } from './schema';

export const loadGameData = (): GameData => {
  const data = {
    weapons,
    enemies,
    waves,
    upgrades,
    meta,
    maps,
    localization,
    player
  };
  const parsed = gameDataSchema.safeParse(data);
  if (!parsed.success) {
    console.error(parsed.error.format());
    throw new Error('Game data validation failed. See console for details.');
  }
  return parsed.data;
};
