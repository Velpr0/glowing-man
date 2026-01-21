import { describe, expect, it } from 'vitest';
import { CombatSystem } from '../systems/CombatSystem';
import { RNG } from '../utils/rng';

describe('CombatSystem', () => {
  it('rolls non-critical damage when crit chance is zero', () => {
    const system = new CombatSystem(new RNG(10));
    const result = system.rollDamage({ damage: 10, critChance: 0, critDamage: 2 });
    expect(result.crit).toBe(false);
    expect(result.damage).toBe(10);
  });

  it('rolls critical damage when crit chance is one', () => {
    const system = new CombatSystem(new RNG(10));
    const result = system.rollDamage({ damage: 10, critChance: 1, critDamage: 2 });
    expect(result.crit).toBe(true);
    expect(result.damage).toBe(20);
  });

  it('returns positive damage values', () => {
    const system = new CombatSystem(new RNG(10));
    const result = system.rollDamage({ damage: 5, critChance: 0.5, critDamage: 1.5 });
    expect(result.damage).toBeGreaterThan(0);
  });
});
