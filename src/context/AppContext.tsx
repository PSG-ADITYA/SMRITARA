import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  UserProfile,
  UserAccount,
  OnboardingPreferences,
  PersonalizedPlanItem,
  Habit,
  DailyLog,
  FocusSession,
  MemorySession,
  MindfulnessSession,
  ChantingSession,
  ChatMessage,
  DailyScheduleBlock,
  PatternInsight,
  ChronotypeProfile,
  ProposedAction,
  SmritaraBackupPackage,
  InterfaceLanguage,
  PracticeSession,
  PracticeMilestone,
  DailyTip
} from '../types';
import { calculateDailyDisciplineScore, calculateStreak, calculateRollingScore } from '../engine/scoring';
import { computePatternInsights } from '../engine/patternEngine';
import { sendCoachMessage } from '../engine/gemini';
import { generateScheduleForChronotype } from '../engine/chronotype';
import { generatePersonalizedPlan } from '../engine/personalizationEngine';
import { audioService } from '../engine/audioService';
import { getTipForDate } from '../data/dailyTips';
import { evaluateMilestones, calculateSessionPoints } from '../engine/sessionProgressEngine';
import {
  generateWeeklyReport,
  sendWeeklyReportEmail,
  getReportHistory,
  type ReportHistoryItem,
  type WeeklyProgressReport
} from '../engine/weeklyReportEngine';
import {
  isSupabaseConfigured,
  supabase,
  signUpWithEmail,
  signInWithEmail,
  signOutUser,
  resetPassword,
  getCurrentSession,
  fetchCloudProfile,
  saveCloudProfile,
  fetchCloudPracticeSessions,
  saveCloudPracticeSession,
  fetchCloudDailyLogs,
  saveCloudDailyLog,
  fetchCloudHabits,
  saveCloudHabits,
  deleteCloudHabit,
  fetchCloudSavedTips,
  toggleCloudSavedTip,
  migrateLocalDataToCloud,
  resendVerificationEmail
} from '../lib/supabase';

export const migrateLanguagePreference = (lang?: string): InterfaceLanguage => {
  if (!lang) return 'english';
  const lower = lang.toLowerCase().trim();
  if (lower === 'sanskrit') return 'english'; // Sanskrit is content language; UI language falls back cleanly to English
  if (lower === 'telugu') return 'telugu';
  if (lower === 'hindi') return 'hindi';
  return 'english';
};

interface AppContextType {
  user: UserProfile;
  currentUser: UserAccount | null;
  isDemoMode: boolean;
  isAuthenticated: boolean;
  isOnboarding: boolean;
  habits: Habit[];
  dailyLogs: DailyLog[];
  focusSessions: FocusSession[];
  memorySessions: MemorySession[];
  mindfulnessSessions: MindfulnessSession[];
  chantingSessions: ChantingSession[];
  practiceSessions: PracticeSession[];
  favourites: string[];
  chatMessages: ChatMessage[];
  todaySchedule: DailyScheduleBlock[];
  patternInsights: PatternInsight[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCloudConnected: boolean;
  cloudSyncStatus: 'synced' | 'syncing' | 'offline' | 'error';
  resetUserPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  resendVerification: (email: string) => Promise<{ success: boolean; error?: string }>;
  syncToCloud: () => Promise<void>;
  registerAccount: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string; emailConfirmationRequired?: boolean }>;
  loginAccount: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  enterDemoMode: () => void;
  exitDemoMode: () => void;
  completeOnboarding: (prefs: OnboardingPreferences, chronotypeProfile?: ChronotypeProfile) => void;
  toggleFavourite: (itemId: string) => void;
  recordChantingSession: (session: Omit<ChantingSession, 'id' | 'timestamp'>) => void;
  recordPracticeSession: (session: Omit<PracticeSession, 'id' | 'completedAt'>) => PracticeSession;
  updateUserTargets: (targetSleep: number, targetScreenTime: number) => void;
  updateUserSettings: (settings: {
    targetSleep?: number;
    targetScreenTime?: number;
    interfaceLanguage?: InterfaceLanguage;
    speechRate?: number;
    soundEnabled?: boolean;
    ambientEnabled?: boolean;
    celebrationsEnabled?: boolean;
    accessibility?: { largerText: boolean; reducedMotion: boolean; soundEnabled: boolean };
  }) => Promise<void>;
  setGeminiApiKey: (key: string) => void;
  saveChronotypeResult: (profile: ChronotypeProfile) => void;
  updateSchedule: (newSchedule: DailyScheduleBlock[]) => void;
  addHabit: (name: string, type: 'good' | 'bad', category?: string) => void;
  deleteHabit: (id: string) => void;
  toggleHabitForDate: (habitId: string, dateStr: string) => void;
  upsertDailyLog: (log: Omit<DailyLog, 'disciplineScore' | 'avoidedBadHabitIds'> & { completedHabitIds?: string[] }) => void;
  addFocusSession: (taskName: string, durationMinutes: number) => void;
  recordMemorySession: (session: Omit<MemorySession, 'id' | 'timestamp'>) => void;
  recordMindfulnessSession: (session: Omit<MindfulnessSession, 'id' | 'timestamp'>) => void;
  sendMessageToCoach: (text: string) => Promise<void>;
  clearCoachChat: () => void;
  applyAction: (actionId: string) => void;
  dismissAction: (actionId: string) => void;
  loadDemoData: () => void;
  resetAllData: () => void;
  getTodayLog: () => DailyLog | undefined;
  exportData: () => SmritaraBackupPackage;
  importData: (imported: unknown) => { success: boolean; message: string; counts?: { habits: number; logs: number; sessions: number } };
  setInterfaceLanguage: (lang: InterfaceLanguage) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  speechRate: number;
  setSpeechRate: (rate: number) => void;
  todayTip: DailyTip;
  dismissTip: (tipId: string) => void;
  savedTipIds: string[];
  toggleSaveTip: (tipId: string) => void;
  milestones: PracticeMilestone[];
  practicePoints: number;
  celebrationsEnabled: boolean;
  setCelebrationsEnabled: (enabled: boolean) => void;
  ambientEnabled: boolean;
  setAmbientEnabled: (enabled: boolean) => void;
  toggleAmbient: () => boolean;
  weeklyReportsEnabled: boolean;
  setWeeklyReportsEnabled: (enabled: boolean) => void;
  reportHistory: ReportHistoryItem[];
  generateAndEmailReport: (targetEmail?: string) => Promise<{ success: boolean; message: string; receiptId?: string; report?: WeeklyProgressReport; smtpConfigured?: boolean }>;
}

const STORAGE_ACCOUNTS_KEY = 'smritara_accounts_v2';
const STORAGE_SESSION_KEY = 'smritara_session_v2';

// Fresh empty user profile for unauthenticated guests
const EMPTY_USER: UserProfile = {
  id: 'guest',
  username: '',
  email: '',
  targetSleep: 8.0,
  targetScreenTime: 4.0,
  onboardingCompleted: false,
  disciplineScore: 0,
  currentStreak: 0,
  geminiApiKey: '',
  createdAt: new Date().toISOString(),
  isDemo: false
};

