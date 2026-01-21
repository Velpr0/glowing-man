# Arena Waves: Rogue Shooter - Agent Guide

## Project structure
- `src/scenes`: Phaser scenes only (Boot, Menu, Game, Upgrade, Result, Meta).
- `src/entities`: Arcade physics entities (Player, Enemy, Bullet).
- `src/systems`: Game systems (WaveDirector, UpgradeSystem, SaveSystem, etc.).
- `src/data`: JSON configurations for all content. Do not hardcode gameplay numbers in code.
- `src/tests`: Vitest logic-only tests (no Phaser rendering).

## Conventions
- TypeScript strict mode; avoid `any`.
- All balance values belong in `src/data/*.json` and must pass schema validation.
- New systems should be added as separate files with focused responsibility.

## Scripts
- `npm run dev`: start local dev server.
- `npm run build`: typecheck + build.
- `npm run test`: run logic tests.

## Testing requirements
- Add tests for any new logic in `src/tests`.
- Keep tests deterministic by injecting `RNG`.

## Data rules
- When changing JSON config, update the schema if new fields are introduced.
- Keep localization keys in both `zh-CN` and `en-US`.
