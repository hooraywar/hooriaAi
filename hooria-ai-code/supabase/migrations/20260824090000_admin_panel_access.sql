-- The has_role() function's EXECUTE was revoked from `authenticated` in a
-- prior migration, so any RLS policy that calls has_role() cannot actually
-- be satisfied by a real logged-in user (only service_role can invoke it).
-- Replace the webinar_signups admin-read policy with an inline check
-- against user_roles instead, which is already readable via the
-- "Users can view their own roles" policy.
DROP POLICY "Admins can view webinar signups" ON public.webinar_signups;
CREATE POLICY "Admins can view webinar signups"
ON public.webinar_signups FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Let admins manage site content (services/programs) from the admin panel.
GRANT INSERT, UPDATE, DELETE ON public.services TO authenticated;
CREATE POLICY "Admins can manage services"
ON public.services FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Let admins manage FAQs from the admin panel.
GRANT INSERT, UPDATE, DELETE ON public.faqs TO authenticated;
CREATE POLICY "Admins can manage faqs"
ON public.faqs FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
