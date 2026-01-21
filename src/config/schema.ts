import { z } from 'zod';

export const weaponSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['pistol', 'smg', 'shotgun', 'rifle', 'sniper', 'energy']),
  baseDamage: z.number().positive(),
  fireRate: z.number().positive(),
  projectiles: z.number().int().positive(),
  spread: z.number().nonnegative(),
  speed: z.number().positive(),
  pierce: z.number().int().nonnegative(),
  auto: z.boolean()
});

export const enemySchema = z.object({
  id: z.string(),
  name: z.string(),
  hp: z.number().positive(),
  speed: z.number().positive(),
  damage: z.number().positive(),
  behavior: z.enum(['melee', 'ranged', 'charger', 'exploder', 'summoner', 'shielded']),
  elite: z.boolean().default(false)
});

export const waveSchema = z.object({
  id: z.string(),
  duration: z.number().positive(),
  spawnCount: z.number().int().positive(),
  enemies: z.array(z.string()),
  eliteChance: z.number().min(0).max(1),
  clearRequired: z.boolean()
});

export const upgradeEffectSchema = z.object({
  kind: z.enum(['stat_add', 'stat_mult', 'weapon_add']),
  stat: z.string(),
  value: z.number()
});

export const upgradeSchema = z.object({
  id: z.string(),
  name: z.string(),
  rarity: z.enum(['common', 'uncommon', 'rare', 'epic']),
  maxStacks: z.number().int().positive(),
  effects: z.array(upgradeEffectSchema),
  description: z.string()
});

export const metaSchema = z.object({
  id: z.string(),
  name: z.string(),
  cost: z.number().int().positive(),
  type: z.enum(['stat', 'unlock', 'reroll']),
  value: z.number().optional(),
  description: z.string()
});

export const mapSchema = z.object({
  id: z.string(),
  name: z.string(),
  width: z.number().positive(),
  height: z.number().positive(),
  spawnPoints: z.array(z.object({ x: z.number(), y: z.number() })),
  obstacles: z.array(z.object({ x: z.number(), y: z.number(), w: z.number(), h: z.number() }))
});

export const localizationSchema = z.record(z.string(), z.record(z.string(), z.string()));

export const playerSchema = z.object({
  maxHp: z.number().positive(),
  moveSpeed: z.number().positive(),
  critChance: z.number().min(0).max(1),
  critDamage: z.number().positive(),
  dash: z.object({
    speedMultiplier: z.number().positive(),
    duration: z.number().positive(),
    cooldown: z.number().positive(),
    iFrames: z.number().nonnegative()
  }),
  skill: z.object({
    name: z.string(),
    radius: z.number().positive(),
    damage: z.number().positive(),
    cooldown: z.number().positive()
  })
});

export const gameDataSchema = z.object({
  weapons: z.array(weaponSchema).min(6),
  enemies: z.array(enemySchema).min(6),
  waves: z.array(waveSchema).min(9),
  upgrades: z.array(upgradeSchema).min(40),
  meta: z.array(metaSchema).min(15),
  maps: z.array(mapSchema).min(1),
  localization: localizationSchema,
  player: playerSchema
});

export type WeaponConfig = z.infer<typeof weaponSchema>;
export type EnemyConfig = z.infer<typeof enemySchema>;
export type WaveConfig = z.infer<typeof waveSchema>;
export type UpgradeConfig = z.infer<typeof upgradeSchema>;
export type MetaConfig = z.infer<typeof metaSchema>;
export type MapConfig = z.infer<typeof mapSchema>;
export type GameData = z.infer<typeof gameDataSchema>;
export type PlayerConfig = z.infer<typeof playerSchema>;
