/**
 * SMRITARA 2.1 Unified Audio Service.
 * Robust browser speech synthesis with async voice loading, BCP-47 mapping,
 * line-by-line tracking, Chromium heartbeat, Web Audio chime synthesis, and observable state.
 */

export type AudioPlaybackState = 'idle' | 'playing' | 'paused' | 'error';

export interface AudioServiceState {
  playbackState: AudioPlaybackState;
  activeId: string | null;
  activeLanguage: string | null;
  currentText: string | null;
  currentLineIndex: number;
  totalLines: number;
  speechRate: number;
  voicesLoaded: boolean;
  voiceName: string | null;
  isVoiceFallback: boolean;
  error: string | null;
}

export interface PlaybackOptions {
  id?: string;
  language?: string; // 'telugu' | 'hindi' | 'sanskrit' | 'english' | BCP-47
  rate?: number; // 0.75 - 1.5
  pitch?: number;
  onStart?: () => void;
  onLineChange?: (lineIndex: number, lineText: string) => void;
  onEnd?: () => void;
  onError?: (err: string) => void;
}

type AudioStateListener = (state: AudioServiceState) => void;

class AudioService {
  private audioCtx: AudioContext | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private voicesLoaded = false;
  private listeners: Set<AudioStateListener> = new Set();
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private heartbeatInterval: any = null;
  private soundEffectsEnabled = true;

  private state: AudioServiceState = {
    playbackState: 'idle',
    activeId: null,
    activeLanguage: null,
    currentText: null,
    currentLineIndex: 0,
    totalLines: 0,
    speechRate: 1.0,
    voicesLoaded: false,
    voiceName: null,
    isVoiceFallback: false,
    error: null
  };

