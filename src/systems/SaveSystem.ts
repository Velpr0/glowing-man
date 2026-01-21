export type SaveData = {
  version: number;
  currency: number;
  metaUnlocks: Record<string, boolean>;
  settings: {
    screenshake: boolean;
    language: 'en-US' | 'zh-CN';
  };
};

const SAVE_KEY = 'arena-waves-save';
const SAVE_VERSION = 1;

export class SaveSystem {
  private data: SaveData;

  constructor() {
    this.data = this.load();
  }

  private defaultSave(): SaveData {
    return {
      version: SAVE_VERSION,
      currency: 0,
      metaUnlocks: {},
      settings: {
        screenshake: true,
        language: 'en-US'
      }
    };
  }

  private load(): SaveData {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      return this.defaultSave();
    }
    try {
      const parsed = JSON.parse(raw) as SaveData;
      if (parsed.version !== SAVE_VERSION) {
        return { ...this.defaultSave(), ...parsed, version: SAVE_VERSION };
      }
      return parsed;
    } catch {
      return this.defaultSave();
    }
  }

  save(): void {
    localStorage.setItem(SAVE_KEY, JSON.stringify(this.data));
  }

  getCurrency(): number {
    return this.data.currency;
  }

  addCurrency(amount: number): void {
    this.data.currency += amount;
    this.save();
  }

  unlockMeta(id: string): void {
    this.data.metaUnlocks[id] = true;
    this.save();
  }

  isMetaUnlocked(id: string): boolean {
    return Boolean(this.data.metaUnlocks[id]);
  }

  getSettings(): SaveData['settings'] {
    return this.data.settings;
  }

  toggleSetting(key: keyof SaveData['settings']): void {
    if (typeof this.data.settings[key] === 'boolean') {
      this.data.settings[key] = !this.data.settings[key];
      this.save();
    }
  }

  setLanguage(language: 'en-US' | 'zh-CN'): void {
    this.data.settings.language = language;
    this.save();
  }
}
