-- Migration: Create Row Level Security (RLS) policies for profiles and prompt_history
-- Enforces strict user-level data isolation using (select auth.uid()).

-- ==================================================
-- 1. PROFILES POLICIES
-- ==================================================

-- Policy: Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING ((select auth.uid()) = id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK ((select auth.uid()) = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- ==================================================
-- 2. PROMPT HISTORY POLICIES
-- ==================================================

-- Policy: Users can view their own prompt history
CREATE POLICY "Users can view their own prompt history"
  ON public.prompt_history
  FOR SELECT
  USING ((select auth.uid()) = user_id);

-- Policy: Users can insert their own prompt history
CREATE POLICY "Users can insert their own prompt history"
  ON public.prompt_history
  FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);

-- Policy: Users can update their own prompt history
CREATE POLICY "Users can update their own prompt history"
  ON public.prompt_history
  FOR UPDATE
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- Policy: Users can delete their own prompt history
CREATE POLICY "Users can delete their own prompt history"
  ON public.prompt_history
  FOR DELETE
  USING ((select auth.uid()) = user_id);
