# Arena Waves: Rogue Shooter

A top-down roguelite shooter built with Phaser 3, TypeScript, and Vite. The game features wave-based combat, upgrades between waves, and light meta progression via local storage.

## Quick start

```bash
npm install
npm run dev
```

## Build & preview

```bash
npm run build
npm run preview
```

The build output is generated in `dist/`. You can deploy `dist/` to any static host (e.g. Nginx, GitHub Pages, or Netlify).

## Project structure

```
src/
  main.ts
  scenes/        # Boot/Menu/Game/Upgrade/Result/Meta
  entities/      # Player/Enemy/Bullet
  systems/       # WaveDirector/UpgradeSystem/Combat/Save/Input/Audio/Debug
  ui/            # HUD/UI helpers (currently Phaser text-driven)
  data/          # JSON configs for weapons/enemies/waves/upgrades/meta/maps/localization
  utils/         # RNG/EventBus
  config/        # Zod schema validation and data loader
  tests/         # Vitest logic tests
```

## Configuration tables

All gameplay values live in `src/data/*.json`. The configs are validated at boot using Zod schema definitions in `src/config/schema.ts`.

- `weapons.json`: weapons and base stats
- `enemies.json`: enemy definitions
- `waves.json`: wave schedule and spawn parameters
- `upgrades.json`: upgrade pool and effects
- `meta.json`: meta progression nodes
- `maps.json`: map layout, obstacles, spawn points
- `localization.json`: strings for `en-US` and `zh-CN`

## Debug overlay

In development builds, the HUD shows FPS, active bullets, enemies, wave, and seed. Use the seed for reproducible balance testing.

## Deployment

Serve the `dist/` folder with any static server. Example Nginx snippet:

```nginx
server {
  listen 80;
  server_name your-domain.com;
  root /var/www/arena-waves/dist;
  location / { try_files $uri /index.html; }
}
```
