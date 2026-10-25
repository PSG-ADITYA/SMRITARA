/**
 * Audio Engine for SMRITARA Smriti Veda.
 * Uses Web Audio API for synthetic bell/chime tones and Web Speech API for recitation.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;

  private initCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Plays a resonant singing bowl / temple bell harmonic chime
   */
  public playTempleBell(pitchMultiplier = 1.0) {
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const baseFreq = 261.63 * pitchMultiplier; // Middle C

    // Fundamental + harmonics for rich bronze bell timbre
    const harmonics = [1, 2.01, 3.01, 4.15];
    const gains = [0.4, 0.25, 0.15, 0.08];

    harmonics.forEach((harmonic, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * harmonic, now);

      gain.gain.setValueAtTime(gains[idx], now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 2.5);
    });
  }

  /**
   * Plays a crisp cue tone for game memory clicks
   */
  public playCue(frequency = 520, duration = 0.15, type: OscillatorType = 'sine') {
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, now);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  /**
   * Recites text via browser SpeechSynthesis API
   */
  public speakText(text: string, lang = 'en-US', rate = 0.85): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel(); // cancel any active utterance

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = 1.0;

      // Map language tags
      if (lang === 'telugu') utterance.lang = 'te-IN';
      else if (lang === 'hindi' || lang === 'sanskrit') utterance.lang = 'hi-IN';
      else utterance.lang = 'en-US';

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    });
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const soundEngine = new SoundEngine();
