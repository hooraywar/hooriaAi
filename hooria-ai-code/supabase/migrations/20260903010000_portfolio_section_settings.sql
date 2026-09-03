-- Editable heading/subheading + on/off visibility for the homepage
-- "What You'll Ship" portfolio section, mirroring curriculum_preview_settings.
CREATE TABLE public.portfolio_section_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  eyebrow TEXT NOT NULL DEFAULT 'What You''ll Ship',
  heading TEXT NOT NULL DEFAULT '6 portfolio projects that get you hired',
  subheading TEXT NOT NULL DEFAULT 'These aren''t tutorials. You''ll deploy real code, on real infrastructure, with your name on it.',
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.portfolio_section_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.portfolio_section_settings TO authenticated;
GRANT ALL ON public.portfolio_section_settings TO service_role;
ALTER TABLE public.portfolio_section_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Portfolio section settings are publicly viewable" ON public.portfolio_section_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage portfolio section settings" ON public.portfolio_section_settings FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

INSERT INTO public.portfolio_section_settings (eyebrow, heading, subheading, is_visible)
VALUES (
  'What You''ll Ship',
  '6 portfolio projects that get you hired',
  'These aren''t tutorials. You''ll deploy real code, on real infrastructure, with your name on it.',
  true
);
