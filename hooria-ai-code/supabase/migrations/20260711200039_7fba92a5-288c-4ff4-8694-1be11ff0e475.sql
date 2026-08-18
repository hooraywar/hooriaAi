
DROP POLICY "Anyone can submit a webinar signup" ON public.webinar_signups;
CREATE POLICY "Anyone can submit a valid webinar signup"
  ON public.webinar_signups FOR INSERT
  WITH CHECK (
    char_length(name) BETWEEN 1 AND 120
    AND char_length(email) BETWEEN 3 AND 200
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND char_length(whatsapp) BETWEEN 5 AND 40
    AND char_length(university) BETWEEN 1 AND 200
  );
