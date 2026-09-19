-- Migration: Create profiles and prompt_history tables with RLS enabled
-- Note: Policies and triggers will be configured in subsequent steps.

-- 1. Table: public.profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NULL,
  email TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Table: public.prompt_history
CREATE TABLE IF NOT EXISTS public.prompt_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_prompt TEXT NOT NULL,
  improved_prompt TEXT NOT NULL,
  task_type TEXT NOT NULL DEFAULT 'General',
  quality_score INTEGER NOT NULL CHECK (quality_score >= 0 AND quality_score <= 100),
  analysis JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Indexes for prompt_history
CREATE INDEX IF NOT EXISTS prompt_history_user_id_idx 
  ON public.prompt_history(user_id);

CREATE INDEX IF NOT EXISTS prompt_history_user_id_created_at_idx 
  ON public.prompt_history(user_id, created_at DESC);

-- 4. Enable Row Level Security (RLS) on both tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_history ENABLE ROW LEVEL SECURITY;
