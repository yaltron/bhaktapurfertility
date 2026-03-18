
CREATE TABLE public.popup_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image_url text NOT NULL,
  display_seconds integer NOT NULL DEFAULT 5,
  is_active boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.popup_banners ENABLE ROW LEVEL SECURITY;

-- Public can view active banners
CREATE POLICY "Anyone can view active banners"
  ON public.popup_banners FOR SELECT
  TO public
  USING (is_active = true);

-- Admins can select all banners
CREATE POLICY "Admins can select all banners"
  ON public.popup_banners FOR SELECT
  TO public
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin CRUD
CREATE POLICY "Admins can insert banners"
  ON public.popup_banners FOR INSERT
  TO public
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update banners"
  ON public.popup_banners FOR UPDATE
  TO public
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete banners"
  ON public.popup_banners FOR DELETE
  TO public
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Auto-update updated_at
CREATE TRIGGER update_popup_banners_updated_at
  BEFORE UPDATE ON public.popup_banners
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
