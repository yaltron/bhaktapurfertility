CREATE TABLE public.clinic_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  description text,
  image_url text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.clinic_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view clinic photos" ON public.clinic_photos FOR SELECT TO public USING (true);
CREATE POLICY "Admins can insert clinic photos" ON public.clinic_photos FOR INSERT TO public WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update clinic photos" ON public.clinic_photos FOR UPDATE TO public USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete clinic photos" ON public.clinic_photos FOR DELETE TO public USING (has_role(auth.uid(), 'admin'::app_role));