// Clearly labeled demo sandbox profile with genuine labels
const DEMO_SANDBOX_USER: UserProfile = {
  id: 'demo_sandbox_user',
  username: 'Demo Sandbox Guest',
  email: 'demo@smritara.internal',
  targetSleep: 8.0,
  targetScreenTime: 4.0,
  onboardingCompleted: true,
  disciplineScore: 80,
  currentStreak: 3,
  geminiApiKey: '',
  createdAt: new Date().toISOString(),
  isDemo: true,
  onboardingPreferences: {
    preferredName: 'Demo Sandbox Guest',
    preferredLanguage: 'english',
    recitationLanguage: 'sanskrit',
    primaryGoal: 'mindfulness',
    secondaryGoals: ['memory', 'cultural'],
    goals: ['memory', 'mindfulness', 'cultural'],
    dailyPracticeMinutes: 7,
    recitationSpeed: 1.0,
    practiceTime: 'morning',
    interests: ['games', 'chanting', 'meditation'],
    contentStyle: 'mixed',
    experienceLevel: 'intermediate',
    targetSleepHours: 8.0,
    targetScreenTimeHours: 4.0,
    accessibility: {
      largerText: false,
      reducedMotion: false,
      soundEnabled: true,
      ambientAudioEnabled: false,
      celebrationEffectsEnabled: true
    }
  }
};

const DEFAULT_HABITS: Habit[] = [
  { id: 'h1', name: 'Morning Sunlight & Hydration', type: 'good', category: 'Energy', streak: 4, createdAt: new Date().toISOString() },
  { id: 'h2', name: '25m Deep Work Focus Sprint', type: 'good', category: 'Productivity', streak: 6, createdAt: new Date().toISOString() },
  { id: 'h3', name: 'Mindful Breathing / Calm Pause', type: 'good', category: 'Mental Health', streak: 3, createdAt: new Date().toISOString() },
  { id: 'h4', name: 'Physical Movement / 6k Steps', type: 'good', category: 'Fitness', streak: 5, createdAt: new Date().toISOString() },
  { id: 'h5', name: 'Social Media Doomscrolling', type: 'bad', category: 'Focus', streak: 2, createdAt: new Date().toISOString() },
  { id: 'h6', name: 'Late Night Screen Blue Light', type: 'bad', category: 'Sleep', streak: 4, createdAt: new Date().toISOString() },
];

