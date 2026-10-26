-- ============================================================================
-- SMRITARA 3.1 — Production PostgreSQL Database Schema & Security Policies
-- Target: Supabase PostgreSQL (auth.users integration)
-- Row Level Security (RLS) is strictly enforced: Users can only access their own data.
-- ============================================================================

-- 1. Profiles Table (Extends auth.users with SMRITARA preferences and targets)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  username TEXT,
  target_sleep NUMERIC DEFAULT 8.0,
  target_screen_time NUMERIC DEFAULT 4.0,
  onboarding_completed BOOLEAN DEFAULT false,
  preferences JSONB,
  personalized_plan JSONB,
  discipline_score INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  chronotype_profile JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Practice Sessions Table (Verified cognitive drills, meditation, chanting)
CREATE TABLE IF NOT EXISTS public.practice_sessions (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  activity_id TEXT NOT NULL,
  activity_title TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL,
  duration_seconds INTEGER NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT true,
  score NUMERIC,
  attempts INTEGER,
  correct_count INTEGER,
  error_count INTEGER,
  difficulty TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Daily Logs Table (Circadian self-reflection, mood, energy, discipline)
CREATE TABLE IF NOT EXISTS public.daily_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  sleep_hours NUMERIC DEFAULT 0,
  screen_time_hours NUMERIC DEFAULT 0,
  mood_score INTEGER DEFAULT 5,
  energy_score INTEGER DEFAULT 5,
  productivity_score INTEGER DEFAULT 5,
  discipline_score INTEGER DEFAULT 0,
  notes TEXT,
  completed_habit_ids TEXT[] DEFAULT '{}',
  avoided_bad_habit_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- 4. Habits Table
CREATE TABLE IF NOT EXISTS public.habits (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('good', 'bad')),
  category TEXT,
  streak INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Saved Tips Table (Daily Wisdom bookmarks)
CREATE TABLE IF NOT EXISTS public.saved_tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tip_id TEXT NOT NULL,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tip_id)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_practice_sessions_user_completed ON public.practice_sessions(user_id, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_logs_user_date ON public.daily_logs(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_habits_user ON public.habits(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_tips_user ON public.saved_tips(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Each authenticated user can only view, insert, update, or delete their own rows.
-- Anonymous users cannot read any records.
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_tips ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);


-- 2. Practice Sessions Policies
CREATE POLICY "Users can view own practice sessions"
  ON public.practice_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own practice sessions"
  ON public.practice_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own practice sessions"
  ON public.practice_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own practice sessions"
  ON public.practice_sessions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 3. Daily Logs Policies
CREATE POLICY "Users can view own daily logs"
  ON public.daily_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily logs"
  ON public.daily_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily logs"
  ON public.daily_logs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own daily logs"
  ON public.daily_logs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 4. Habits Policies
CREATE POLICY "Users can view own habits"
  ON public.habits FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own habits"
  ON public.habits FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habits"
  ON public.habits FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own habits"
  ON public.habits FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 5. Saved Tips Policies
CREATE POLICY "Users can view own saved tips"
  ON public.saved_tips FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved tips"
  ON public.saved_tips FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved tips"
  ON public.saved_tips FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON AUTH.SIGNUP
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, created_at)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), NOW())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
