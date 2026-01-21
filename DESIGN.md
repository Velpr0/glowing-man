# Arena Waves: Rogue Shooter - Design

## Core loop
1. Start a run from the menu.
2. Survive a wave (30–60s) of enemies.
3. Choose one upgrade from three options.
4. Repeat until you die or finish the boss wave.
5. Earn meta currency and spend it in the meta menu.

## Waves
- Eight normal waves plus a boss wave (configurable in `waves.json`).
- Each wave defines duration, spawn count, enemy mix, and clear conditions.
- Wave ends when timer reaches duration and enemies are cleared (`clearRequired`).

## Upgrades
- Three options per wave (weighted by rarity).
- Upgrades can stack up to `maxStacks`.
- Effects are component-based: `stat_add`, `stat_mult`, and `weapon_add`.
- Some upgrades are designed for crit builds, projectile builds, and survival builds.

## Meta progression
- Currency earned at run end based on wave reached.
- Meta nodes provide small stat bumps or unlock starting weapons.
- Meta growth is intentionally modest to preserve in-run build value.

## Boss
- Boss entry is defined in `enemies.json` and scheduled in `waves.json`.
- Future plan: add phase transitions and telegraphed skill indicators.

## Modes
- Standard mode ends after boss wave.
- Endless mode continues wave progression (planned in scene flow).

## Assumptions (v0.1.0)
- Single map layout with fixed obstacles.
- Minimal audio and UI, focusing on core combat loop.
- Weapon switching and advanced enemy behaviors will be added in future iterations.
