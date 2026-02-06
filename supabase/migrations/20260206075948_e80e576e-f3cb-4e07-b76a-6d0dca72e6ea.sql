
-- Fix blog policies: change from RESTRICTIVE to PERMISSIVE so admins can see drafts
DROP POLICY IF EXISTS "Admins can select all blogs" ON public.blogs;
DROP POLICY IF EXISTS "Anyone can view published blogs" ON public.blogs;
DROP POLICY IF EXISTS "Admins can insert blogs" ON public.blogs;
DROP POLICY IF EXISTS "Admins can update blogs" ON public.blogs;
DROP POLICY IF EXISTS "Admins can delete blogs" ON public.blogs;

CREATE POLICY "Admins can select all blogs"
  ON public.blogs FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view published blogs"
  ON public.blogs FOR SELECT
  USING (status = 'published'::blog_status);

CREATE POLICY "Admins can insert blogs"
  ON public.blogs FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update blogs"
  ON public.blogs FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete blogs"
  ON public.blogs FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix doctor policies: change from RESTRICTIVE to PERMISSIVE
DROP POLICY IF EXISTS "Anyone can view doctors" ON public.doctors;
DROP POLICY IF EXISTS "Admins can insert doctors" ON public.doctors;
DROP POLICY IF EXISTS "Admins can update doctors" ON public.doctors;
DROP POLICY IF EXISTS "Admins can delete doctors" ON public.doctors;

CREATE POLICY "Anyone can view doctors"
  ON public.doctors FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert doctors"
  ON public.doctors FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update doctors"
  ON public.doctors FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete doctors"
  ON public.doctors FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix appointment_requests policies
DROP POLICY IF EXISTS "Admins can view appointment requests" ON public.appointment_requests;
DROP POLICY IF EXISTS "Anyone can submit appointment requests" ON public.appointment_requests;

CREATE POLICY "Admins can view appointment requests"
  ON public.appointment_requests FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can submit appointment requests"
  ON public.appointment_requests FOR INSERT
  WITH CHECK (true);

-- Fix contact_messages policies
DROP POLICY IF EXISTS "Admins can view contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;

CREATE POLICY "Admins can view contact messages"
  ON public.contact_messages FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can submit contact messages"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

-- Fix user_roles policies
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;

CREATE POLICY "Users can read own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);
