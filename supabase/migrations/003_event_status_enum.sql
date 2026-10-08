-- Replace the old draft/published/archived status text with an enum.
-- Drafts stay admin-only. All other statuses are visible in the mobile app.
DO $$
BEGIN
  CREATE TYPE public.event_status AS ENUM ('draft', 'coming', 'ongoing', 'archived');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END;
$$;

DO $$
DECLARE
  unsupported_statuses TEXT;
BEGIN
  SELECT string_agg(DISTINCT status::text, ', ')
  INTO unsupported_statuses
  FROM public.events
  WHERE lower(btrim(status::text)) NOT IN ('draft', 'published', 'coming', 'ongoing', 'archived');

  IF unsupported_statuses IS NOT NULL THEN
    RAISE EXCEPTION 'Unsupported event statuses exist: %. Update them before rerunning this migration.', unsupported_statuses;
  END IF;
END;
$$;

ALTER TABLE public.events
  DROP CONSTRAINT IF EXISTS events_status_check;

ALTER TABLE public.events
  ALTER COLUMN status DROP DEFAULT;

-- Convert through text so this works whether the current column is TEXT or enum.
ALTER TABLE public.events
  ALTER COLUMN status TYPE text USING status::text;

UPDATE public.events
SET status = CASE lower(btrim(status))
  WHEN 'draft' THEN 'draft'
  WHEN 'coming' THEN 'coming'
  WHEN 'ongoing' THEN 'ongoing'
  WHEN 'archived' THEN 'archived'
  WHEN 'published' THEN CASE
    WHEN ends_at IS NOT NULL AND ends_at < now() THEN 'archived'
    WHEN ends_at IS NULL
      AND (starts_at AT TIME ZONE 'Asia/Kolkata')::date
        < (now() AT TIME ZONE 'Asia/Kolkata')::date THEN 'archived'
    WHEN starts_at <= now() THEN 'ongoing'
    ELSE 'coming'
  END
END;

ALTER TABLE public.events
  ALTER COLUMN status TYPE public.event_status
  USING status::public.event_status;

ALTER TABLE public.events
  ALTER COLUMN status SET DEFAULT 'coming'::public.event_status;

DROP POLICY IF EXISTS "Events public read published" ON public.events;
DROP POLICY IF EXISTS "Events public read non-drafts" ON public.events;
CREATE POLICY "Events public read non-drafts" ON public.events
  FOR SELECT USING (
    status <> 'draft' OR public.is_admin(auth.uid())
  );
