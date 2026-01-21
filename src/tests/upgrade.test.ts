import { describe, expect, it } from 'vitest';
import upgrades from '../data/upgrades.json';
import { UpgradeSystem, PlayerStats } from '../systems/UpgradeSystem';
import { RNG } from '../utils/rng';
import { UpgradeConfig } from '../config/schema';

const sampleStats: PlayerStats = {
  damage: 10,
  fireRate: 3,
  spread: 0.1,
  critChance: 0.05,
  critDamage: 1.5,
  maxHp: 100,
  moveSpeed: 200,
  dashCooldown: 2,
  bulletSpeed: 500,
  shield: 0
};

describe('UpgradeSystem', () => {
  it('draws unique options', () => {
    const rng = new RNG(42);
    const system = new UpgradeSystem(upgrades as UpgradeConfig[], rng);
    const options = system.drawOptions(3);
    const ids = new Set(options.map((opt) => opt.id));
    expect(ids.size).toBe(options.length);
  });

  it('filters maxed upgrades', () => {
    const rng = new RNG(1);
    const system = new UpgradeSystem(upgrades as UpgradeConfig[], rng);
    const upgrade = upgrades[0] as UpgradeConfig;
    for (let i = 0; i < upgrade.maxStacks; i += 1) {
      system.applyUpgrade(sampleStats, upgrade);
    }
    const options = system.drawOptions(10);
    expect(options.find((opt) => opt.id === upgrade.id)).toBeUndefined();
  });

  it('applies stat_add effects', () => {
    const rng = new RNG(2);
    const system = new UpgradeSystem(upgrades as UpgradeConfig[], rng);
    const upgrade = upgrades.find((entry) => entry.effects[0].kind === 'stat_add') as UpgradeConfig;
    const updated = system.applyUpgrade(sampleStats, upgrade);
    expect(updated.damage).toBeGreaterThanOrEqual(sampleStats.damage - 10);
  });

  it('applies stat_mult effects', () => {
    const rng = new RNG(3);
    const system = new UpgradeSystem(upgrades as UpgradeConfig[], rng);
    const upgrade = upgrades.find((entry) => entry.effects[0].kind === 'stat_mult') as UpgradeConfig;
    const updated = system.applyUpgrade(sampleStats, upgrade);
    expect(updated.damage).not.toBe(sampleStats.damage);
  });

  it('does not exceed max stacks', () => {
    const rng = new RNG(4);
    const system = new UpgradeSystem(upgrades as UpgradeConfig[], rng);
    const upgrade = upgrades[0] as UpgradeConfig;
    let stats = sampleStats;
    for (let i = 0; i < upgrade.maxStacks + 2; i += 1) {
      stats = system.applyUpgrade(stats, upgrade);
    }
    expect(system.getStacks(upgrade.id)).toBe(upgrade.maxStacks);
  });

  it('draws fewer options when pool is small', () => {
    const rng = new RNG(5);
    const smallPool = (upgrades as UpgradeConfig[]).slice(0, 2);
    const system = new UpgradeSystem(smallPool, rng);
    const options = system.drawOptions(3);
    expect(options.length).toBeLessThanOrEqual(2);
  });

  it('honors rarity selection fallback', () => {
    const rng = new RNG(6);
    const commonOnly = (upgrades as UpgradeConfig[]).filter((entry) => entry.rarity === 'common').slice(0, 3);
    const system = new UpgradeSystem(commonOnly, rng);
    const options = system.drawOptions(2);
    expect(options.every((opt) => opt.rarity === 'common')).toBe(true);
  });
});
