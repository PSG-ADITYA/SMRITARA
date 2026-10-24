import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  UserProfile,
  Habit,
  DailyLog,
  FocusSession,
  MemorySession,
  MindfulnessSession,
  ChatMessage,
  DailyScheduleBlock,
  PatternInsight,
  ChronotypeProfile,
  ProposedAction,
  SmritaraBackupPackage
} from '../types';
import { calculateDailyDisciplineScore, calculateStreak, calculateRollingScore } from '../engine/scoring';
import { computePatternInsights } from '../engine/patternEngine';
import { sendCoachMessage } from '../engine/gemini';
import { generateScheduleForChronotype } from '../engine/chronotype';

interface AppContextType {
  user: UserProfile;
  habits: Habit[];
  dailyLogs: DailyLog[];
  focusSessions: FocusSession[];
  memorySessions: MemorySession[];
  mindfulnessSessions: MindfulnessSession[];
  chatMessages: ChatMessage[];
  todaySchedule: DailyScheduleBlock[];
  patternInsights: PatternInsight[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  updateUserTargets: (targetSleep: number, targetScreenTime: number) => void;
  setGeminiApiKey: (key: string) => void;
  saveChronotypeResult: (profile: ChronotypeProfile) => void;
  updateSchedule: (newSchedule: DailyScheduleBlock[]) => void;
  addHabit: (name: string, type: 'good' | 'bad', category?: string) => void;
  deleteHabit: (id: string) => void;
  toggleHabitForDate: (habitId: string, dateStr: string) => void;
  upsertDailyLog: (log: Omit<DailyLog, 'disciplineScore' | 'completedHabitIds' | 'avoidedBadHabitIds'>) => void;
  addFocusSession: (taskName: string, durationMinutes: number) => void;
  recordMemorySession: (session: Omit<MemorySession, 'id' | 'timestamp'>) => void;
  recordMindfulnessSession: (session: Omit<MindfulnessSession, 'id' | 'timestamp'>) => void;
  sendMessageToCoach: (text: string) => Promise<void>;
  applyAction: (actionId: string) => void;
  dismissAction: (actionId: string) => void;
  loadDemoData: () => void;
  resetAllData: () => void;
  getTodayLog: () => DailyLog | undefined;
  exportData: () => SmritaraBackupPackage;
  importData: (imported: unknown) => { success: boolean; message: string; counts?: { habits: number; logs: number; sessions: number } };
}

const STORAGE_KEY_PREFIX = 'smritara_v1_';

const DEFAULT_HABITS: Habit[] = [
  { id: 'h1', name: 'Morning Sunlight & Hydration', type: 'good', category: 'Energy', streak: 4, createdAt: new Date().toISOString() },
  { id: 'h2', name: '25m Deep Work Focus Sprint', type: 'good', category: 'Productivity', streak: 6, createdAt: new Date().toISOString() },
  { id: 'h3', name: 'Mindful Breathing / Calm Pause', type: 'good', category: 'Mental Health', streak: 3, createdAt: new Date().toISOString() },
  { id: 'h4', name: 'Physical Movement / 6k Steps', type: 'good', category: 'Fitness', streak: 5, createdAt: new Date().toISOString() },
  { id: 'h5', name: 'Social Media Doomscrolling', type: 'bad', category: 'Focus', streak: 2, createdAt: new Date().toISOString() },
  { id: 'h6', name: 'Late Night Screen Blue Light', type: 'bad', category: 'Sleep', streak: 4, createdAt: new Date().toISOString() },
];

const INITIAL_USER: UserProfile = {
  id: 'user_default',
  username: 'Sriraghav',
  targetSleep: 8.0,
  targetScreenTime: 4.0,
  onboardingCompleted: true,
  disciplineScore: 84,
  currentStreak: 5,
  geminiApiKey: '',
  createdAt: new Date().toISOString()
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Helper to read from LocalStorage
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const [user, setUser] = useState<UserProfile>(() => loadStored('user', INITIAL_USER));
  const [habits, setHabits] = useState<Habit[]>(() => loadStored('habits', DEFAULT_HABITS));
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>(() => loadStored('dailyLogs', []));
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(() => loadStored('focusSessions', []));
  const [memorySessions, setMemorySessions] = useState<MemorySession[]>(() => loadStored('memorySessions', []));
  const [mindfulnessSessions, setMindfulnessSessions] = useState<MindfulnessSession[]>(() => loadStored('mindfulnessSessions', []));
  const [todaySchedule, setTodaySchedule] = useState<DailyScheduleBlock[]>(() => 
    loadStored('todaySchedule', generateScheduleForChronotype('bear'))
  );
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => loadStored('chatMessages', [
    {
      id: 'welcome_msg',
      sender: 'coach',
      text: `Welcome to **SMRITARA**. I am your grounded AI Life Coach. 

I connect your **Body Clock**, **Discipline OS**, **Memory Gym**, and **Mindfulness Studio** using your actual stored records. Complete your daily log or take a 2-minute chronotype assessment to start personalizing your routine.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]));
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Sync to local storage
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PREFIX + 'user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PREFIX + 'habits', JSON.stringify(habits)); }, [habits]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PREFIX + 'dailyLogs', JSON.stringify(dailyLogs)); }, [dailyLogs]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PREFIX + 'focusSessions', JSON.stringify(focusSessions)); }, [focusSessions]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PREFIX + 'memorySessions', JSON.stringify(memorySessions)); }, [memorySessions]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PREFIX + 'mindfulnessSessions', JSON.stringify(mindfulnessSessions)); }, [mindfulnessSessions]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PREFIX + 'todaySchedule', JSON.stringify(todaySchedule)); }, [todaySchedule]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PREFIX + 'chatMessages', JSON.stringify(chatMessages)); }, [chatMessages]);

  // Dynamic Pattern Engine Insights
  const patternInsights = computePatternInsights(dailyLogs, focusSessions, mindfulnessSessions, memorySessions, habits);

  const getTodayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const getTodayLog = () => {
    const today = getTodayStr();
    return dailyLogs.find(l => l.date === today);
  };

  const updateUserTargets = (targetSleep: number, targetScreenTime: number) => {
    setUser(prev => ({ ...prev, targetSleep, targetScreenTime }));
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
          user.targetSleep,
          user.targetSleep,
          user.targetScreenTime,
          user.targetScreenTime,
          habits,
          newCompletedIds
        );

        updatedLog = {
          date: dateStr,
          sleepHours: user.targetSleep,
          screenTimeHours: user.targetScreenTime,
          moodScore: 8,
          energyScore: 7,
          productivityScore: 8,
          notes: '',
          disciplineScore: breakdown.total,
          completedHabitIds: newCompletedIds,
          avoidedBadHabitIds: []
        };

        return [...prevLogs, updatedLog];
      }
    });
  };

  const upsertDailyLog = (logInput: Omit<DailyLog, 'disciplineScore' | 'completedHabitIds' | 'avoidedBadHabitIds'>) => {
    setDailyLogs(prevLogs => {
      const existing = prevLogs.find(l => l.date === logInput.date);
      const completedHabitIds = existing ? existing.completedHabitIds : [];

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
        disciplineScore: breakdown.total
      };

      const updatedLogs = existing
        ? prevLogs.map(l => l.date === logInput.date ? newLog : l)
        : [...prevLogs, newLog];

      // Re-calculate streak and rolling score for user
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
  };

  const recordMemorySession = (sessionInput: Omit<MemorySession, 'id' | 'timestamp'>) => {
    const session: MemorySession = {
      ...sessionInput,
      id: 'mem_' + Date.now(),
      timestamp: new Date().toISOString()
    };
    setMemorySessions(prev => [session, ...prev]);
  };

  const recordMindfulnessSession = (sessionInput: Omit<MindfulnessSession, 'id' | 'timestamp'>) => {
    const session: MindfulnessSession = {
      ...sessionInput,
      id: 'mind_' + Date.now(),
      timestamp: new Date().toISOString()
    };
    setMindfulnessSessions(prev => [session, ...prev]);
  };

  const sendMessageToCoach = async (text: string) => {
    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);

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
      setChatMessages(prev => [...prev, coachMsg]);
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
      setChatMessages(prev => [...prev, coachMsg]);
    }
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
        setActiveTab('memory');
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
        notes: i === 0 ? 'High focus, completed deep work block and meditation.' : 'Consistent routine.',
        disciplineScore: breakdown.total,
        completedHabitIds: completed,
        avoidedBadHabitIds: ['h5', 'h6']
      });
    }

    const demoMemory: MemorySession[] = [
      { id: 'm1', date: demoLogs[4].date, gameType: 'matrix', difficulty: 'easy', score: 92, accuracy: 95, timeSpentSeconds: 45, timestamp: new Date().toISOString() },
      { id: 'm2', date: demoLogs[5].date, gameType: 'sequence', difficulty: 'medium', score: 85, accuracy: 88, timeSpentSeconds: 60, timestamp: new Date().toISOString() },
      { id: 'm3', date: demoLogs[6].date, gameType: 'passages', difficulty: 'medium', score: 96, accuracy: 100, timeSpentSeconds: 50, timestamp: new Date().toISOString() },
    ];

    const demoMindfulness: MindfulnessSession[] = [
      { id: 'ms1', date: demoLogs[4].date, type: 'breathing', technique: 'box', durationSeconds: 240, moodBefore: 6, moodAfter: 9, reflectionNotes: 'Felt immediate nervous relaxation.', timestamp: new Date().toISOString() },
      { id: 'ms2', date: demoLogs[6].date, type: 'meditation', durationSeconds: 300, moodBefore: 7, moodAfter: 9, reflectionNotes: 'Clear mental clarity before deep work.', timestamp: new Date().toISOString() },
    ];

    const demoFocus: FocusSession[] = [
      { id: 'f1', date: demoLogs[6].date, taskName: 'Architecting SMRITARA Core Engine', durationMinutes: 45, timestamp: new Date().toISOString() },
      { id: 'f2', date: demoLogs[5].date, taskName: 'Algorithm Optimization', durationMinutes: 30, timestamp: new Date().toISOString() }
    ];

    setDailyLogs(demoLogs);
    setMemorySessions(demoMemory);
    setMindfulnessSessions(demoMindfulness);
    setFocusSessions(demoFocus);
    setUser(prev => ({
      ...prev,
      currentStreak: 7,
      disciplineScore: 86
    }));
  };

  const resetAllData = () => {
    localStorage.clear();
    setUser(INITIAL_USER);
    setHabits(DEFAULT_HABITS);
    setDailyLogs([]);
    setFocusSessions([]);
    setMemorySessions([]);
    setMindfulnessSessions([]);
    setTodaySchedule(generateScheduleForChronotype('bear'));
    setChatMessages([
      {
        id: 'welcome_reset',
        sender: 'coach',
        text: 'All data has been reset to clean state. Ready to calibrate your baseline.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const exportData = (): SmritaraBackupPackage => {
    return {
      appName: 'SMRITARA',
      schemaVersion: '1.0',
      exportedAt: new Date().toISOString(),
      payload: {
        user,
        habits,
        dailyLogs,
        focusSessions,
        memorySessions,
        mindfulnessSessions,
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

    // Preserve local user credentials if imported user payload doesn't provide them
    if (payload.user) {
      setUser(prev => ({
        ...prev,
        ...payload.user,
        geminiApiKey: payload.user?.geminiApiKey !== undefined ? payload.user.geminiApiKey : prev.geminiApiKey
      }));
    }

    setHabits(payload.habits);
    setDailyLogs(payload.dailyLogs);

    if (Array.isArray(payload.focusSessions)) {
      setFocusSessions(payload.focusSessions);
    }
    if (Array.isArray(payload.memorySessions)) {
      setMemorySessions(payload.memorySessions);
    }
    if (Array.isArray(payload.mindfulnessSessions)) {
      setMindfulnessSessions(payload.mindfulnessSessions);
    }
    if (Array.isArray(payload.todaySchedule) && payload.todaySchedule.length > 0) {
      setTodaySchedule(payload.todaySchedule);
    }
    if (Array.isArray(payload.chatMessages) && payload.chatMessages.length > 0) {
      setChatMessages(payload.chatMessages);
    }

    const sessionsCount = (payload.focusSessions?.length || 0) + (payload.memorySessions?.length || 0) + (payload.mindfulnessSessions?.length || 0);

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
        habits,
        dailyLogs,
        focusSessions,
        memorySessions,
        mindfulnessSessions,
        chatMessages,
        todaySchedule,
        patternInsights,
        activeTab,
        setActiveTab,
        updateUserTargets,
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
        applyAction,
        dismissAction,
        loadDemoData,
        resetAllData,
        getTodayLog,
        exportData,
        importData
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
