export class AudioSystem {
  play(key: 'shoot' | 'hit' | 'upgrade' | 'win' | 'lose'): void {
    if (process.env.NODE_ENV === 'development') {
      console.info(`[Audio] ${key}`);
    }
  }
}
