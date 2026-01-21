import { describe, expect, it } from 'vitest';
import { RNG } from '../utils/rng';

describe('RNG', () => {
  it('produces reproducible sequences with same seed', () => {
    const rngA = new RNG(12345);
    const rngB = new RNG(12345);
    const seqA = Array.from({ length: 5 }, () => rngA.next());
    const seqB = Array.from({ length: 5 }, () => rngB.next());
    expect(seqA).toEqual(seqB);
  });

  it('generates integers in range', () => {
    const rng = new RNG(999);
    for (let i = 0; i < 20; i += 1) {
      const value = rng.int(2, 4);
      expect(value).toBeGreaterThanOrEqual(2);
      expect(value).toBeLessThanOrEqual(4);
    }
  });
});