  constructor() {
    this.initVoices();
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const load = () => {
      this.voices = window.speechSynthesis.getVoices();
      if (this.voices.length > 0) {
        this.voicesLoaded = true;
        this.updateState({ voicesLoaded: true });
      }
    };

    load();
    if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
      window.speechSynthesis.onvoiceschanged = load;
    }
  }

  public subscribe(listener: AudioStateListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  public getState(): AudioServiceState {
    return this.state;
  }

  public setSoundEffectsEnabled(enabled: boolean) {
    this.soundEffectsEnabled = enabled;
  }

  public isSoundEffectsEnabled(): boolean {
    return this.soundEffectsEnabled;
  }

  private updateState(partial: Partial<AudioServiceState>) {
    this.state = { ...this.state, ...partial };
    this.listeners.forEach(fn => {
      try {
        fn(this.state);
      } catch (e) {
        console.error('Audio subscriber error:', e);
      }
    });
  }

  /**
   * Resolve best SpeechSynthesisVoice for requested language.
   */
  public resolveVoice(lang: string): { voice: SpeechSynthesisVoice | null; isFallback: boolean; langTag: string } {
    if (!this.voicesLoaded) {
      this.voices = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis.getVoices() : [];
      this.voicesLoaded = this.voices.length > 0;
    }

    const normLang = lang.toLowerCase().trim();
    let targetTag = 'en-US';
    let isSanskrit = false;

    if (normLang === 'telugu' || normLang.startsWith('te')) {
      targetTag = 'te-IN';
    } else if (normLang === 'hindi' || normLang.startsWith('hi')) {
      targetTag = 'hi-IN';
    } else if (normLang === 'sanskrit' || normLang.startsWith('sa')) {
      // Browsers lack native sa-IN voices. Hindi phonetics engine accurately articulates Devanagari Sanskrit
      targetTag = 'hi-IN';
      isSanskrit = true;
    } else {
      targetTag = 'en-US';
    }

    // Try exact tag match
    let match = this.voices.find(v => v.lang.toLowerCase() === targetTag.toLowerCase() || v.lang.toLowerCase().startsWith(targetTag.split('-')[0]));

    // Try voice name keyword match
    if (!match) {
      if (targetTag.startsWith('te')) {
        match = this.voices.find(v => v.name.toLowerCase().includes('telugu') || v.lang.toLowerCase().includes('te'));
      } else if (targetTag.startsWith('hi')) {
        match = this.voices.find(v => v.name.toLowerCase().includes('hindi') || v.lang.toLowerCase().includes('hi'));
      }
    }

    if (match) {
      return {
        voice: match,
        isFallback: isSanskrit, // Informative flag that Sanskrit uses Devanagari Hindi phonetics
        langTag: match.lang
      };
    }

    // Default fallback to first voice or system default
    const fallback = this.voices.find(v => v.default) || this.voices[0] || null;
    return {
      voice: fallback,
      isFallback: true,
      langTag: fallback ? fallback.lang : targetTag
    };
  }

  /**
   * Recite a poem, mantra, or passage with state observation and line tracking.
   */
  public speak(text: string, options: PlaybackOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        const errMsg = 'Speech synthesis is not supported on this browser or platform.';
        this.updateState({ playbackState: 'error', error: errMsg });
        options.onError?.(errMsg);
        reject(new Error(errMsg));
        return;
      }

      this.stop(); // Stop any active playback

      // Clean text: strip metadata and normalize whitespace
      const cleanText = text.trim();
      if (!cleanText) {
        resolve();
        return;
      }

      const lines = cleanText.split('\n').map(l => l.trim()).filter(Boolean);
      const language = options.language || 'english';
      const rate = options.rate || this.state.speechRate;
      const { voice, isFallback, langTag } = this.resolveVoice(language);

      this.updateState({
        playbackState: 'playing',
        activeId: options.id || 'general',
        activeLanguage: language,
        currentText: cleanText,
        currentLineIndex: 0,
        totalLines: lines.length,
        speechRate: rate,
        voiceName: voice ? voice.name : 'System Default',
        isVoiceFallback: isFallback,
        error: null
      });

      const utterance = new SpeechSynthesisUtterance(cleanText);
      this.activeUtterance = utterance; // Prevent garbage collection bug in Chromium

      if (voice) utterance.voice = voice;
      utterance.lang = langTag;
      utterance.rate = rate;
      utterance.pitch = options.pitch || 1.0;

      // Chrome long-speech heartbeat
      this.startHeartbeat();

      utterance.onstart = () => {
        options.onStart?.();
        this.updateState({ playbackState: 'playing' });
      };

      utterance.onend = () => {
        this.stopHeartbeat();
        this.activeUtterance = null;
        this.updateState({
          playbackState: 'idle',
          activeId: null,
          currentText: null,
          currentLineIndex: lines.length,
          error: null
        });
        options.onEnd?.();
        resolve();
      };

      utterance.onerror = (e) => {
        this.stopHeartbeat();
        this.activeUtterance = null;
        // Ignore user cancellation errors (e.g. user pressed stop)
        if (e.error === 'canceled' || e.error === 'interrupted') {
          this.updateState({ playbackState: 'idle', activeId: null });
          resolve();
          return;
        }

        const errMsg = `Speech playback encountered an issue: ${e.error || 'Unknown speech error'}`;
        this.updateState({ playbackState: 'error', error: errMsg });
        options.onError?.(errMsg);
        resolve(); // Resolve gracefully to prevent uncaught promise rejection
      };

      // Boundary event for line estimation
      utterance.onboundary = (e) => {
        if (e.name === 'sentence' || e.name === 'word') {
          const charIndex = e.charIndex;
          let counted = 0;
          for (let i = 0; i < lines.length; i++) {
            counted += lines[i].length + 1;
            if (charIndex < counted) {
              this.updateState({ currentLineIndex: i });
              options.onLineChange?.(i, lines[i]);
              break;
            }
          }
        }
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  public pause() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        this.updateState({ playbackState: 'paused' });
      }
    }
  }

  public resume() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        this.updateState({ playbackState: 'playing' });
      }
    }
  }

  public stop() {
    this.stopHeartbeat();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.activeUtterance = null;
    this.updateState({
      playbackState: 'idle',
      activeId: null,
      currentText: null,
      error: null
    });
  }

  public setRate(newRate: number) {
    this.updateState({ speechRate: newRate });
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }
    }, 10000);
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // --- WEB AUDIO API SYNTHESIZER ---

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  /**
   * Resonant Tibetan singing bowl / bronze temple bell harmonic chime.
   */
  public playTempleBell(pitchMultiplier = 1.0, masterVolume = 0.35) {
    if (!this.soundEffectsEnabled) return;

    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const baseFreq = 261.63 * pitchMultiplier; // Middle C

    // Rich physical resonance harmonics (bronze bell ratios)
    const harmonics = [1, 2.01, 3.01, 4.15];
    const gains = [0.4, 0.22, 0.14, 0.07];

    harmonics.forEach((harmonic, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * harmonic, now);

      const targetGain = gains[idx] * masterVolume;
      gain.gain.setValueAtTime(targetGain, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 2.6);
    });
  }

  /**
   * Subtle UI click/tap feedback tone
   */
  public playClick() {
    this.playCue(640, 0.04, 'sine');
  }

  /**
   * Starting an activity chime
   */
  public playStartChime() {
    if (!this.soundEffectsEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    [440, 554.37, 659.25].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.12, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.36);
    });
  }

  /**
   * Rewarding success / completion bell
   */
  public playSuccessBell() {
    if (!this.soundEffectsEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      gain.gain.setValueAtTime(0.15, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 1.25);
    });
  }

  /**
   * Gentle, soft error chime (non-jarring, respectful)
   */
  public playSoftMistake() {
    if (!this.soundEffectsEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(260, now + 0.25);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  /**
   * Synchronized breathing inhale cue (gently rising soft harmonic frequency)
   */
  public playInhaleCue() {
    if (!this.soundEffectsEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.6);
    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.7);
  }

  /**
   * Synchronized breathing exhale cue (gently descending frequency)
   */
  public playExhaleCue() {
    if (!this.soundEffectsEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.6);
    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.7);
  }

  /**
   * Synchronized breathing hold cue (subtle soft steady tone)
   */
  public playHoldCue() {
    if (!this.soundEffectsEnabled) return;
    this.playCue(350, 0.25, 'sine');
  }

  /**
   * Generic subtle feedback cue
   */
  public playCue(frequency = 520, duration = 0.12, type: OscillatorType = 'sine') {
    if (!this.soundEffectsEnabled) return;

    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, now);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  // --- AMBIENT SOUND GENERATOR & DUCKING ---
  private ambientOscs: OscillatorNode[] = [];
  private ambientGain: GainNode | null = null;
  private isAmbientOn = false;

  public startAmbient() {
    if (this.isAmbientOn) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.035, ctx.currentTime);
      gain.connect(ctx.destination);
      this.ambientGain = gain;

      // Warm 432Hz ambient chord (fundamental, fifth, octave)
      const freqs = [108, 162, 216];
      this.ambientOscs = freqs.map(f => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime);
        osc.connect(gain);
        osc.start();
        return osc;
      });
      this.isAmbientOn = true;
    } catch {
      // ignore
    }
  }

  public stopAmbient() {
    if (!this.isAmbientOn) return;
    try {
      this.ambientOscs.forEach(o => {
        try { o.stop(); o.disconnect(); } catch {}
      });
      this.ambientOscs = [];
      if (this.ambientGain) {
        this.ambientGain.disconnect();
        this.ambientGain = null;
      }
      this.isAmbientOn = false;
    } catch {}
  }

  public toggleAmbient(): boolean {
    if (this.isAmbientOn) {
      this.stopAmbient();
      return false;
    } else {
      this.startAmbient();
      return true;
    }
  }

  public isAmbientActive(): boolean {
    return this.isAmbientOn;
  }

  public duckAmbient(durationMs = 3000) {
    if (!this.isAmbientOn || !this.ambientGain) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      this.ambientGain.gain.setValueAtTime(0.035, now);
      this.ambientGain.gain.linearRampToValueAtTime(0.008, now + 0.3);
      this.ambientGain.gain.linearRampToValueAtTime(0.035, now + durationMs / 1000);
    } catch {}
  }
}

export const audioService = new AudioService();
