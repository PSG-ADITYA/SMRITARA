export type Chronotype = 'lion' | 'bear' | 'wolf' | 'dolphin';

export interface DailyScheduleBlock {
  id: string;
  title: string;
  startTime: string; // "07:00"
  endTime: string;   // "08:30"
  category: 'deep_work' | 'light_work' | 'exercise' | 'wind_down' | 'sleep' | 'personal' | 'smriti_veda';
  notes: string;
  isCompleted?: boolean;
}

export interface ChronotypeProfile {
  chronotype: Chronotype;
  score: number;
  label: string;
  tagline: string;
  description: string;
  peakAlertness: string;
  focusWindows: string[];
  sleepAdvice: string;
  schedule: DailyScheduleBlock[];
  completedAt: string;
}

export type HabitType = 'good' | 'bad';

export interface Habit {
  id: string;
  name: string;
  type: HabitType;
  category?: string;
  createdAt: string;
  streak: number;
}

export interface DailyLog {
  date: string; // "YYYY-MM-DD"
  sleepHours: number;
  screenTimeHours: number;
  moodScore: number;         // 1 - 10
  energyScore: number;       // 1 - 10
  productivityScore: number; // 1 - 10
  notes: string;
  disciplineScore: number;   // 0 - 100
  completedHabitIds: string[];
  avoidedBadHabitIds: string[];
  reportedAt?: string;       // ISO timestamp when check-in was logged
  appliedDate?: string;      // Date to which this report applies
}

export interface FocusSession {
  id: string;
  date: string;
  taskName: string;
  durationMinutes: number;
  timestamp: string;
}

export type MemoryGameType =
  | 'sequence'
  | 'matrix'
  | 'passages'
  | 'pairs'
  | 'object_memory'
  | 'attention'
  | 'fruit-path'
  | 'fruit_path'
  | 'memory-melody'
  | 'memory_melody'
  | 'pattern-memory'
  | 'dice-memory'
  | 'number-sequence';


export interface MemorySession {
  id: string;
  date: string;
  gameType: MemoryGameType;
  difficulty: 'easy' | 'medium' | 'hard';
  score: number;
  accuracy: number; // 0 - 100
  timeSpentSeconds: number;
  timestamp: string;
  notes?: string;
}

export type BreathingTechnique = 'box' | '478' | 'coherence' | 'calm';

export interface MindfulnessSession {
  id: string;
  date: string;
  type: 'breathing' | 'meditation' | 'reflection' | 'body_scan';
  durationSeconds: number;
  technique?: BreathingTechnique;
  moodBefore?: number;
  moodAfter?: number;
  reflectionNotes?: string;
  timestamp: string;
}

export interface ProposedAction {
  id: string;
  title: string;
  description: string;
  type: 'add_habit' | 'update_schedule' | 'target_adjustment' | 'memory_recommendation' | 'meditation_prompt' | 'mindfulness_recommendation' | 'chanting_recommendation';
  payload: Record<string, any>;
  status: 'pending' | 'applied' | 'dismissed';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
  proposedActions?: ProposedAction[];
  isGrounded?: boolean;
}

export interface PatternInsight {
  id: string;
  title: string;
  observation: string;
  hypothesis: string;
  recommendation: string;
  confidence: 'Preliminary (3+ days)' | 'Moderate (7+ days)' | 'High (14+ days)';
  metricPair: string;
  sampleCount: number;
}

export type InterfaceLanguage = 'english' | 'telugu' | 'hindi';
export type ContentLanguage = 'english' | 'telugu' | 'hindi' | 'sanskrit';
export type SupportedLanguage = ContentLanguage;

export interface OnboardingPreferences {
  preferredName: string;
  ageRange?: string;
  preferredLanguage: InterfaceLanguage;
  recitationLanguage?: ContentLanguage;
  primaryGoal?: string;
  secondaryGoals?: string[];
  goals: string[];
  dailyPracticeMinutes: number;
  recitationSpeed?: number;
  practiceTime: 'morning' | 'afternoon' | 'evening' | 'flexible';
  interests: string[];
  contentStyle: 'visual' | 'audio' | 'text' | 'mixed';
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  targetSleepHours?: number;
  targetScreenTimeHours?: number;
  accessibility: {
    largerText: boolean;
    reducedMotion: boolean;
    soundEnabled: boolean;
    ambientAudioEnabled?: boolean;
    celebrationEffectsEnabled?: boolean;
  };
}

export interface PersonalizedPlanItem {
  id: string;
  title: string;
  category: 'cognitive' | 'cultural' | 'mindfulness' | 'habit';
  durationMinutes: number;
  reason: string;
  actionTab: string;
  completed?: boolean;
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  passwordHash?: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  targetSleep: number;
  targetScreenTime: number;
  onboardingCompleted: boolean;
  onboardingPreferences?: OnboardingPreferences;
  personalizedPlan?: PersonalizedPlanItem[];
  disciplineScore: number;
  currentStreak: number;
  chronotypeProfile?: ChronotypeProfile;
  geminiApiKey?: string;
  createdAt: string;
  isDemo?: boolean;
}

export interface CulturalItem {
  id: string;
  title: string;
  language: SupportedLanguage;
  category: 'mantra' | 'shloka' | 'poem' | 'story' | 'proverb' | 'song';
  originalText: string;
  transliteration?: string;
  meaning: string;
  pronunciation?: string;
  audioUrl?: string;
  audioSourceType?: 'recording' | 'tts' | 'text_only';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes?: number;
  source: string;
  tags: string[];
  stages: ('listen' | 'repeat' | 'chunk' | 'recall' | 'missing_word')[];
  blanks?: { id: number; correct: string; options: string[] }[];
}

export interface ChantingSession {
  id: string;
  date: string;
  chantId: string;
  chantTitle: string;
  language: SupportedLanguage;
  repetitionsCompleted: number;
  targetRepetitions: number;
  mode: 'listen' | 'repeat' | 'recall' | 'silent';
  durationSeconds: number;
  timestamp: string;
}

export type { PracticeSession, SessionComparison, PracticeMilestone } from '../engine/sessionProgressEngine';
export type { DailyTip } from '../data/dailyTips';

export interface SmritaraBackupPackage {
  appName: 'SMRITARA';
  schemaVersion: '3.0';
  exportedAt: string;
  payload: {
    user: Partial<UserProfile>;
    habits: Habit[];
    dailyLogs: DailyLog[];
    focusSessions: FocusSession[];
    memorySessions: MemorySession[];
    mindfulnessSessions: MindfulnessSession[];
    chantingSessions?: ChantingSession[];
    practiceSessions?: any[];
    favourites?: string[];
    todaySchedule: DailyScheduleBlock[];
    chatMessages?: ChatMessage[];
  };
}

