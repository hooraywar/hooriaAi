-- Homepage curriculum preview grid (8 simple cards)
CREATE TABLE public.curriculum_preview (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.curriculum_preview TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.curriculum_preview TO authenticated;
GRANT ALL ON public.curriculum_preview TO service_role;
ALTER TABLE public.curriculum_preview ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Curriculum preview is publicly viewable" ON public.curriculum_preview FOR SELECT USING (true);
CREATE POLICY "Admins can manage curriculum preview" ON public.curriculum_preview FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Full /curriculum page: modules with nested sessions (each session has a
-- title and a list of bullet points), stored as JSONB since it's a variable
-- nested structure edited as a unit from the admin panel.
CREATE TABLE public.curriculum_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_number TEXT NOT NULL,
  weeks TEXT NOT NULL,
  title TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Sparkles',
  sessions JSONB NOT NULL DEFAULT '[]',
  deliverable TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.curriculum_modules TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.curriculum_modules TO authenticated;
GRANT ALL ON public.curriculum_modules TO service_role;
ALTER TABLE public.curriculum_modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Curriculum modules are publicly viewable" ON public.curriculum_modules FOR SELECT USING (true);
CREATE POLICY "Admins can manage curriculum modules" ON public.curriculum_modules FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Instructor profile: a single row. highlights/stats/stack are small
-- editable sub-lists stored as JSONB rather than separate join tables,
-- since they only ever belong to this one profile.
CREATE TABLE public.instructor (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT NOT NULL,
  image_url TEXT NOT NULL DEFAULT '',
  linkedin_url TEXT NOT NULL DEFAULT '',
  stack JSONB NOT NULL DEFAULT '[]',
  highlights JSONB NOT NULL DEFAULT '[]',
  stats JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.instructor TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.instructor TO authenticated;
GRANT ALL ON public.instructor TO service_role;
ALTER TABLE public.instructor ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Instructor profile is publicly viewable" ON public.instructor FOR SELECT USING (true);
CREATE POLICY "Admins can manage instructor profile" ON public.instructor FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Homepage "What You'll Ship" portfolio outcome cards
CREATE TABLE public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Sparkles',
  tag TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.portfolio_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.portfolio_items TO authenticated;
GRANT ALL ON public.portfolio_items TO service_role;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Portfolio items are publicly viewable" ON public.portfolio_items FOR SELECT USING (true);
CREATE POLICY "Admins can manage portfolio items" ON public.portfolio_items FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
