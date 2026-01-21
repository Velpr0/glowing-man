import { UpgradeConfig } from '../config/schema';
import { RNG } from '../utils/rng';

export type PlayerStats = {
  damage: number;
  fireRate: number;
  spread: number;
  critChance: number;
  critDamage: number;
  maxHp: number;
  moveSpeed: number;
  dashCooldown: number;
  bulletSpeed: number;
  shield: number;
};

export type UpgradeState = {
  stacks: Record<string, number>;
};

export class UpgradeSystem {
  private upgrades: UpgradeConfig[];
  private rng: RNG;
  private state: UpgradeState = { stacks: {} };

  constructor(upgrades: UpgradeConfig[], rng: RNG) {
    this.upgrades = upgrades;
    this.rng = rng;
  }

  getStacks(id: string): number {
    return this.state.stacks[id] ?? 0;
  }

  applyUpgrade(stats: PlayerStats, upgrade: UpgradeConfig): PlayerStats {
    const currentStacks = this.getStacks(upgrade.id);
    if (currentStacks >= upgrade.maxStacks) {
      return stats;
    }
    this.state.stacks[upgrade.id] = currentStacks + 1;
    const nextStats = { ...stats };
    for (const effect of upgrade.effects) {
      if (effect.kind === 'stat_add') {
        // @ts-expect-error dynamic stat
        nextStats[effect.stat] = (nextStats[effect.stat] ?? 0) + effect.value;
      }
      if (effect.kind === 'stat_mult') {
        // @ts-expect-error dynamic stat
        nextStats[effect.stat] = (nextStats[effect.stat] ?? 1) * effect.value;
      }
      if (effect.kind === 'weapon_add') {
        // handled by GameScene for weapon stats
      }
    }
    return nextStats;
  }

  drawOptions(count = 3): UpgradeConfig[] {
    const eligible = this.upgrades.filter((upgrade) => this.getStacks(upgrade.id) < upgrade.maxStacks);
    const options: UpgradeConfig[] = [];
    const rarityWeights: Record<UpgradeConfig['rarity'], number> = {
      common: 0.55,
      uncommon: 0.25,
      rare: 0.15,
      epic: 0.05
    };
    while (options.length < count && eligible.length > 0) {
      const roll = this.rng.next();
      let cumulative = 0;
      let target: UpgradeConfig['rarity'] = 'common';
      for (const [rarity, weight] of Object.entries(rarityWeights) as [UpgradeConfig['rarity'], number][]) {
        cumulative += weight;
        if (roll <= cumulative) {
          target = rarity;
          break;
        }
      }
      const pool = eligible.filter((upgrade) => upgrade.rarity === target);
      const selectionPool = pool.length > 0 ? pool : eligible;
      const pick = selectionPool[this.rng.int(0, selectionPool.length - 1)];
      options.push(pick);
      const index = eligible.findIndex((item) => item.id === pick.id);
      if (index >= 0) {
        eligible.splice(index, 1);
      }
    }
    return options;
  }
}
