export type Chronotype = 'lion' | 'bear' | 'wolf' | 'dolphin';

export interface DailyScheduleBlock {
  id: string;
  title: string;
  startTime: string; // "07:00"
  endTime: string;   // "08:30"
  category: 'deep_work' | 'light_work' | 'exercise' | 'wind_down' | 'sleep' | 'personal';
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
}

export interface FocusSession {
  id: string;
  date: string;
  taskName: string;
  durationMinutes: number;
  timestamp: string;
}

export type MemoryGameType = 'sequence' | 'matrix' | 'passages' | 'pairs';

export interface MemorySession {
  id: string;
  date: string;
  gameType: MemoryGameType;
  difficulty: 'easy' | 'medium' | 'hard';
  score: number;
  accuracy: number; // 0 - 100
  timeSpentSeconds: number;
  timestamp: string;
}

export type BreathingTechnique = 'box' | '478' | 'coherence' | 'calm';

export interface MindfulnessSession {
  id: string;
  date: string;
  type: 'breathing' | 'meditation' | 'reflection';
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
  type: 'add_habit' | 'update_schedule' | 'target_adjustment' | 'memory_recommendation' | 'meditation_prompt' | 'mindfulness_recommendation';
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

export interface UserProfile {
  id: string;
  username: string;
  targetSleep: number;
  targetScreenTime: number;
  onboardingCompleted: boolean;
  disciplineScore: number;
  currentStreak: number;
  chronotypeProfile?: ChronotypeProfile;
  geminiApiKey?: string;
  createdAt: string;
}

export interface SmritaraBackupPackage {
  appName: 'SMRITARA';
  schemaVersion: '1.0';
  exportedAt: string;
  payload: {
    user: Partial<UserProfile>;
    habits: Habit[];
    dailyLogs: DailyLog[];
    focusSessions: FocusSession[];
    memorySessions: MemorySession[];
    mindfulnessSessions: MindfulnessSession[];
    todaySchedule: DailyScheduleBlock[];
    chatMessages?: ChatMessage[];
  };
}
