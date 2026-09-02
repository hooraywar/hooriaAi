-- The three course programs now have their own dedicated page files
-- (rather than sharing the generic /curriculum/$slug template). Point
-- their cards directly at those pages via link_url, which the site
-- already prioritizes over curriculum_id when set. Webinar and mentoring
-- cards are untouched.
UPDATE public.services SET link_url = '/curriculum/foundation'
WHERE id = '51cbe9cb-373b-48ec-be22-23f78ff547b5'; -- "AI Foundations + Prompt Engineering"

UPDATE public.services SET link_url = '/curriculum/ai-app-development-with-rag-agents'
WHERE id = 'b007619b-0127-47c8-a655-e72f869bb90d'; -- "AI App Development with RAG & Agents"

UPDATE public.services SET link_url = '/curriculum/become-an-ai-engineer'
WHERE id = '0f7d7aaf-4273-406b-9b31-b18472eee2b4'; -- "Become an AI Engineer Bootcamp"
