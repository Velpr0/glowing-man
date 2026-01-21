import { RNG } from '../utils/rng';

export type CombatStats = {
  damage: number;
  critChance: number;
  critDamage: number;
};

export class CombatSystem {
  constructor(private rng: RNG) {}

  rollDamage(stats: CombatStats): { damage: number; crit: boolean } {
    const crit = this.rng.next() < stats.critChance;
    const damage = crit ? stats.damage * stats.critDamage : stats.damage;
    return { damage, crit };
  }
}
