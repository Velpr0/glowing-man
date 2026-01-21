import { describe, expect, it, beforeEach } from 'vitest';
import { SaveSystem } from '../systems/SaveSystem';

type StorageMap = Record<string, string>;

const makeStorage = () => {
  const store: StorageMap = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach((key) => delete store[key]);
    }
  } as Storage;
};

beforeEach(() => {
  // @ts-expect-error override for test
  global.localStorage = makeStorage();
});

describe('SaveSystem', () => {
  it('stores and loads currency', () => {
    const save = new SaveSystem();
    save.addCurrency(25);
    const next = new SaveSystem();
    expect(next.getCurrency()).toBe(25);
  });

  it('unlocks meta nodes', () => {
    const save = new SaveSystem();
    save.unlockMeta('meta_hp_1');
    expect(save.isMetaUnlocked('meta_hp_1')).toBe(true);
  });

  it('toggles settings', () => {
    const save = new SaveSystem();
    const original = save.getSettings().screenshake;
    save.toggleSetting('screenshake');
    expect(save.getSettings().screenshake).toBe(!original);
  });
});
