ALTER TABLE public.success_stories ADD COLUMN slug text UNIQUE, ADD COLUMN content text;

-- Generate slugs for existing rows
UPDATE public.success_stories SET slug = lower(regexp_replace(regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g')) WHERE slug IS NULL;

-- Make slug NOT NULL after populating
ALTER TABLE public.success_stories ALTER COLUMN slug SET NOT NULL;