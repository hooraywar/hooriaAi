-- Give each curriculum a stable slug so it can be linked to directly
-- (e.g. from a specific program), plus optional hero/detail copy that
-- replaces the old hardcoded "Program Snapshot" content. All detail
-- fields are optional — the page only shows what's filled in.
ALTER TABLE public.curriculums ADD COLUMN slug TEXT;
ALTER TABLE public.curriculums ADD COLUMN subtitle TEXT;
ALTER TABLE public.curriculums ADD COLUMN description TEXT;
ALTER TABLE public.curriculums ADD COLUMN duration TEXT;
ALTER TABLE public.curriculums ADD COLUMN prerequisites TEXT;
ALTER TABLE public.curriculums ADD COLUMN class_duration TEXT;
ALTER TABLE public.curriculums ADD COLUMN qa_session TEXT;

UPDATE public.curriculums
SET slug = trim(both '-' from regexp_replace(lower(title), '[^a-z0-9]+', '-', 'g'))
WHERE slug IS NULL;

ALTER TABLE public.curriculums ALTER COLUMN slug SET NOT NULL;
ALTER TABLE public.curriculums ADD CONSTRAINT curriculums_slug_key UNIQUE (slug);

-- Let a program link to the curriculum that should open when it's clicked.
ALTER TABLE public.services ADD COLUMN curriculum_id UUID REFERENCES public.curriculums(id) ON DELETE SET NULL;

-- Single-row settings for the homepage curriculum preview section: its
-- heading copy and an on/off switch to hide the whole section.
CREATE TABLE public.curriculum_preview_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  eyebrow TEXT NOT NULL DEFAULT 'Curriculum',
  heading TEXT NOT NULL DEFAULT '8 modules. 10 weeks. Zero fluff.',
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.curriculum_preview_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.curriculum_preview_settings TO authenticated;
GRANT ALL ON public.curriculum_preview_settings TO service_role;
ALTER TABLE public.curriculum_preview_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Curriculum preview settings are publicly viewable" ON public.curriculum_preview_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage curriculum preview settings" ON public.curriculum_preview_settings FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

INSERT INTO public.curriculum_preview_settings (eyebrow, heading, is_visible)
VALUES ('Curriculum', '8 modules. 10 weeks. Zero fluff.', true);
