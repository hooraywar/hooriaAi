-- Link the three course-style programs to their matching curriculum pages.
-- Existing curriculum content is left untouched — this only sets the FK.
UPDATE public.services
SET curriculum_id = 'f05da5ff-16dc-405c-bd8a-1ebb35b7ea90' -- "Become an AI Engineer"
WHERE id = '0f7d7aaf-4273-406b-9b31-b18472eee2b4'; -- "Become an AI Engineer Bootcamp"

UPDATE public.services
SET curriculum_id = 'ed33d91a-f37b-49c8-b5d0-25f1fd943cd0' -- "AI App Development with RAG & Agents"
WHERE id = 'b007619b-0127-47c8-a655-e72f869bb90d'; -- "AI App Development with RAG & Agents"

UPDATE public.services
SET curriculum_id = '2f7b8b6b-108c-40b8-8436-0d46f3596cbe' -- "Foundation "
WHERE id = '51cbe9cb-373b-48ec-be22-23f78ff547b5'; -- "AI Foundations + Prompt Engineering"

-- The webinar and mentoring service aren't multi-week courses, so instead of
-- a curriculum page they get a registration form. A program can optionally
-- point its card at any URL/anchor instead of (or in addition to) a
-- curriculum — this takes priority over curriculum_id when set.
ALTER TABLE public.services ADD COLUMN link_url TEXT;

UPDATE public.services SET link_url = '#signup'
WHERE id = 'd68e4f2f-5012-422b-9d3b-17083e648fab'; -- "AI Career Kickstart Webinar"

UPDATE public.services SET link_url = '#mentoring-signup'
WHERE id = '705ae8cf-0ad5-49d9-a05f-0cae0a0761ae'; -- "Career Mentoring & Interview Prep"

-- Registration form submissions for the Career Mentoring & Interview Prep
-- program, mirroring webinar_signups.
CREATE TABLE public.mentoring_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  university TEXT NOT NULL,
  goal TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.mentoring_signups TO anon, authenticated;
GRANT SELECT ON public.mentoring_signups TO authenticated;
GRANT ALL ON public.mentoring_signups TO service_role;
ALTER TABLE public.mentoring_signups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a mentoring signup" ON public.mentoring_signups FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view mentoring signups" ON public.mentoring_signups FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
