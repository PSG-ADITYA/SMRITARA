import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient, Session, User } from '@supabase/supabase-js';
import type { 
  UserProfile, 
  PracticeSession, 
  MemorySession, 
  MindfulnessSession, 
  ChantingSession, 
  DailyLog, 
  Habit 
} from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project-id')
  );
};

// Singleton Supabase Client
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// ============================================================================
// Authentication API
// ============================================================================

export interface AuthResult {
  success: boolean;
  user?: User | null;
  session?: Session | null;
  error?: string;
}

export async function signUpWithEmail(email: string, password: string, fullName: string): Promise<AuthResult> {
  if (!supabase) {
    return { success: false, error: 'Cloud authentication is not configured yet. Running in offline/demo mode.' };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Automatically initialize user profile in public.profiles table
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email: data.user.email,
        username: fullName,
        onboarding_completed: false,
        discipline_score: 0,
        current_streak: 0,
        target_sleep: 8.0,
        target_screen_time: 4.0,
        created_at: new Date().toISOString(),
      });
    }

    return { success: true, user: data.user, session: data.session };
  } catch (err: any) {
    return { success: false, error: err.message || 'Registration failed' };
  }
}

export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  if (!supabase) {
    return { success: false, error: 'Cloud authentication is not configured yet.' };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user, session: data.session };
  } catch (err: any) {
    return { success: false, error: err.message || 'Sign in failed' };
  }
}

export async function signOutUser(): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: true };

  try {
    const { error } = await supabase.auth.signOut();
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Cloud authentication is not configured yet.' };
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function resendVerificationEmail(email: string): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Cloud authentication is not configured yet.' };
  }

  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email.trim(),
      options: {
        emailRedirectTo: window.location.origin
      }
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to resend confirmation email.' };
  }
}

export async function getCurrentSession(): Promise<Session | null> {
  if (!supabase) return null;
  try {
    const { data } = await supabase.auth.getSession();
    return data.session;
  } catch {
    return null;
  }
}

// ============================================================================
// Cloud Data Persistence API (Protected with Row Level Security)
// ============================================================================

export async function fetchCloudProfile(userId: string): Promise<Partial<UserProfile> | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      username: data.username || '',
      email: data.email || '',
      targetSleep: data.target_sleep ?? 8.0,
      targetScreenTime: data.target_screen_time ?? 4.0,
      onboardingCompleted: data.onboarding_completed ?? false,
      onboardingPreferences: data.preferences,
      personalizedPlan: data.personalized_plan,
      disciplineScore: data.discipline_score ?? 0,
      currentStreak: data.current_streak ?? 0,
      chronotypeProfile: data.chronotype_profile,
      createdAt: data.created_at,
      isDemo: false,
    };
  } catch {
    return null;
  }
}

export async function saveCloudProfile(userId: string, profile: Partial<UserProfile>): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('profiles').upsert({
      id: userId,
      username: profile.username,
      email: profile.email,
      target_sleep: profile.targetSleep,
      target_screen_time: profile.targetScreenTime,
      onboarding_completed: profile.onboardingCompleted,
      preferences: profile.onboardingPreferences,
      personalized_plan: profile.personalizedPlan,
      discipline_score: profile.disciplineScore,
      current_streak: profile.currentStreak,
      chronotype_profile: profile.chronotypeProfile,
      updated_at: new Date().toISOString(),
    });

    return !error;
  } catch {
    return false;
  }
}

export async function fetchCloudPracticeSessions(userId: string): Promise<PracticeSession[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('practice_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });

    if (error || !data) return [];

    return data.map((d: any) => ({
      id: d.id,
      activityType: d.activity_type,
      activityId: d.activity_id,
      activityTitle: d.activity_title,
      startTime: d.start_time,
      completedAt: d.completed_at,
      durationSeconds: d.duration_seconds,
      completed: d.completed,
      score: d.score,
      attempts: d.attempts,
      correctCount: d.correct_count,
      errorCount: d.error_count,
      difficulty: d.difficulty,
      metadata: d.metadata,
    }));
  } catch {
    return [];
  }
}

export async function saveCloudPracticeSession(userId: string, session: PracticeSession): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('practice_sessions').insert({
      id: session.id,
      user_id: userId,
      activity_type: session.activityType,
      activity_id: session.activityId,
      activity_title: session.activityTitle,
      start_time: session.startTime,
      completed_at: session.completedAt,
      duration_seconds: session.durationSeconds,
      completed: session.completed,
      score: session.score,
      attempts: session.attempts,
      correct_count: session.correctCount,
      error_count: session.errorCount,
      difficulty: session.difficulty,
      metadata: session.metadata,
    });

    return !error;
  } catch {
    return false;
  }
}

