
-- Create success_stories table
CREATE TABLE public.success_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  photo_url text,
  video_url text,
  is_featured boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view success stories" ON public.success_stories FOR SELECT USING (true);
CREATE POLICY "Admins can insert success stories" ON public.success_stories FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update success stories" ON public.success_stories FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete success stories" ON public.success_stories FOR DELETE USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Create faqs table
CREATE TABLE public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view faqs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Admins can insert faqs" ON public.faqs FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update faqs" ON public.faqs FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete faqs" ON public.faqs FOR DELETE USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Add columns to doctors table
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS qualification text;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS nmc_number text;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS short_bio text;
