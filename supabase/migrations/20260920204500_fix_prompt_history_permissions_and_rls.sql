-- Migration: Fix prompt_history and profiles permissions and RLS
-- Resolves HTTP 403 Forbidden by granting required table-level privileges to the 'authenticated' role
-- while strictly preserving Row Level Security (RLS) data isolation.

-- 1. Ensure schema usage is granted
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- 2. Grant table-level permissions to the 'authenticated' role
-- PostgreSQL requires table-level GRANT before Row Level Security (RLS) policies are evaluated.
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.prompt_history TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.profiles TO authenticated;

-- 3. Ensure Row Level Security (RLS) remains strictly enabled
ALTER TABLE public.prompt_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Re-assert strict user-level data isolation policies (auth.uid() = user_id)
DROP POLICY IF EXISTS "Users can view their own prompt history" ON public.prompt_history;
DROP POLICY IF EXISTS "Users can insert their own prompt history" ON public.prompt_history;
DROP POLICY IF EXISTS "Users can update their own prompt history" ON public.prompt_history;
DROP POLICY IF EXISTS "Users can delete their own prompt history" ON public.prompt_history;

CREATE POLICY "Users can view their own prompt history"
  ON public.prompt_history
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own prompt history"
  ON public.prompt_history
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own prompt history"
  ON public.prompt_history
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own prompt history"
  ON public.prompt_history
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- 5. Profiles RLS policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);
