-- One row per authenticated user: full app UserState as JSONB.
-- Curriculum stays client-side; only progress is stored per user.

CREATE TABLE public.user_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  state JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER user_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW
  EXECUTE FUNCTION system.update_updated_at();

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owners can select own progress"
  ON public.user_progress
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "owners can insert own progress"
  ON public.user_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "owners can update own progress"
  ON public.user_progress
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "owners can delete own progress"
  ON public.user_progress
  FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- Narrow privileges: anon has no access; authenticated can CRUD own rows via RLS.
REVOKE ALL ON public.user_progress FROM anon;
REVOKE ALL ON public.user_progress FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_progress TO authenticated;