export async function fetchCloudDailyLogs(userId: string): Promise<DailyLog[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('daily_logs')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error || !data) return [];

    return data.map((d: any) => ({
      date: d.date,
      sleepHours: d.sleep_hours,
      screenTimeHours: d.screen_time_hours,
      moodScore: d.mood_score,
      energyScore: d.energy_score,
      productivityScore: d.productivity_score,
      disciplineScore: d.discipline_score,
      notes: d.notes || '',
      completedHabitIds: d.completed_habit_ids || [],
      avoidedBadHabitIds: d.avoided_bad_habit_ids || [],
    }));
  } catch {
    return [];
  }
}

export async function saveCloudDailyLog(userId: string, log: DailyLog): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('daily_logs').upsert({
      user_id: userId,
      date: log.date,
      sleep_hours: log.sleepHours,
      screen_time_hours: log.screenTimeHours,
      mood_score: log.moodScore,
      energy_score: log.energyScore,
      productivity_score: log.productivityScore,
      discipline_score: log.disciplineScore,
      notes: log.notes,
      completed_habit_ids: log.completedHabitIds,
      avoided_bad_habit_ids: log.avoidedBadHabitIds,
      updated_at: new Date().toISOString(),
    });

    return !error;
  } catch {
    return false;
  }
}

export async function fetchCloudHabits(userId: string): Promise<Habit[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error || !data) return [];

    return data.map((d: any) => ({
      id: d.id,
      name: d.name,
      type: d.type,
      category: d.category,
      streak: d.streak || 0,
      createdAt: d.created_at,
    }));
  } catch {
    return [];
  }
}

export async function saveCloudHabits(userId: string, habits: Habit[]): Promise<boolean> {
  if (!supabase) return false;

  try {
    // Upsert habits
    const rows = habits.map(h => ({
      id: h.id,
      user_id: userId,
      name: h.name,
      type: h.type,
      category: h.category,
      streak: h.streak,
      created_at: h.createdAt,
    }));

    const { error } = await supabase.from('habits').upsert(rows);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteCloudHabit(userId: string, habitId: string): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', habitId)
      .eq('user_id', userId);

    return !error;
  } catch {
    return false;
  }
}

export async function fetchCloudSavedTips(userId: string): Promise<string[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('saved_tips')
      .select('tip_id')
      .eq('user_id', userId);

    if (error || !data) return [];
    return data.map((d: any) => d.tip_id);
  } catch {
    return [];
  }
}

export async function toggleCloudSavedTip(userId: string, tipId: string, isSaved: boolean): Promise<boolean> {
  if (!supabase) return false;

  try {
    if (isSaved) {
      const { error } = await supabase.from('saved_tips').upsert({
        user_id: userId,
        tip_id: tipId,
        saved_at: new Date().toISOString(),
      });
      return !error;
    } else {
      const { error } = await supabase
        .from('saved_tips')
        .delete()
        .eq('user_id', userId)
        .eq('tip_id', tipId);
      return !error;
    }
  } catch {
    return false;
  }
}

// Bulk migration of existing local browser data to cloud database upon account creation / sign in
export async function migrateLocalDataToCloud(
  userId: string,
  localData: {
    profile?: Partial<UserProfile>;
    practiceSessions?: PracticeSession[];
    dailyLogs?: DailyLog[];
    habits?: Habit[];
    savedTips?: string[];
  }
): Promise<{ success: boolean; migratedCounts: { sessions: number; logs: number; habits: number; tips: number } }> {
  const counts = { sessions: 0, logs: 0, habits: 0, tips: 0 };
  if (!supabase) return { success: false, migratedCounts: counts };

  try {
    if (localData.profile) {
      await saveCloudProfile(userId, localData.profile);
    }

    if (localData.practiceSessions && localData.practiceSessions.length > 0) {
      for (const s of localData.practiceSessions) {
        const ok = await saveCloudPracticeSession(userId, s);
        if (ok) counts.sessions++;
      }
    }

    if (localData.dailyLogs && localData.dailyLogs.length > 0) {
      for (const l of localData.dailyLogs) {
        const ok = await saveCloudDailyLog(userId, l);
        if (ok) counts.logs++;
      }
    }

    if (localData.habits && localData.habits.length > 0) {
      const ok = await saveCloudHabits(userId, localData.habits);
      if (ok) counts.habits = localData.habits.length;
    }

    if (localData.savedTips && localData.savedTips.length > 0) {
      for (const t of localData.savedTips) {
        const ok = await toggleCloudSavedTip(userId, t, true);
        if (ok) counts.tips++;
      }
    }

    return { success: true, migratedCounts: counts };
  } catch {
    return { success: false, migratedCounts: counts };
  }
}
