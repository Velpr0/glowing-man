import { WaveConfig } from '../config/schema';
import { RNG } from '../utils/rng';

export type WaveState = {
  index: number;
  elapsed: number;
  remaining: number;
};

export class WaveDirector {
  private waves: WaveConfig[];
  private rng: RNG;
  private state: WaveState;

  constructor(waves: WaveConfig[], rng: RNG) {
    this.waves = waves;
    this.rng = rng;
    this.state = {
      index: 0,
      elapsed: 0,
      remaining: waves[0]?.spawnCount ?? 0
    };
  }

  getCurrentWave(): WaveConfig {
    return this.waves[this.state.index];
  }

  getWaveIndex(): number {
    return this.state.index + 1;
  }

  update(deltaSeconds: number): void {
    this.state.elapsed += deltaSeconds;
  }

  shouldEndWave(activeEnemies: number): boolean {
    const current = this.getCurrentWave();
    if (current.clearRequired) {
      return this.state.elapsed >= current.duration && activeEnemies === 0;
    }
    return this.state.elapsed >= current.duration;
  }

  nextWave(): void {
    this.state.index = Math.min(this.state.index + 1, this.waves.length - 1);
    this.state.elapsed = 0;
    this.state.remaining = this.getCurrentWave().spawnCount;
  }

  spawnAllowed(): boolean {
    return this.state.remaining > 0;
  }

  takeSpawnBatch(maxBatch: number): number {
    const amount = Math.min(maxBatch, this.state.remaining);
    this.state.remaining -= amount;
    return amount;
  }

  pickEnemy(): string {
    const wave = this.getCurrentWave();
    return wave.enemies[this.rng.int(0, wave.enemies.length - 1)];
  }
}
