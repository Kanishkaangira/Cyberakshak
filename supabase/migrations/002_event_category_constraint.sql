-- Convert the existing event category column to a PostgreSQL enum.
DO $$
BEGIN
  CREATE TYPE public.event_category AS ENUM ('Seminar', 'Workshop', 'Webinar');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END;
$$;

DO $$
DECLARE
  unsupported_categories TEXT;
BEGIN
  SELECT string_agg(DISTINCT category::text, ', ')
  INTO unsupported_categories
  FROM public.events
  WHERE lower(btrim(category::text)) NOT IN ('seminar', 'workshop', 'webinar');

  IF unsupported_categories IS NOT NULL THEN
    RAISE EXCEPTION 'Unsupported event categories exist: %. Update them to Seminar, Workshop, or Webinar, then rerun this migration.', unsupported_categories;
  END IF;
END;
$$;

ALTER TABLE public.events
  DROP CONSTRAINT IF EXISTS events_category_check;

ALTER TABLE public.events
  ALTER COLUMN category DROP DEFAULT;

-- Convert through text so this works whether the current column is TEXT or enum.
ALTER TABLE public.events
  ALTER COLUMN category TYPE text USING category::text;

UPDATE public.events
SET category = CASE lower(btrim(category))
  WHEN 'seminar' THEN 'Seminar'
  WHEN 'workshop' THEN 'Workshop'
  WHEN 'webinar' THEN 'Webinar'
END
WHERE category IS DISTINCT FROM CASE lower(btrim(category))
  WHEN 'seminar' THEN 'Seminar'
  WHEN 'workshop' THEN 'Workshop'
  WHEN 'webinar' THEN 'Webinar'
END;

ALTER TABLE public.events
  ALTER COLUMN category TYPE public.event_category
  USING category::public.event_category;

ALTER TABLE public.events
  ALTER COLUMN category SET DEFAULT 'Webinar'::public.event_category;
