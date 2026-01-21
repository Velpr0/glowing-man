import { describe, expect, it } from 'vitest';
import { loadGameData } from '../config/data';


describe('Game data', () => {
  it('loads and validates game data', () => {
    const data = loadGameData();
    expect(data.weapons.length).toBeGreaterThanOrEqual(6);
  });

  it('has at least 40 upgrades', () => {
    const data = loadGameData();
    expect(data.upgrades.length).toBeGreaterThanOrEqual(40);
  });

  it('has at least 15 meta nodes', () => {
    const data = loadGameData();
    expect(data.meta.length).toBeGreaterThanOrEqual(15);
  });
});
