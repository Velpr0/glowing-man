import { describe, expect, it } from 'vitest';
import waves from '../data/waves.json';
import { WaveDirector } from '../systems/WaveDirector';
import { RNG } from '../utils/rng';
import { WaveConfig } from '../config/schema';

describe('WaveDirector', () => {
  it('initializes first wave', () => {
    const director = new WaveDirector(waves as WaveConfig[], new RNG(7));
    expect(director.getWaveIndex()).toBe(1);
  });

  it('advances to next wave', () => {
    const director = new WaveDirector(waves as WaveConfig[], new RNG(7));
    director.nextWave();
    expect(director.getWaveIndex()).toBe(2);
  });

  it('tracks spawn counts', () => {
    const director = new WaveDirector(waves as WaveConfig[], new RNG(7));
    const wave = director.getCurrentWave();
    const taken = director.takeSpawnBatch(3);
    expect(taken).toBeLessThanOrEqual(wave.spawnCount);
  });

  it('does not spawn beyond remaining', () => {
    const director = new WaveDirector(waves as WaveConfig[], new RNG(7));
    const total = director.takeSpawnBatch(999);
    expect(total).toBe(director.getCurrentWave().spawnCount);
  });

  it('ends wave when duration and clear met', () => {
    const director = new WaveDirector(waves as WaveConfig[], new RNG(7));
    director.update(director.getCurrentWave().duration);
    expect(director.shouldEndWave(0)).toBe(true);
  });

  it('does not end wave if enemies remain', () => {
    const director = new WaveDirector(waves as WaveConfig[], new RNG(7));
    director.update(director.getCurrentWave().duration);
    expect(director.shouldEndWave(2)).toBe(false);
  });

  it('reports remaining time', () => {
    const director = new WaveDirector(waves as WaveConfig[], new RNG(7));
    director.update(1);
    expect(director.getTimeRemaining()).toBeLessThan(director.getCurrentWave().duration);
  });

  it('picks enemy from wave list', () => {
    const director = new WaveDirector(waves as WaveConfig[], new RNG(7));
    const pick = director.pickEnemy();
    expect(director.getCurrentWave().enemies).toContain(pick);
  });
});