// Helper to generate reliable default welcome greeting for AI Life Coach
export const createDefaultWelcomeMessage = (name?: string): ChatMessage => ({
  id: 'welcome_' + Date.now(),
  sender: 'coach',
  text: `Welcome to **SMRITARA**, ${name || 'Voyager'}. I am your grounded AI Life Coach.\n\nI connect your daily practice, cognitive memory gym, and mindful reflections using your actual stored records. Ask me any question about routines, focus sessions, or memory drills.`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
});

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Session & Authentication
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const s = localStorage.getItem(STORAGE_SESSION_KEY);
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });

  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('smritara_is_demo') === 'true';
    } catch {
      return false;
    }
  });

  const [isOnboarding, setIsOnboarding] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Key prefix determines whether storage writes go to demo sandbox or isolated user
  const getPrefix = () => {
    if (isDemoMode) return 'smritara_demo_';
    if (currentUser) return `smritara_u_${currentUser.id}_`;
    return 'smritara_guest_';
  };

  const loadScoped = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(getPrefix() + key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  // Migration helper ensuring saved profiles with legacy 'sanskrit' UI preference fall back to 'english'
  const sanitizeUser = (u: UserProfile): UserProfile => {
    if (u.onboardingPreferences) {
      return {
        ...u,
        onboardingPreferences: {
          ...u.onboardingPreferences,
          preferredLanguage: migrateLanguagePreference(u.onboardingPreferences.preferredLanguage)
        }
      };
    }
    return u;
  };

  // State
  const [user, setUser] = useState<UserProfile>(() => {
    let initialUser: UserProfile;
    if (isDemoMode) initialUser = loadScoped('user', DEMO_SANDBOX_USER);
    else if (currentUser) {
      initialUser = loadScoped('user', {
        id: currentUser.id,
        username: currentUser.name,
        email: currentUser.email,
        targetSleep: 8.0,
        targetScreenTime: 4.0,
        onboardingCompleted: false,
        disciplineScore: 0,
        currentStreak: 0,
        createdAt: currentUser.createdAt
      });
    } else {
      initialUser = EMPTY_USER;
    }
    return sanitizeUser(initialUser);
  });

  // Audio & Voice Preferences — Default recitation speed is exactly 1.0x
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('smritara_sound_enabled');
      return stored !== null ? stored === 'true' : true;
    } catch {
      return true;
    }
  });

  const [speechRate, setSpeechRateState] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('smritara_speech_rate');
      return stored !== null ? parseFloat(stored) : 1.0;
    } catch {
      return 1.0;
    }
  });

  // Synchronize audio service defaults on mount
  useEffect(() => {
    audioService.setSoundEffectsEnabled(soundEnabled);
    audioService.setRate(speechRate);
  }, []);

  const [habits, setHabits] = useState<Habit[]>(() => 
    isDemoMode ? loadScoped('habits', DEFAULT_HABITS) : loadScoped('habits', [])
  );
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>(() => loadScoped('dailyLogs', []));
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(() => loadScoped('focusSessions', []));
  const [memorySessions, setMemorySessions] = useState<MemorySession[]>(() => loadScoped('memorySessions', []));
  const [mindfulnessSessions, setMindfulnessSessions] = useState<MindfulnessSession[]>(() => loadScoped('mindfulnessSessions', []));
  const [chantingSessions, setChantingSessions] = useState<ChantingSession[]>(() => loadScoped('chantingSessions', []));
  const [practiceSessions, setPracticeSessions] = useState<PracticeSession[]>(() => loadScoped('practiceSessions', []));
  const [dismissedTipIds, setDismissedTipIds] = useState<string[]>(() => loadScoped('dismissedTipIds', []));
  const [savedTipIds, setSavedTipIds] = useState<string[]>(() => loadScoped('savedTipIds', []));
  
  const [celebrationsEnabled, setCelebrationsEnabledState] = useState<boolean>(() => {
    try {
      const s = localStorage.getItem('smritara_celebrations_enabled');
      return s !== null ? s === 'true' : true;
    } catch {
      return true;
    }
  });

  const [ambientEnabled, setAmbientEnabledState] = useState<boolean>(() => {
    try {
      const s = localStorage.getItem('smritara_ambient_enabled');
      return s !== null ? s === 'true' : false;
    } catch {
      return false;
    }
  });

  const [favourites, setFavourites] = useState<string[]>(() =>
    loadScoped('favourites', isDemoMode ? ['eng_marcus_mind', 'sanskrit_gayatri'] : [])
  );
  const [todaySchedule, setTodaySchedule] = useState<DailyScheduleBlock[]>(() =>
    loadScoped('todaySchedule', generateScheduleForChronotype('bear'))
  );
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const loaded = loadScoped<ChatMessage[]>('chatMessages', []);
    return (Array.isArray(loaded) && loaded.length > 0) ? loaded : [createDefaultWelcomeMessage(currentUser?.name)];
  });

  // Auto-sync state changes to scoped storage
  useEffect(() => {
    const p = getPrefix();
    localStorage.setItem(p + 'user', JSON.stringify(user));
    localStorage.setItem(p + 'habits', JSON.stringify(habits));
    localStorage.setItem(p + 'dailyLogs', JSON.stringify(dailyLogs));
    localStorage.setItem(p + 'focusSessions', JSON.stringify(focusSessions));
    localStorage.setItem(p + 'memorySessions', JSON.stringify(memorySessions));
    localStorage.setItem(p + 'mindfulnessSessions', JSON.stringify(mindfulnessSessions));
    localStorage.setItem(p + 'chantingSessions', JSON.stringify(chantingSessions));
    localStorage.setItem(p + 'practiceSessions', JSON.stringify(practiceSessions));
    localStorage.setItem(p + 'dismissedTipIds', JSON.stringify(dismissedTipIds));
    localStorage.setItem(p + 'savedTipIds', JSON.stringify(savedTipIds));
    localStorage.setItem(p + 'favourites', JSON.stringify(favourites));
    localStorage.setItem(p + 'todaySchedule', JSON.stringify(todaySchedule));
    localStorage.setItem(p + 'chatMessages', JSON.stringify(chatMessages));
  }, [user, habits, dailyLogs, focusSessions, memorySessions, mindfulnessSessions, chantingSessions, practiceSessions, dismissedTipIds, savedTipIds, favourites, todaySchedule, chatMessages, isDemoMode, currentUser]);

  // Sync demo mode flag
  useEffect(() => {
    localStorage.setItem('smritara_is_demo', String(isDemoMode));
  }, [isDemoMode]);

  const getTodayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // Today's stable Daily Tip
  const todayTip = getTipForDate(getTodayStr(), dismissedTipIds);

  const dismissTip = (tipId: string) => {
    setDismissedTipIds(prev => (prev.includes(tipId) ? prev : [...prev, tipId]));
  };

  const toggleSaveTip = (tipId: string) => {
    setSavedTipIds(prev => (prev.includes(tipId) ? prev.filter(id => id !== tipId) : [...prev, tipId]));
  };

  // Unified Milestones and Practice Points
  const milestones = evaluateMilestones(practiceSessions);
  const practicePoints = practiceSessions.reduce((acc, s) => acc + calculateSessionPoints(s), 0);

  const setCelebrationsEnabled = (enabled: boolean) => {
    setCelebrationsEnabledState(enabled);
    localStorage.setItem('smritara_celebrations_enabled', String(enabled));
  };

  const setAmbientEnabled = (enabled: boolean) => {
    setAmbientEnabledState(enabled);
    localStorage.setItem('smritara_ambient_enabled', String(enabled));
    if (enabled) audioService.startAmbient();
    else audioService.stopAmbient();
  };

  const toggleAmbient = (): boolean => {
    const newState = !ambientEnabled;
    setAmbientEnabled(newState);
    return newState;
  };

  // Dynamic Pattern Engine Insights based on real records
  const patternInsights = computePatternInsights(dailyLogs, focusSessions, mindfulnessSessions, memorySessions, habits);

  const getTodayLog = () => {
    const today = getTodayStr();
    return dailyLogs.find(l => l.date === today);
  };

  // Weekly Automated Client Progress Reports
  const [weeklyReportsEnabled, setWeeklyReportsEnabledState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('smritara_weekly_reports_enabled');
      return stored !== null ? stored === 'true' : true;
    } catch {
      return true;
    }
  });

  const [reportHistory, setReportHistory] = useState<ReportHistoryItem[]>(() => getReportHistory());

  const setWeeklyReportsEnabled = (enabled: boolean) => {
    setWeeklyReportsEnabledState(enabled);
    localStorage.setItem('smritara_weekly_reports_enabled', String(enabled));
  };

  const generateAndEmailReport = async (
    targetEmail?: string
  ): Promise<{ success: boolean; message: string; receiptId?: string; report?: WeeklyProgressReport; smtpConfigured?: boolean }> => {
    const report = generateWeeklyReport(user, dailyLogs, practiceSessions, habits);
    const result = await sendWeeklyReportEmail(report, targetEmail || user.email);
    setReportHistory(getReportHistory());
    if (result.success) {
      localStorage.setItem('smritara_last_report_date', new Date().toISOString().split('T')[0]);
    }
    return {
      ...result,
      report
    };
  };

  // Background check for automatic weekly report generation & dispatch (every 7 days)
  useEffect(() => {
    if (!user.email || !weeklyReportsEnabled) return;
    const lastReportDate = localStorage.getItem('smritara_last_report_date');
    if (!lastReportDate) return;
    const diffDays = (Date.now() - new Date(lastReportDate).getTime()) / 86400000;
    if (diffDays >= 7) {
      generateAndEmailReport(user.email).catch(console.warn);
    }
  }, [user.email, weeklyReportsEnabled]);

  // Cloud Connection & Synchronization Status
  const [isCloudConnected] = useState<boolean>(() => isSupabaseConfigured());
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'syncing' | 'offline' | 'error'>(() => 
    isSupabaseConfigured() ? 'synced' : 'offline'
  );

  // Helper to cleanly clear in-memory user data (prevent state leaks between users/guests/demo)
  const clearInMemoryUserData = () => {
    setUser(EMPTY_USER);
    setHabits([]);
    setDailyLogs([]);
    setPracticeSessions([]);
    setFocusSessions([]);
    setMemorySessions([]);
    setMindfulnessSessions([]);
    setChantingSessions([]);
    setFavourites([]);
    setSavedTipIds([]);
    setDismissedTipIds([]);
  };

  // Helper to load scoped user data from local storage
  const loadUserDataFromStorage = (userId: string, acctName?: string, acctEmail?: string, acctCreatedAt?: string) => {
    const prefix = `smritara_u_${userId}_`;
    const loadedUser = localStorage.getItem(prefix + 'user');
    if (loadedUser) {
      setUser(sanitizeUser(JSON.parse(loadedUser)));
    } else {
      setUser({
        id: userId,
        username: acctName || 'Voyager',
        email: acctEmail || '',
        targetSleep: 8.0,
        targetScreenTime: 4.0,
        onboardingCompleted: false,
        disciplineScore: 0,
        currentStreak: 0,
        createdAt: acctCreatedAt || new Date().toISOString()
      });
    }

    const lHabits = localStorage.getItem(prefix + 'habits');
    setHabits(lHabits ? JSON.parse(lHabits) : []);
    const lLogs = localStorage.getItem(prefix + 'dailyLogs');
    setDailyLogs(lLogs ? JSON.parse(lLogs) : []);
    const lPractice = localStorage.getItem(prefix + 'practiceSessions');
    setPracticeSessions(lPractice ? JSON.parse(lPractice) : []);
    const lFocus = localStorage.getItem(prefix + 'focusSessions');
    setFocusSessions(lFocus ? JSON.parse(lFocus) : []);
    const lMem = localStorage.getItem(prefix + 'memorySessions');
    setMemorySessions(lMem ? JSON.parse(lMem) : []);
    const lMind = localStorage.getItem(prefix + 'mindfulnessSessions');
    setMindfulnessSessions(lMind ? JSON.parse(lMind) : []);
    const lChant = localStorage.getItem(prefix + 'chantingSessions');
    setChantingSessions(lChant ? JSON.parse(lChant) : []);
    const lFav = localStorage.getItem(prefix + 'favourites');
    setFavourites(lFav ? JSON.parse(lFav) : []);
    const lTips = localStorage.getItem(prefix + 'savedTipIds');
    setSavedTipIds(lTips ? JSON.parse(lTips) : []);
    const lChat = localStorage.getItem(prefix + 'chatMessages');
    let loadedChat: ChatMessage[] = [];
    try {
      loadedChat = lChat ? JSON.parse(lChat) : [];
    } catch {
      loadedChat = [];
    }
    if (!Array.isArray(loadedChat) || loadedChat.length === 0) {
      loadedChat = [createDefaultWelcomeMessage(acctName)];
    }
    setChatMessages(loadedChat);
  };

  // Helper to load all user data from Supabase Cloud
  const loadCloudData = async (userId: string) => {
    if (!isSupabaseConfigured()) return;
    setCloudSyncStatus('syncing');
    try {
      const [cloudProfile, cloudSessions, cloudLogs, cloudHabitsList, cloudTipsList] = await Promise.all([
        fetchCloudProfile(userId),
        fetchCloudPracticeSessions(userId),
        fetchCloudDailyLogs(userId),
        fetchCloudHabits(userId),
        fetchCloudSavedTips(userId),
      ]);

      if (cloudProfile) {
        setUser(prev => {
          const sanitized = sanitizeUser({ ...prev, ...cloudProfile });
          if (sanitized.onboardingPreferences?.recitationSpeed) {
            setSpeechRateState(sanitized.onboardingPreferences.recitationSpeed);
            audioService.setRate(sanitized.onboardingPreferences.recitationSpeed);
          }
          if (sanitized.onboardingPreferences?.accessibility?.soundEnabled !== undefined) {
            setSoundEnabledState(sanitized.onboardingPreferences.accessibility.soundEnabled);
            audioService.setSoundEffectsEnabled(sanitized.onboardingPreferences.accessibility.soundEnabled);
          }
          return sanitized;
        });
      }
      // Always reset with cloud data or empty array to avoid leaking guest or demo sessions
      setPracticeSessions(cloudSessions || []);
      setDailyLogs(cloudLogs || []);
      setHabits(cloudHabitsList || []);
      setSavedTipIds(cloudTipsList || []);
      setCloudSyncStatus('synced');
    } catch (err) {
      console.warn('Failed to load cloud records:', err);
      setCloudSyncStatus('error');
    }
  };

  // Restore session from Supabase on mount & register real-time auth changes
  useEffect(() => {
    if (!supabase) return;

    getCurrentSession().then(async session => {
      if (session?.user) {
        const u = session.user;
        const acct: UserAccount = {
          id: u.id,
          email: u.email || '',
          name: u.user_metadata?.full_name || u.email?.split('@')[0] || 'Voyager',
          createdAt: u.created_at || new Date().toISOString()
        };
        setCurrentUser(acct);
        setIsDemoMode(false);
        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(acct));
        loadUserDataFromStorage(u.id, acct.name, acct.email, acct.createdAt);
        await loadCloudData(u.id);
      }
    });

    const { data: authSub } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const u = session.user;
        const acct: UserAccount = {
          id: u.id,
          email: u.email || '',
          name: u.user_metadata?.full_name || u.email?.split('@')[0] || 'Voyager',
          createdAt: u.created_at || new Date().toISOString()
        };
        setCurrentUser(acct);
        setIsDemoMode(false);
        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(acct));
        loadUserDataFromStorage(u.id, acct.name, acct.email, acct.createdAt);
        await loadCloudData(u.id);
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem(STORAGE_SESSION_KEY);
        setCurrentUser(null);
        setIsDemoMode(false);
        clearInMemoryUserData();
      }
    });

    return () => {
      authSub?.subscription?.unsubscribe();
    };
  }, []);

  // Sync current memory state to cloud manually or after changes
  const syncToCloud = async () => {
    if (!currentUser || !isSupabaseConfigured()) return;
    setCloudSyncStatus('syncing');
    try {
      await Promise.all([
        saveCloudProfile(currentUser.id, user),
        saveCloudHabits(currentUser.id, habits),
      ]);
      setCloudSyncStatus('synced');
    } catch {
      setCloudSyncStatus('error');
    }
  };

  // Auth Operations (Supabase with Local Resilient Fallback)
  const registerAccount = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string; emailConfirmationRequired?: boolean }> => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!trimmedName) return { success: false, error: 'Please enter your name.' };
    if (!trimmedEmail || !trimmedEmail.includes('@')) return { success: false, error: 'Please enter a valid email address.' };
    if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters long.' };

    if (isSupabaseConfigured()) {
      setCloudSyncStatus('syncing');
      const cloudRes = await signUpWithEmail(trimmedEmail, password, trimmedName);
      if (!cloudRes.success) {
        setCloudSyncStatus('error');
        return { success: false, error: cloudRes.error };
      }
      if (cloudRes.user) {
        // If email confirmation is required by Supabase project settings
        if (!cloudRes.session) {
          setCloudSyncStatus('synced');
          return {
            success: true,
            emailConfirmationRequired: true
          };
        }

        const newAcct: UserAccount = {
          id: cloudRes.user.id,
          name: trimmedName,
          email: trimmedEmail,
          createdAt: cloudRes.user.created_at || new Date().toISOString()
        };
        setCurrentUser(newAcct);
        setIsDemoMode(false);
        setIsOnboarding(true);
        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(newAcct));

        // CRITICAL FOR BEGINNER ACCOUNT:
        // A newly registered beginner account MUST start at strictly 0 practice points!
        // Clear all prior in-memory guest/demo data so no points or sessions leak.
        clearInMemoryUserData();
        const prefix = `smritara_u_${newAcct.id}_`;
        localStorage.setItem(prefix + 'practiceSessions', '[]');
        localStorage.setItem(prefix + 'dailyLogs', '[]');
        localStorage.setItem(prefix + 'habits', '[]');
        localStorage.setItem(prefix + 'focusSessions', '[]');
        localStorage.setItem(prefix + 'memorySessions', '[]');
        localStorage.setItem(prefix + 'mindfulnessSessions', '[]');
        localStorage.setItem(prefix + 'chantingSessions', '[]');

        const cleanUser: UserProfile = {
          id: newAcct.id,
          username: newAcct.name,
          email: newAcct.email,
          targetSleep: 8.0,
          targetScreenTime: 4.0,
          onboardingCompleted: false,
          disciplineScore: 0,
          currentStreak: 0,
          createdAt: newAcct.createdAt
        };
        setUser(cleanUser);
        setPracticeSessions([]); // Explicitly empty -> 0 practice points!
        localStorage.setItem(prefix + 'user', JSON.stringify(cleanUser));

        const welcomeMsg = createDefaultWelcomeMessage(trimmedName);
        setChatMessages([welcomeMsg]);
        localStorage.setItem(prefix + 'chatMessages', JSON.stringify([welcomeMsg]));

        // Initialize cloud profile cleanly
        saveCloudProfile(cloudRes.user.id, cleanUser).catch(console.warn);

        setCloudSyncStatus('synced');
        return { success: true };
      }
    }

    // Local fallback when running offline or without Supabase keys
    try {
      const stored = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
      const accounts: UserAccount[] = stored ? JSON.parse(stored) : [];

      if (accounts.some(a => a.email === trimmedEmail)) {
        return { success: false, error: 'An account with this email already exists. Please sign in.' };
      }

      const passwordHash = btoa(password);
      const newAccount: UserAccount = {
        id: 'usr_' + Date.now(),
        name: trimmedName,
        email: trimmedEmail,
        passwordHash,
        createdAt: new Date().toISOString()
      };

      accounts.push(newAccount);
      localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(newAccount));

      setCurrentUser(newAccount);
      setIsDemoMode(false);
      setIsOnboarding(true);

      // CRITICAL FOR BEGINNER ACCOUNT:
      // Clear all prior in-memory guest/demo data so beginner account starts at strictly 0 points
      clearInMemoryUserData();
      const prefix = `smritara_u_${newAccount.id}_`;
      localStorage.setItem(prefix + 'practiceSessions', '[]');
      localStorage.setItem(prefix + 'dailyLogs', '[]');
      localStorage.setItem(prefix + 'habits', '[]');
      localStorage.setItem(prefix + 'focusSessions', '[]');
      localStorage.setItem(prefix + 'memorySessions', '[]');
      localStorage.setItem(prefix + 'mindfulnessSessions', '[]');
      localStorage.setItem(prefix + 'chantingSessions', '[]');

      const cleanUser: UserProfile = {
        id: newAccount.id,
        username: newAccount.name,
        email: newAccount.email,
        targetSleep: 8.0,
        targetScreenTime: 4.0,
        onboardingCompleted: false,
        disciplineScore: 0,
        currentStreak: 0,
        createdAt: newAccount.createdAt
      };

      setUser(cleanUser);
      setPracticeSessions([]); // Explicitly empty -> 0 practice points!
      setHabits([]);
      setDailyLogs([]);
      setFocusSessions([]);
      setMemorySessions([]);
      setMindfulnessSessions([]);
      setChantingSessions([]);
      setFavourites([]);
      localStorage.setItem(prefix + 'user', JSON.stringify(cleanUser));

      const welcomeMsg = createDefaultWelcomeMessage(trimmedName);
      setChatMessages([welcomeMsg]);
      localStorage.setItem(prefix + 'chatMessages', JSON.stringify([welcomeMsg]));

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed.' };
    }
  };

  const loginAccount = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured()) {
      setCloudSyncStatus('syncing');
      const cloudRes = await signInWithEmail(trimmedEmail, password);
      if (!cloudRes.success) {
        setCloudSyncStatus('error');
        return { success: false, error: cloudRes.error };
      }

      if (cloudRes.user) {
        const acct: UserAccount = {
          id: cloudRes.user.id,
          name: cloudRes.user.user_metadata?.full_name || cloudRes.user.email?.split('@')[0] || 'Voyager',
          email: cloudRes.user.email || trimmedEmail,
          createdAt: cloudRes.user.created_at || new Date().toISOString()
        };
        setCurrentUser(acct);
        setIsDemoMode(false);
        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(acct));
        loadUserDataFromStorage(cloudRes.user.id, acct.name, acct.email, acct.createdAt);
        await loadCloudData(cloudRes.user.id);
        setCloudSyncStatus('synced');
        return { success: true };
      }
    }

    // Local fallback when running offline or without Supabase keys
    try {
      const stored = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
      const accounts: UserAccount[] = stored ? JSON.parse(stored) : [];
      const account = accounts.find(a => a.email === trimmedEmail);

      if (!account) {
        return { success: false, error: 'No account found with this email. Please sign up.' };
      }

      if (account.passwordHash && account.passwordHash !== btoa(password)) {
        return { success: false, error: 'Incorrect password. Please try again.' };
      }

      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(account));
      setCurrentUser(account);
      setIsDemoMode(false);

      // Load all scoped records cleanly without leaking previous user state
      loadUserDataFromStorage(account.id, account.name, account.email, account.createdAt);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed.' };
    }
  };

  const resetUserPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured()) {
      return await resetPassword(email);
    }
    return { success: true };
  };

  const resendVerification = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured()) {
      return await resendVerificationEmail(email);
    }
    return { success: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured()) {
      await signOutUser();
    }
    localStorage.removeItem(STORAGE_SESSION_KEY);
    setCurrentUser(null);
    setIsDemoMode(false);
    setIsOnboarding(false);
    clearInMemoryUserData();
    setActiveTab('dashboard');
  };

  const enterDemoMode = () => {
    setIsDemoMode(true);
    localStorage.setItem('smritara_is_demo', 'true');
    setCurrentUser(null);
    setIsOnboarding(false);
    setUser(DEMO_SANDBOX_USER);
    setHabits(DEFAULT_HABITS);
    loadDemoData();
    setActiveTab('dashboard');
  };

  const exitDemoMode = () => {
    setIsDemoMode(false);
    localStorage.removeItem('smritara_is_demo');
    if (currentUser) {
      loadUserDataFromStorage(currentUser.id, currentUser.name, currentUser.email, currentUser.createdAt);
      if (isSupabaseConfigured()) {
        loadCloudData(currentUser.id);
      }
    } else {
      clearInMemoryUserData();
    }
    setActiveTab('dashboard');
  };

  const completeOnboarding = (prefs: OnboardingPreferences, chronotypeProfile?: ChronotypeProfile) => {
    const personalizedPlan = generatePersonalizedPlan(prefs);

    // Initial habit recommendation from plan
    const initialHabits: Habit[] = [
      {
        id: 'h_' + Date.now(),
        name: prefs.primaryGoal === 'focus' ? '25-Min Focused Deep Work' : 'Morning Sunlight & Mindful Breath',
        type: 'good',
        category: 'Personalized',
        streak: 0,
        createdAt: new Date().toISOString()
      }
    ];

    const updatedUser: UserProfile = {
      ...user,
      username: prefs.preferredName.trim() || user.username || 'Practitioner',
      targetSleep: prefs.targetSleepHours ?? user.targetSleep ?? 8.0,
      targetScreenTime: prefs.targetScreenTimeHours ?? user.targetScreenTime ?? 4.0,
      onboardingCompleted: true,
      onboardingPreferences: prefs,
      personalizedPlan,
      chronotypeProfile: chronotypeProfile || user.chronotypeProfile
    };

    setUser(updatedUser);
    setHabits(initialHabits);
    if (chronotypeProfile) {
      setTodaySchedule(chronotypeProfile.schedule);
    }
    if (prefs.recitationSpeed) {
      setSpeechRate(prefs.recitationSpeed);
    }
    if (prefs.accessibility?.soundEnabled !== undefined) {
      setSoundEnabled(prefs.accessibility.soundEnabled);
    }
    if (prefs.accessibility?.celebrationEffectsEnabled !== undefined) {
      setCelebrationsEnabled(prefs.accessibility.celebrationEffectsEnabled);
    }
    if (prefs.accessibility?.ambientAudioEnabled !== undefined) {
      setAmbientEnabled(prefs.accessibility.ambientAudioEnabled);
    }
    setIsOnboarding(false);
    setActiveTab('dashboard');

    if (currentUser && isSupabaseConfigured()) {
      saveCloudProfile(currentUser.id, updatedUser).catch(console.warn);
      saveCloudHabits(currentUser.id, initialHabits).catch(console.warn);
    }
  };

  const toggleFavourite = (itemId: string) => {
    setFavourites(prev => 
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const recordPracticeSession = (sessionInput: Omit<PracticeSession, 'id' | 'completedAt'>): PracticeSession => {
    const newSession: PracticeSession = {
      ...sessionInput,
      id: 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      completedAt: new Date().toISOString()
    };
    setPracticeSessions(prev => [newSession, ...prev]);

    if (newSession.completed && celebrationsEnabled && soundEnabled) {
      audioService.playSuccessBell();
    }

    if (currentUser && isSupabaseConfigured()) {
      saveCloudPracticeSession(currentUser.id, newSession).catch(err => {
        console.warn('Deferred cloud session save:', err);
      });
    }

    return newSession;
  };

  const recordChantingSession = (sessionInput: Omit<ChantingSession, 'id' | 'timestamp'>) => {
    const newSession: ChantingSession = {
      ...sessionInput,
      id: 'chant_' + Date.now(),
      timestamp: new Date().toISOString()
    };
    setChantingSessions(prev => [newSession, ...prev]);

    recordPracticeSession({
      activityType: 'chanting',
      activityId: sessionInput.chantId,
      activityTitle: `Chanting: ${sessionInput.chantTitle}`,
      startTime: new Date(Date.now() - sessionInput.durationSeconds * 1000).toISOString(),
      durationSeconds: sessionInput.durationSeconds,
      completed: sessionInput.repetitionsCompleted >= sessionInput.targetRepetitions,
      correctCount: sessionInput.repetitionsCompleted
    });
  };

  const updateUserSettings = async (settings: {
    targetSleep?: number;
    targetScreenTime?: number;
    interfaceLanguage?: InterfaceLanguage;
    speechRate?: number;
    soundEnabled?: boolean;
    ambientEnabled?: boolean;
    celebrationsEnabled?: boolean;
    accessibility?: { largerText: boolean; reducedMotion: boolean; soundEnabled: boolean };
  }) => {
    let updatedUser: UserProfile = { ...user };
    if (settings.targetSleep !== undefined) updatedUser.targetSleep = settings.targetSleep;
    if (settings.targetScreenTime !== undefined) updatedUser.targetScreenTime = settings.targetScreenTime;

    const currentPrefs = updatedUser.onboardingPreferences || {
      preferredName: updatedUser.username || 'Voyager',
      preferredLanguage: 'english',
      goals: ['discipline', 'focus'],
      dailyPracticeMinutes: 10,
      practiceTime: 'morning',
      interests: ['chanting', 'games'],
      contentStyle: 'mixed',
      experienceLevel: 'intermediate',
      accessibility: { largerText: false, reducedMotion: false, soundEnabled: true }
    };

    const newPrefs: OnboardingPreferences = {
      ...currentPrefs,
      preferredLanguage: settings.interfaceLanguage ? migrateLanguagePreference(settings.interfaceLanguage) : currentPrefs.preferredLanguage,
      recitationSpeed: settings.speechRate !== undefined ? settings.speechRate : currentPrefs.recitationSpeed,
      targetSleepHours: settings.targetSleep !== undefined ? settings.targetSleep : currentPrefs.targetSleepHours,
      targetScreenTimeHours: settings.targetScreenTime !== undefined ? settings.targetScreenTime : currentPrefs.targetScreenTimeHours,
      accessibility: settings.accessibility ? settings.accessibility : currentPrefs.accessibility
    };

    updatedUser.onboardingPreferences = newPrefs;
    setUser(updatedUser);

    if (settings.speechRate !== undefined) {
      setSpeechRate(settings.speechRate);
    }
    if (settings.soundEnabled !== undefined) {
      setSoundEnabled(settings.soundEnabled);
    }
    if (settings.celebrationsEnabled !== undefined) {
      setCelebrationsEnabled(settings.celebrationsEnabled);
    }

    if (currentUser && isSupabaseConfigured()) {
      try {
        await saveCloudProfile(currentUser.id, updatedUser);
        setCloudSyncStatus('synced');
      } catch (err) {
        console.warn('Cloud save deferred:', err);
      }
    }
  };

  const updateUserTargets = (targetSleep: number, targetScreenTime: number) => {
    setUser(prev => {
      const updated = { ...prev, targetSleep, targetScreenTime };
      if (currentUser && isSupabaseConfigured()) {
        saveCloudProfile(currentUser.id, updated).catch(console.warn);
      }
      return updated;
    });
  };

  const setInterfaceLanguage = (lang: InterfaceLanguage) => {
    const migrated = migrateLanguagePreference(lang);
    setUser(prev => {
      const updatedPrefs: OnboardingPreferences = prev.onboardingPreferences
        ? { ...prev.onboardingPreferences, preferredLanguage: migrated }
        : {
            preferredName: prev.username,
            preferredLanguage: migrated,
            goals: ['memory', 'mindfulness'],
            dailyPracticeMinutes: 15,
            practiceTime: 'morning',
            interests: ['chanting', 'games'],
            contentStyle: 'mixed',
            experienceLevel: 'intermediate',
            accessibility: { largerText: false, reducedMotion: false, soundEnabled: true }
          };
      return { ...prev, onboardingPreferences: updatedPrefs };
    });
  };

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    localStorage.setItem('smritara_sound_enabled', String(enabled));
    audioService.setSoundEffectsEnabled(enabled);
  };

  const setSpeechRate = (rate: number) => {
    setSpeechRateState(rate);
    localStorage.setItem('smritara_speech_rate', String(rate));
    audioService.setRate(rate);
  };

  const setGeminiApiKey = (key: string) => {
    setUser(prev => ({ ...prev, geminiApiKey: key.trim() }));
  };

  const saveChronotypeResult = (profile: ChronotypeProfile) => {
    setUser(prev => ({ ...prev, chronotypeProfile: profile }));
    setTodaySchedule(profile.schedule);
  };

  const updateSchedule = (newSchedule: DailyScheduleBlock[]) => {
    setTodaySchedule(newSchedule);
  };

  const addHabit = (name: string, type: 'good' | 'bad', category: string = 'General') => {
    const newHabit: Habit = {
      id: 'h_' + Date.now(),
      name: name.trim(),
      type,
      category,
      streak: 0,
      createdAt: new Date().toISOString()
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const toggleHabitForDate = (habitId: string, dateStr: string) => {
    setDailyLogs(prevLogs => {
      const existing = prevLogs.find(l => l.date === dateStr);
      let updatedLog: DailyLog;

      if (existing) {
        const isCompleted = existing.completedHabitIds.includes(habitId);
        const newCompletedIds = isCompleted
          ? existing.completedHabitIds.filter(id => id !== habitId)
          : [...existing.completedHabitIds, habitId];

        const breakdown = calculateDailyDisciplineScore(
          existing.sleepHours,
          user.targetSleep,
          existing.screenTimeHours,
          user.targetScreenTime,
          habits,
          newCompletedIds
        );

        updatedLog = {
          ...existing,
          completedHabitIds: newCompletedIds,
          disciplineScore: breakdown.total
        };

        return prevLogs.map(l => l.date === dateStr ? updatedLog : l);
      } else {
        const newCompletedIds = [habitId];
        const breakdown = calculateDailyDisciplineScore(
          0,
          user.targetSleep,
          0,
          user.targetScreenTime,
          habits,
          newCompletedIds
        );

        updatedLog = {
          date: dateStr,
          sleepHours: 0,
          screenTimeHours: 0,
          moodScore: 7,
          energyScore: 7,
          productivityScore: 7,
          notes: '',
          disciplineScore: breakdown.total,
          completedHabitIds: newCompletedIds,
          avoidedBadHabitIds: [],
          reportedAt: new Date().toISOString(),
          appliedDate: dateStr
        };

        return [...prevLogs, updatedLog];
      }
    });
  };

  const upsertDailyLog = (logInput: Omit<DailyLog, 'disciplineScore' | 'avoidedBadHabitIds'> & { completedHabitIds?: string[] }) => {
    setDailyLogs(prevLogs => {
      const existing = prevLogs.find(l => l.date === logInput.date);
      const completedHabitIds = logInput.completedHabitIds !== undefined
        ? logInput.completedHabitIds
        : (existing ? existing.completedHabitIds : []);

      const breakdown = calculateDailyDisciplineScore(
        logInput.sleepHours,
        user.targetSleep,
        logInput.screenTimeHours,
        user.targetScreenTime,
        habits,
        completedHabitIds
      );

      const newLog: DailyLog = {
        ...logInput,
        completedHabitIds,
        avoidedBadHabitIds: habits.filter(h => h.type === 'bad' && !completedHabitIds.includes(h.id)).map(h => h.id),
        disciplineScore: breakdown.total,
        reportedAt: logInput.reportedAt || new Date().toISOString(),
        appliedDate: logInput.appliedDate || logInput.date
      };

      if (currentUser && isSupabaseConfigured()) {
        saveCloudDailyLog(currentUser.id, newLog).catch(console.warn);
      }

      const updatedLogs = existing
        ? prevLogs.map(l => l.date === logInput.date ? newLog : l)
        : [...prevLogs, newLog];

      const loggedDates = updatedLogs.map(l => l.date);
      const newStreak = calculateStreak(loggedDates);
      const rolling = calculateRollingScore(updatedLogs);

      setUser(prev => ({
        ...prev,
        currentStreak: newStreak,
        disciplineScore: rolling
      }));

      return updatedLogs;
    });

    // Record verified practice progress for completing the daily check-in
    recordPracticeSession({
      activityType: 'discipline',
      activityId: 'checkin_' + logInput.date,
      activityTitle: `Daily Check-In & Sleep Calibration (${logInput.sleepHours}h sleep)`,
      startTime: new Date().toISOString(),
      durationSeconds: 120,
      completed: true
    });
  };

  const addFocusSession = (taskName: string, durationMinutes: number) => {
    const session: FocusSession = {
      id: 'focus_' + Date.now(),
      date: getTodayStr(),
      taskName,
      durationMinutes,
      timestamp: new Date().toISOString()
    };
    setFocusSessions(prev => [session, ...prev]);

    recordPracticeSession({
      activityType: 'focus',
      activityId: 'focus_sprint',
      activityTitle: `Focus: ${taskName}`,
      startTime: new Date(Date.now() - durationMinutes * 60000).toISOString(),
      durationSeconds: durationMinutes * 60,
      completed: true
    });
  };

  const recordMemorySession = (sessionInput: Omit<MemorySession, 'id' | 'timestamp'>) => {
    const session: MemorySession = {
      ...sessionInput,
      id: 'mem_' + Date.now(),
      timestamp: new Date().toISOString()
    };
    setMemorySessions(prev => [session, ...prev]);

    recordPracticeSession({
      activityType: 'memory',
      activityId: sessionInput.gameType,
      activityTitle: `Memory: ${sessionInput.gameType}`,
      startTime: new Date(Date.now() - sessionInput.timeSpentSeconds * 1000).toISOString(),
      durationSeconds: sessionInput.timeSpentSeconds,
      completed: true,
      score: sessionInput.score,
      correctCount: Math.round((sessionInput.score / 100) * 10),
      difficulty: sessionInput.difficulty
    });
  };

  const recordMindfulnessSession = (sessionInput: Omit<MindfulnessSession, 'id' | 'timestamp'>) => {
    const session: MindfulnessSession = {
      ...sessionInput,
      id: 'mind_' + Date.now(),
      timestamp: new Date().toISOString()
    };
    setMindfulnessSessions(prev => [session, ...prev]);

    recordPracticeSession({
      activityType: 'meditation',
      activityId: sessionInput.technique || sessionInput.type,
      activityTitle: `Mindfulness: ${sessionInput.technique || sessionInput.type}`,
      startTime: new Date(Date.now() - sessionInput.durationSeconds * 1000).toISOString(),
      durationSeconds: sessionInput.durationSeconds,
      completed: true
    });
  };

  const sendMessageToCoach = async (text: string) => {
    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Immediately persist user message so reload will not lose it
    const updatedWithUser = [...chatMessages, userMsg];
    setChatMessages(updatedWithUser);
    localStorage.setItem(getPrefix() + 'chatMessages', JSON.stringify(updatedWithUser));

    const context = {
      user,
      habits,
      recentLogs: dailyLogs,
      memorySessions,
      mindfulnessSessions
    };

    const apiKey = user.geminiApiKey || '';

    try {
      const response = await sendCoachMessage(apiKey, context, text, chatMessages);
      const coachMsg: ChatMessage = {
        id: 'msg_' + (Date.now() + 1),
        sender: 'coach',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        proposedActions: response.proposedActions,
        isGrounded: true
      };
      const updatedWithCoach = [...updatedWithUser, coachMsg];
      setChatMessages(updatedWithCoach);
      localStorage.setItem(getPrefix() + 'chatMessages', JSON.stringify(updatedWithCoach));
    } catch {
      const fallback = await sendCoachMessage('', context, text, chatMessages);
      const coachMsg: ChatMessage = {
        id: 'msg_' + (Date.now() + 1),
        sender: 'coach',
        text: fallback.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        proposedActions: fallback.proposedActions,
        isGrounded: true
      };
      const updatedWithCoach = [...updatedWithUser, coachMsg];
      setChatMessages(updatedWithCoach);
      localStorage.setItem(getPrefix() + 'chatMessages', JSON.stringify(updatedWithCoach));
    }
  };

  const clearCoachChat = () => {
    const welcome = createDefaultWelcomeMessage(user.username);
    setChatMessages([welcome]);
    localStorage.setItem(getPrefix() + 'chatMessages', JSON.stringify([welcome]));
  };

  const applyAction = (actionId: string) => {
    let actionFound: ProposedAction | undefined;

    setChatMessages(prev =>
      prev.map(msg => {
        if (!msg.proposedActions) return msg;
        return {
          ...msg,
          proposedActions: msg.proposedActions.map(action => {
            if (action.id === actionId) {
              actionFound = action;
              return { ...action, status: 'applied' as const };
            }
            return action;
          })
        };
      })
    );

    if (actionFound) {
      if (actionFound.type === 'add_habit' && actionFound.payload.name) {
        addHabit(actionFound.payload.name, actionFound.payload.type || 'good');
      } else if (actionFound.type === 'update_schedule' && actionFound.payload.schedule) {
        updateSchedule(actionFound.payload.schedule);
      } else if (actionFound.type === 'memory_recommendation') {
        setActiveTab('smritiveda');
      } else if (actionFound.type === 'mindfulness_recommendation') {
        setActiveTab('mindfulness');
      }
    }
  };

  const dismissAction = (actionId: string) => {
    setChatMessages(prev =>
      prev.map(msg => {
        if (!msg.proposedActions) return msg;
        return {
          ...msg,
          proposedActions: msg.proposedActions.map(action => {
            if (action.id === actionId) {
              return { ...action, status: 'dismissed' as const };
            }
            return action;
          })
        };
      })
    );
  };

  const loadDemoData = () => {
    const today = new Date();
    const demoLogs: DailyLog[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      
      const sleep = [7.5, 8.0, 6.5, 8.2, 7.8, 6.8, 8.0][6 - i];
      const screen = [3.5, 4.2, 5.0, 3.2, 3.8, 4.5, 3.0][6 - i];
      const completed = ['h1', 'h2', 'h3', 'h4'].slice(0, 2 + (i % 3));

      const breakdown = calculateDailyDisciplineScore(sleep, 8.0, screen, 4.0, DEFAULT_HABITS, completed);

      demoLogs.push({
        date: dateStr,
        sleepHours: sleep,
        screenTimeHours: screen,
        moodScore: [8, 9, 6, 8, 8, 7, 9][6 - i],
        energyScore: [7, 8, 5, 8, 8, 6, 9][6 - i],
        productivityScore: [8, 9, 6, 8, 8, 7, 9][6 - i],
        notes: i === 0 ? 'High focus, completed deep work block and Telugu chanting.' : 'Consistent routine.',
        disciplineScore: breakdown.total,
        completedHabitIds: completed,
        avoidedBadHabitIds: ['h5', 'h6']
      });
    }

    const demoMemory: MemorySession[] = [
      { id: 'm1', date: demoLogs[4].date, gameType: 'matrix', difficulty: 'easy', score: 92, accuracy: 95, timeSpentSeconds: 45, timestamp: new Date().toISOString() },
      { id: 'm2', date: demoLogs[5].date, gameType: 'sequence', difficulty: 'medium', score: 85, accuracy: 88, timeSpentSeconds: 60, timestamp: new Date().toISOString() },
      { id: 'm3', date: demoLogs[6].date, gameType: 'object_memory', difficulty: 'medium', score: 96, accuracy: 100, timeSpentSeconds: 50, timestamp: new Date().toISOString() },
    ];

    const demoMindfulness: MindfulnessSession[] = [
      { id: 'ms1', date: demoLogs[4].date, type: 'breathing', technique: 'box', durationSeconds: 240, moodBefore: 6, moodAfter: 9, reflectionNotes: 'Felt immediate nervous relaxation.', timestamp: new Date().toISOString() },
      { id: 'ms2', date: demoLogs[6].date, type: 'meditation', durationSeconds: 300, moodBefore: 7, moodAfter: 9, reflectionNotes: 'Clear mental clarity before deep work.', timestamp: new Date().toISOString() },
    ];

    const demoChanting: ChantingSession[] = [
      { id: 'c1', date: demoLogs[5].date, chantId: 'vemana_atmasuddhi', chantTitle: 'Aathmasuddhi (Vemana)', language: 'telugu', repetitionsCompleted: 9, targetRepetitions: 9, mode: 'repeat', durationSeconds: 180, timestamp: new Date().toISOString() },
      { id: 'c2', date: demoLogs[6].date, chantId: 'sanskrit_gayatri', chantTitle: 'Gayatri Mantra', language: 'sanskrit', repetitionsCompleted: 21, targetRepetitions: 21, mode: 'recall', durationSeconds: 320, timestamp: new Date().toISOString() },
    ];

    const demoFocus: FocusSession[] = [
      { id: 'f1', date: demoLogs[6].date, taskName: 'Architecting SMRITARA 2.0 Core Engine', durationMinutes: 45, timestamp: new Date().toISOString() },
      { id: 'f2', date: demoLogs[5].date, taskName: 'Smriti Veda Synthesis', durationMinutes: 30, timestamp: new Date().toISOString() }
    ];

    const demoPractice: PracticeSession[] = [
      {
        id: 'p1',
        activityType: 'memory',
        activityId: 'sequence',
        activityTitle: 'Memory: sequence',
        startTime: new Date(Date.now() - 86400000 - 300000).toISOString(),
        completedAt: new Date(Date.now() - 86400000).toISOString(),
        durationSeconds: 300,
        completed: true,
        score: 80,
        correctCount: 8,
        difficulty: 'medium'
      },
      {
        id: 'p2',
        activityType: 'meditation',
        activityId: 'box_breathing',
        activityTitle: 'Mindfulness: box',
        startTime: new Date(Date.now() - 86400000 - 300000).toISOString(),
        completedAt: new Date(Date.now() - 86400000).toISOString(),
        durationSeconds: 300,
        completed: true
      },
      {
        id: 'p3',
        activityType: 'chanting',
        activityId: 'sanskrit_gayatri',
        activityTitle: 'Chanting: Gayatri Mantra',
        startTime: new Date(Date.now() - 86400000 - 320000).toISOString(),
        completedAt: new Date(Date.now() - 86400000).toISOString(),
        durationSeconds: 320,
        completed: true,
        correctCount: 21
      }
    ];

    setDailyLogs(demoLogs);
    setMemorySessions(demoMemory);
    setMindfulnessSessions(demoMindfulness);
    setChantingSessions(demoChanting);
    setFocusSessions(demoFocus);
    setPracticeSessions(demoPractice);
    setUser(prev => ({
      ...prev,
      currentStreak: 7,
      disciplineScore: 86
    }));
  };

  const resetAllData = () => {
    const p = getPrefix();
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith(p)) localStorage.removeItem(k);
    });

    if (isDemoMode) {
      setUser(DEMO_SANDBOX_USER);
      setHabits(DEFAULT_HABITS);
    } else {
      setUser(prev => ({
        ...prev,
        disciplineScore: 0,
        currentStreak: 0
      }));
      setHabits([]);
    }
    setDailyLogs([]);
    setFocusSessions([]);
    setMemorySessions([]);
    setMindfulnessSessions([]);
    setChantingSessions([]);
    setPracticeSessions([]);
    setTodaySchedule(generateScheduleForChronotype('bear'));
    setChatMessages([
      {
        id: 'welcome_reset',
        sender: 'coach',
        text: 'All records have been reset to a clean slate. Ready to calibrate your true baseline.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const exportData = (): SmritaraBackupPackage => {
    return {
      appName: 'SMRITARA',
      schemaVersion: '3.0',
      exportedAt: new Date().toISOString(),
      payload: {
        user,
        habits,
        dailyLogs,
        focusSessions,
        memorySessions,
        mindfulnessSessions,
        chantingSessions,
        practiceSessions,
        favourites,
        todaySchedule,
        chatMessages
      }
    };
  };

  const importData = (imported: unknown): { success: boolean; message: string; counts?: { habits: number; logs: number; sessions: number } } => {
    if (!imported || typeof imported !== 'object') {
      return { success: false, message: 'Invalid file format: JSON root must be an object.' };
    }

    const pkg = imported as Partial<SmritaraBackupPackage>;

    if (pkg.appName !== 'SMRITARA') {
      return { success: false, message: 'Invalid backup file: appName does not match SMRITARA.' };
    }

    if (!pkg.payload || typeof pkg.payload !== 'object') {
      return { success: false, message: 'Malformed backup: missing payload data.' };
    }

    const { payload } = pkg;

    if (!Array.isArray(payload.habits)) {
      return { success: false, message: 'Schema validation error: habits must be an array.' };
    }

    if (!Array.isArray(payload.dailyLogs)) {
      return { success: false, message: 'Schema validation error: dailyLogs must be an array.' };
    }

    if (payload.user) {
      setUser(prev => sanitizeUser({
        ...prev,
        ...payload.user,
        geminiApiKey: payload.user?.geminiApiKey !== undefined ? payload.user.geminiApiKey : prev.geminiApiKey
      }));
    }

    setHabits(payload.habits);
    setDailyLogs(payload.dailyLogs);

    if (Array.isArray(payload.focusSessions)) setFocusSessions(payload.focusSessions);
    if (Array.isArray(payload.memorySessions)) setMemorySessions(payload.memorySessions);
    if (Array.isArray(payload.mindfulnessSessions)) setMindfulnessSessions(payload.mindfulnessSessions);
    if (Array.isArray(payload.chantingSessions)) setChantingSessions(payload.chantingSessions);
    if (Array.isArray(payload.practiceSessions)) setPracticeSessions(payload.practiceSessions);
    if (Array.isArray(payload.favourites)) setFavourites(payload.favourites);
    if (Array.isArray(payload.todaySchedule) && payload.todaySchedule.length > 0) setTodaySchedule(payload.todaySchedule);
    if (Array.isArray(payload.chatMessages) && payload.chatMessages.length > 0) setChatMessages(payload.chatMessages);

    const sessionsCount = (payload.focusSessions?.length || 0) + (payload.memorySessions?.length || 0) + (payload.mindfulnessSessions?.length || 0) + (payload.chantingSessions?.length || 0) + (payload.practiceSessions?.length || 0);

    return {
      success: true,
      message: 'Backup imported successfully.',
      counts: {
        habits: payload.habits.length,
        logs: payload.dailyLogs.length,
        sessions: sessionsCount
      }
    };
  };

  return (
    <AppContext.Provider
      value={{
        user,
        currentUser,
        isDemoMode,
        isAuthenticated: Boolean(currentUser) || isDemoMode,
        isOnboarding,
        habits,
        dailyLogs,
        focusSessions,
        memorySessions,
        mindfulnessSessions,
        chantingSessions,
        practiceSessions,
        favourites,
        chatMessages,
        todaySchedule,
        patternInsights,
        activeTab,
        setActiveTab,
        isCloudConnected,
        cloudSyncStatus,
        resetUserPassword,
        resendVerification,
        syncToCloud,
        registerAccount,
        loginAccount,
        logout,
        enterDemoMode,
        exitDemoMode,
        completeOnboarding,
        toggleFavourite,
        recordChantingSession,
        recordPracticeSession,
        updateUserTargets,
        updateUserSettings,
        setGeminiApiKey,
        saveChronotypeResult,
        updateSchedule,
        addHabit,
        deleteHabit,
        toggleHabitForDate,
        upsertDailyLog,
        addFocusSession,
        recordMemorySession,
        recordMindfulnessSession,
        sendMessageToCoach,
        clearCoachChat,
        applyAction,
        dismissAction,
        loadDemoData,
        resetAllData,
        getTodayLog,
        exportData,
        importData,
        setInterfaceLanguage,
        soundEnabled,
        setSoundEnabled,
        speechRate,
        setSpeechRate,
        todayTip,
        dismissTip,
        savedTipIds,
        toggleSaveTip,
        milestones,
        practicePoints,
        celebrationsEnabled,
        setCelebrationsEnabled,
        ambientEnabled,
        setAmbientEnabled,
        toggleAmbient,
        weeklyReportsEnabled,
        setWeeklyReportsEnabled,
        reportHistory,
        generateAndEmailReport
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
