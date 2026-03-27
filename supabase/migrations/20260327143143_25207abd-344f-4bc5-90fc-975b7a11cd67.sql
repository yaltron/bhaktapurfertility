
-- Create services table
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  short_name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'Stethoscope',
  category text NOT NULL DEFAULT 'core',
  display_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Anyone can view services" ON public.services FOR SELECT TO public USING (true);

-- Admin CRUD
CREATE POLICY "Admins can insert services" ON public.services FOR INSERT TO public WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update services" ON public.services FOR UPDATE TO public USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete services" ON public.services FOR DELETE TO public USING (has_role(auth.uid(), 'admin'::app_role));

-- updated_at trigger
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed data: 6 core + 2 other
INSERT INTO public.services (title, short_name, slug, description, icon, category, display_order) VALUES
('Fertility Evaluation & Preconception Care', 'Fertility Evaluation', 'fertility-evaluation', 'Comprehensive fertility assessment and preconception planning to identify potential challenges and optimize your chances of conception.', 'HeartPulse', 'core', 1),
('Ovulation Induction', 'Ovulation Induction', 'ovulation-induction', 'Medically supervised ovulation stimulation using hormonal medications to enhance egg development and improve fertility outcomes.', 'Flower2', 'core', 2),
('IUI (Intrauterine Insemination)', 'IUI', 'iui', 'A minimally invasive fertility treatment where processed sperm is placed directly into the uterus to increase the chances of fertilization.', 'TestTubes', 'core', 3),
('IVF (In Vitro Fertilization)', 'IVF', 'ivf', 'Advanced assisted reproductive technology where eggs are fertilized with sperm outside the body in our state-of-the-art laboratory.', 'Microscope', 'core', 4),
('Gynecological Evaluation', 'Gynecological Evaluation', 'gynecological-evaluation', 'Thorough gynecological examinations including pelvic exams, Pap smears, and diagnostic imaging for comprehensive women''s health care.', 'Stethoscope', 'core', 5),
('Female Comprehensive Wellness Packages', 'Wellness Packages', 'wellness-packages', 'Tailored health screening packages designed for women at every stage of life, covering hormonal, reproductive, and general wellness.', 'Monitor', 'core', 6),
('Holistic Female Care', 'Holistic Care', 'holistic-female-care', 'Integrative approach to women''s health combining medical expertise with lifestyle guidance, nutrition counseling, and emotional support.', 'Snowflake', 'other', 7),
('Fertility to High-End Ultrasound Services', 'Ultrasound Services', 'ultrasound-services', 'Advanced diagnostic ultrasound services including 3D/4D imaging for fertility monitoring, pregnancy care, and gynecological assessments.', 'Thermometer', 'other', 8);
