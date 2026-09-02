-- The public mentoring signup section was removed from the homepage.
-- The mentoring card stays Coming Soon (already set) and no longer needs
-- to link to the now-deleted #mentoring-signup anchor.
UPDATE public.services SET link_url = NULL
WHERE id = '705ae8cf-0ad5-49d9-a05f-0cae0a0761ae'; -- "Career Mentoring & Interview Prep"
