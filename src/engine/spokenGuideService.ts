export type SpokenPlaybackState = 'idle' | 'speaking' | 'paused';

export interface GuideEventListener {
  onStateChange?: (state: SpokenPlaybackState) => void;
  onSentence?: (sentence: string, fullText: string) => void;
  onEnd?: () => void;
}

class SpokenGuideService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private state: SpokenPlaybackState = 'idle';
  private currentFullText: string = '';
  private currentSentence: string = '';
  private isMuted: boolean = false;
  private volume: number = 1.0;
  private speechRate: number = 0.95; // Clear, calm pacing
  private preferredLang: string = 'en-US';
  private listeners: Set<GuideEventListener> = new Set();
  private isSupported: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.isSupported = true;
    }
  }

  public getIsSupported(): boolean {
    return this.isSupported;
  }

  public getState(): SpokenPlaybackState {
    return this.state;
  }

  public getCurrentSentence(): string {
    return this.currentSentence;
  }

  public getCurrentFullText(): string {
    return this.currentFullText;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (muted && this.state === 'speaking') {
      this.stop();
    }
  }

  public setRate(rate: number): void {
    this.speechRate = Math.max(0.5, Math.min(2.0, rate));
  }

  public setPreferredLanguage(lang: string): void {
    this.preferredLang = lang;
  }

  public subscribe(listener: GuideEventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyState(state: SpokenPlaybackState): void {
    this.state = state;
    this.listeners.forEach(l => l.onStateChange?.(state));
  }

  private notifySentence(sentence: string): void {
    this.currentSentence = sentence;
    this.listeners.forEach(l => l.onSentence?.(sentence, this.currentFullText));
  }

  private notifyEnd(): void {
    this.state = 'idle';
    this.currentSentence = '';
    this.listeners.forEach(l => {
      l.onStateChange?.('idle');
      l.onEnd?.();
    });
  }

  private findBestVoice(langPrefix: string = 'en'): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return null;

    // Prefer high quality English voices (Natural, Google, Samantha, Daniel)
    const matches = voices.filter(v => v.lang.toLowerCase().startsWith(langPrefix.toLowerCase()));
    const naturalVoice = matches.find(v => 
      v.name.includes('Natural') || 
      v.name.includes('Google') || 
      v.name.includes('Samantha') || 
      v.name.includes('Daniel')
    );

    return naturalVoice || matches[0] || voices[0] || null;
  }

  /**
   * Speaks the provided text with sentence-by-sentence caption broadcasting
   */
  public speak(text: string, options?: { onComplete?: () => void; rate?: number }): void {
    if (!this.isSupported || !this.synth) {
      console.warn('Speech synthesis not supported in this browser.');
      this.currentFullText = text;
      this.notifySentence(text);
      return;
    }

    if (this.isMuted) {
      this.currentFullText = text;
      this.notifySentence(text);
      return;
    }

    // Cancel ongoing speech cleanly
    this.stop();

    this.currentFullText = text;
    this.notifySentence(text);
    this.notifyState('speaking');

    const cleanText = text.replace(/[*_#`]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = options?.rate || this.speechRate;
    utterance.volume = this.volume;
    utterance.lang = this.preferredLang;

    const voice = this.findBestVoice(this.preferredLang.split('-')[0]);
    if (voice) {
      utterance.voice = voice;
    }

    // Track word/sentence boundary for live captions
    utterance.onboundary = (event) => {
      if (event.name === 'sentence' || event.charIndex !== undefined) {
        const remaining = cleanText.substring(event.charIndex);
        const sentenceMatch = remaining.match(/[^.!?]+[.!?]+/);
        if (sentenceMatch) {
          this.notifySentence(sentenceMatch[0].trim());
        }
      }
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      this.notifyEnd();
      options?.onComplete?.();
    };

    utterance.onerror = (e) => {
      // Interrupted error is normal when user cancels or pauses
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn('SpeechSynthesis error:', e.error);
      }
      this.currentUtterance = null;
      this.notifyEnd();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public pause(): void {
    if (this.synth && this.state === 'speaking') {
      this.synth.pause();
      this.notifyState('paused');
    }
  }

  public resume(): void {
    if (this.synth && this.state === 'paused') {
      this.synth.resume();
      this.notifyState('speaking');
    }
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
    this.notifyEnd();
  }
}

export const spokenGuideService = new SpokenGuideService();

/**
 * Pre-authored contextual guide scripts for all SMRITARA sections and games
 */
export const GUIDE_SCRIPTS = {
  welcome: "Welcome to SMRITARA. I am your Spoken Guide and AI Life Coach. This platform is designed to strengthen your cognitive stamina, working memory, and circadian discipline through factual training.",
  
  dashboard: "You are in your Personal Command Center. Here you can inspect your daily sleep balance, record quick check-ins, view today's wisdom tip, and track your practice points.",
  
  gamesCenter: "Welcome to the Cognitive Games Centre. Choose from Fruit Memory Path, Memory Melody, Pattern Memory, and 3D Dice Memory. Every round is procedurally generated with adaptive difficulty calibrated to your performance.",
  
  fruitPath: "In Fruit Memory Path, memorize the highlighted sequence of fruits before they vanish. Then tap the tiles in exact order. Higher levels introduce distractors and longer paths.",
  
  melody: "Memory Melody tests your auditory sequence recall. Listen to the musical tones generated by the synthesizer, then reproduce the melody on the interactive sound pads.",
  
  patternMemory: "In Pattern Memory, observe the arrangement of sacred geometric symbols. When the grid hides, reconstruct each symbol from memory. You will receive constructive diagnostic feedback on any mistakes.",
  
  dice3D: "Welcome to 3D Dice Memory. Inspect the spatial arrangement and pip values of the dice in 3D perspective. When hidden, answer the retrieval challenge or toggle the accessible two-dimensional view.",
  
  library: "In Cultural Library, explore classical verses from Thirukkural, the Upanishads, and Stoic meditations. You can practice rhythm-paced recitation with audio playback.",
  
  meditation: "Welcome to Meditation and Breathwork. Regulate your autonomic nervous system using synchronized box breathing, 4-7-8 calming breath, and mindful sensory grounding.",
  
  progress: "Your Progress Center displays verified historical metrics. Compare your latest session factually with past performance and generate automated executive reports.",
};

export function speakGameInstruction(gameId: string): void {
  switch (gameId) {
    case 'fruit-path':
      spokenGuideService.speak(GUIDE_SCRIPTS.fruitPath);
      break;
    case 'memory-melody':
    case 'melody':
      spokenGuideService.speak(GUIDE_SCRIPTS.melody);
      break;
    case 'pattern-memory':
    case 'pattern':
      spokenGuideService.speak(GUIDE_SCRIPTS.patternMemory);
      break;
    case 'dice-memory':
    case 'dice-3d':
      spokenGuideService.speak(GUIDE_SCRIPTS.dice3D);
      break;
    case 'number-sequence':
      spokenGuideService.speak("Observe the flashing digits carefully. Memorize the sequence and reproduce it either forward or in reverse order.");
      break;
    default:
      spokenGuideService.speak(GUIDE_SCRIPTS.gamesCenter);
      break;
  }
}

export function speakRoundFeedback(rating: 'high' | 'medium' | 'low', _gameContext?: string): void {
  if (rating === 'high') {
    spokenGuideService.speak("Exceptional memory recall! Your neural pathways are sharply tuned.");
  } else if (rating === 'medium') {
    spokenGuideService.speak("Good effort! Focus on maintaining steady concentration as difficulty adapts.");
  } else {
    spokenGuideService.speak("A constructive practice round. Review the diagnostic breakdown to calibrate your strategy.");
  }
}

