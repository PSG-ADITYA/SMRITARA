import { createSeededRandom, pickRandom, randomInt } from './seededRandom';

export type GameDifficulty = 'easy' | 'medium' | 'hard';
export type TempoSetting = 'slow' | 'moderate' | 'brisk';

export interface MusicalNoteDef {
  id: string; // e.g., 'C4', 'D4'
  name: string; // e.g., 'Do', 'Re' or 'Sa', 'Re'
  swara: string; // Indian classical swara: Sa, Re, Ga, Ma, Pa, Dha, Ni, Sa'
  frequency: number; // Hz
  color: string;
  padIndex: number;
}

export const MUSICAL_SCALE: MusicalNoteDef[] = [
  { id: 'C4', name: 'C4', swara: 'Sa (सा)', frequency: 261.63, color: '#2563EB', padIndex: 0 },
  { id: 'D4', name: 'D4', swara: 'Re (रे)', frequency: 293.66, color: '#059669', padIndex: 1 },
  { id: 'E4', name: 'E4', swara: 'Ga (ग)', frequency: 329.63, color: '#D97706', padIndex: 2 },
  { id: 'F4', name: 'F4', swara: 'Ma (म)', frequency: 349.23, color: '#DC2626', padIndex: 3 },
  { id: 'G4', name: 'G4', swara: 'Pa (प)', frequency: 392.00, color: '#7C3AED', padIndex: 4 },
  { id: 'A4', name: 'A4', swara: 'Dha (ध)', frequency: 440.00, color: '#DB2777', padIndex: 5 },
  { id: 'B4', name: 'B4', swara: 'Ni (नि)', frequency: 493.88, color: '#0891B2', padIndex: 6 },
  { id: 'C5', name: 'C5', swara: 'Sȧ (सां)', frequency: 523.25, color: '#16A34A', padIndex: 7 },
];

export interface MelodyRound {
  id: string;
  sequence: MusicalNoteDef[];
  activePadCount: number; // e.g. 4 pads on easy, 6 on medium, 8 on hard
  availableNotes: MusicalNoteDef[];
  tempoBpm: number;
  noteDurationMs: number;
  pauseBetweenNotesMs: number;
  difficulty: GameDifficulty;
}

/**
 * Returns tempo timing in milliseconds
 */
export function getTempoTiming(tempo: TempoSetting): { bpm: number; durationMs: number; pauseMs: number } {
  switch (tempo) {
    case 'slow':
      return { bpm: 75, durationMs: 450, pauseMs: 250 };
    case 'brisk':
      return { bpm: 130, durationMs: 260, pauseMs: 140 };
    case 'moderate':
    default:
      return { bpm: 100, durationMs: 350, pauseMs: 180 };
  }
}

/**
 * Generates a procedurally calibrated musical melody round
 */
export function generateMelodyRound(
  difficulty: GameDifficulty = 'medium',
  tempo: TempoSetting = 'moderate',
  seed?: number | string
): MelodyRound {
  const rng = createSeededRandom(seed);
  const timing = getTempoTiming(tempo);

  let activePadCount = 5;
  let sequenceLength = 4;

  if (difficulty === 'easy') {
    activePadCount = 4;
    sequenceLength = 3;
  } else if (difficulty === 'medium') {
    activePadCount = 6;
    sequenceLength = 5;
  } else {
    activePadCount = 8;
    sequenceLength = 7;
  }

  const availableNotes = MUSICAL_SCALE.slice(0, activePadCount);
  const sequence: MusicalNoteDef[] = [];

  for (let i = 0; i < sequenceLength; i++) {
    // Avoid same note more than twice consecutively
    const candidates = availableNotes.filter(
      (n, _, arr) => i < 2 || !(sequence[i - 1].id === n.id && sequence[i - 2].id === n.id)
    );
    const chosen = pickRandom(candidates.length > 0 ? candidates : availableNotes, rng);
    sequence.push(chosen);
  }

  return {
    id: `melody_${Date.now()}_${randomInt(1000, 9999, rng)}`,
    sequence,
    activePadCount,
    availableNotes,
    tempoBpm: timing.bpm,
    noteDurationMs: timing.durationMs,
    pauseBetweenNotesMs: timing.pauseMs,
    difficulty,
  };
}

/**
 * Web Audio API Tone Synthesizer
 * Uses pure harmonic sine waves with smooth exponential volume envelopes.
 */
class MelodySynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.6;

  private getContext(): AudioContext | null {
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

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  public isSoundMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Synthesizes a clean musical note tone with subtle harmonics and warm envelope
   */
  public playTone(frequency: number, durationMs: number = 350): void {
    if (this.isMuted || this.volume <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const durationSec = durationMs / 1000;

      // Master Gain for smooth envelope
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.0001, now);
      // Fast attack
      gainNode.gain.exponentialRampToValueAtTime(this.volume * 0.35, now + 0.02);
      // Exponential decay
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);
      gainNode.connect(ctx.destination);

      // Primary Oscillator (warm triangle/sine blend)
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(frequency, now);
      osc1.connect(gainNode);

      // Secondary Subtle Harmonic (+1 octave subtle shimmer)
      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(frequency * 2, now);
      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.08, now);
      osc2.connect(subGain);
      subGain.connect(gainNode);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + durationSec + 0.05);
      osc2.stop(now + durationSec + 0.05);
    } catch (e) {
      console.warn('Synthesizer tone generation deferred:', e);
    }
  }

  /**
   * Plays a sequence of notes sequentially with specified tempo
   */
  public async playSequence(
    notes: MusicalNoteDef[],
    timing: { durationMs: number; pauseMs: number },
    onNoteStart?: (note: MusicalNoteDef, index: number) => void
  ): Promise<void> {
    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      if (onNoteStart) onNoteStart(note, i);
      this.playTone(note.frequency, timing.durationMs);
      await new Promise(res => setTimeout(res, timing.durationMs + timing.pauseMs));
    }
  }
}

export const melodySynth = new MelodySynthesizer();

/**
 * Validates note selection against expected sequence
 */
export function validateMelodyStep(
  round: MelodyRound,
  userSelectedNoteIds: string[],
  clickedNoteId: string
): { isCorrect: boolean; isComplete: boolean; expectedNote: MusicalNoteDef } {
  const currentStep = userSelectedNoteIds.length;
  const expectedNote = round.sequence[currentStep];
  const isCorrect = clickedNoteId === expectedNote.id;
  const nextLength = isCorrect ? currentStep + 1 : currentStep;
  const isComplete = isCorrect && nextLength === round.sequence.length;

  return {
    isCorrect,
    isComplete,
    expectedNote,
  };
}

/**
 * Calculates score for Memory Melody
 */
export function calculateMelodyScore(
  round: MelodyRound,
  correctCount: number,
  replayCount: number,
  elapsedSeconds: number
): { score: number; accuracy: number; points: number } {
  const accuracy = Math.round((correctCount / round.sequence.length) * 100);
  const diffMultiplier = round.difficulty === 'hard' ? 1.4 : round.difficulty === 'medium' ? 1.0 : 0.8;
  const replayPenalty = Math.min(25, replayCount * 8);
  const speedBonus = Math.max(0, 20 - elapsedSeconds) * 2;

  const baseScore = accuracy * diffMultiplier;
  const score = Math.max(10, Math.min(100, Math.round(baseScore + speedBonus - replayPenalty)));
  const points = Math.round((score / 100) * (round.difficulty === 'hard' ? 55 : round.difficulty === 'medium' ? 40 : 25));

  return { score, accuracy, points };
}
