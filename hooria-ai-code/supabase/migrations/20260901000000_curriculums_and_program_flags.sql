-- Support multiple independently-toggleable curricula. Each curriculum groups
-- a set of full-page modules (curriculum_modules) and homepage teaser cards
-- (curriculum_preview). Turning a curriculum off hides both from the site.
CREATE TABLE public.curriculums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.curriculums TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.curriculums TO authenticated;
GRANT ALL ON public.curriculums TO service_role;
ALTER TABLE public.curriculums ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Curriculums are publicly viewable" ON public.curriculums FOR SELECT USING (true);
CREATE POLICY "Admins can manage curriculums" ON public.curriculums FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

INSERT INTO public.curriculums (title, sort_order) VALUES ('Become an AI Engineer', 0);

ALTER TABLE public.curriculum_modules ADD COLUMN curriculum_id UUID REFERENCES public.curriculums(id) ON DELETE CASCADE;
UPDATE public.curriculum_modules SET curriculum_id = (SELECT id FROM public.curriculums ORDER BY sort_order LIMIT 1);
ALTER TABLE public.curriculum_modules ALTER COLUMN curriculum_id SET NOT NULL;

ALTER TABLE public.curriculum_preview ADD COLUMN curriculum_id UUID REFERENCES public.curriculums(id) ON DELETE CASCADE;
UPDATE public.curriculum_preview SET curriculum_id = (SELECT id FROM public.curriculums ORDER BY sort_order LIMIT 1);
ALTER TABLE public.curriculum_preview ALTER COLUMN curriculum_id SET NOT NULL;

-- Programs: availability toggle, "coming soon" state, and a discount percentage
-- that admins can bulk-apply across selected programs.
ALTER TABLE public.services ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE public.services ADD COLUMN is_coming_soon BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.services ADD COLUMN discount_percentage NUMERIC NOT NULL DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100);
