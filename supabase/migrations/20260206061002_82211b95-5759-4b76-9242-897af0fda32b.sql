
-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create enum for blog status
CREATE TYPE public.blog_status AS ENUM ('draft', 'published');

-- ============ DOCTORS TABLE ============
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT,
  full_name TEXT NOT NULL,
  position TEXT NOT NULL,
  experience TEXT,
  description TEXT,
  email TEXT,
  phone TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

-- Public read access for doctors
CREATE POLICY "Anyone can view doctors"
  ON public.doctors FOR SELECT
  USING (true);

-- ============ BLOGS TABLE ============
CREATE TABLE public.blogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  cover_image_url TEXT,
  category TEXT,
  excerpt TEXT,
  content TEXT,
  author TEXT NOT NULL DEFAULT 'Admin',
  publish_date DATE DEFAULT CURRENT_DATE,
  status public.blog_status NOT NULL DEFAULT 'draft',
  reading_time INT DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Public read access for published blogs only
CREATE POLICY "Anyone can view published blogs"
  ON public.blogs FOR SELECT
  USING (status = 'published');

-- ============ APPOINTMENT REQUESTS TABLE ============
CREATE TABLE public.appointment_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  preferred_date DATE,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.appointment_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can insert appointment requests (public form)
CREATE POLICY "Anyone can submit appointment requests"
  ON public.appointment_requests FOR INSERT
  WITH CHECK (true);

-- ============ CONTACT MESSAGES TABLE ============
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can insert contact messages (public form)
CREATE POLICY "Anyone can submit contact messages"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

-- ============ USER ROLES TABLE ============
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Users can read their own roles
CREATE POLICY "Users can read own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- ============ SECURITY DEFINER FUNCTION ============
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- ============ ADMIN POLICIES ============
-- Admins can manage doctors
CREATE POLICY "Admins can insert doctors"
  ON public.doctors FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update doctors"
  ON public.doctors FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete doctors"
  ON public.doctors FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can manage blogs (full access including drafts)
CREATE POLICY "Admins can select all blogs"
  ON public.blogs FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert blogs"
  ON public.blogs FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update blogs"
  ON public.blogs FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete blogs"
  ON public.blogs FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can read appointment requests
CREATE POLICY "Admins can view appointment requests"
  ON public.appointment_requests FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can read contact messages
CREATE POLICY "Admins can view contact messages"
  ON public.contact_messages FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============ UPDATED_AT TRIGGER ============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_doctors_updated_at
  BEFORE UPDATE ON public.doctors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blogs_updated_at
  BEFORE UPDATE ON public.blogs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ STORAGE BUCKETS ============
INSERT INTO storage.buckets (id, name, public) VALUES ('clinic-images', 'clinic-images', true);

-- Storage policies for clinic-images bucket
CREATE POLICY "Public can view clinic images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'clinic-images');

CREATE POLICY "Admins can upload clinic images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'clinic-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update clinic images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'clinic-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete clinic images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'clinic-images' AND public.has_role(auth.uid(), 'admin'));
