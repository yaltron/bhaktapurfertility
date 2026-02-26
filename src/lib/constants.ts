export const CLINIC = {
  name: "Bhaktapur Fertility and Women Wellness Centre",
  shortName: "Bhaktapur Fertility Centre",
  tagline: "अनेक बाधाका बीच देखेको सपना, आफ्नै सन्तान खेलाउने काखमा ।",
  address: "Ground Floor, German Homes Building, Gatthaghar, Bhaktapur, Nepal",
  phones: ["+977-9761434655", "01-5912281"],
  whatsapp: "+9779761434655",
  email: "info@bhaktapurfertility.com.np",
  workingHours: "10:00 AM – 5:00 PM",
  workingDays: "Sunday – Friday",
  mapEmbedUrl:
    "https://www.google.com/maps?q=Bhaktapur+Fertility+%26+Women+Wellness+Center,+Gatthaghar,+Bhaktapur&output=embed",
  mapLink: "https://maps.app.goo.gl/cdR4oLzEnqpqhFHG7",
} as const;

export interface ServiceItem {
  title: string;
  shortName: string;
  slug: string;
  description: string;
  icon: string;
}

export const SERVICES: ServiceItem[] = [
  {
    title: "IVF & Infertility Treatment",
    shortName: "IVF",
    slug: "ivf",
    description:
      "In Vitro Fertilization (IVF) is an advanced assisted reproductive technology where eggs are fertilized with sperm outside the body. Our state-of-the-art laboratory and experienced team offer hope to couples facing complex fertility challenges.",
    icon: "Microscope",
  },
  {
    title: "Menopause Care",
    shortName: "Menopause",
    slug: "menopause",
    description:
      "Comprehensive menopause management including hormone therapy, lifestyle guidance, and symptom relief to help women navigate this natural transition with comfort and confidence.",
    icon: "Flower2",
  },
  {
    title: "Menstruation & PCOS",
    shortName: "Menstruation & PCOS",
    slug: "menstruation-pcos",
    description:
      "Expert diagnosis and treatment for menstrual disorders and Polycystic Ovary Syndrome (PCOS), including hormonal management, lifestyle modifications, and fertility support.",
    icon: "HeartPulse",
  },
  {
    title: "Ultrasound",
    shortName: "Ultrasound",
    slug: "ultrasound",
    description:
      "Advanced diagnostic ultrasound services for fertility monitoring, pregnancy care, and gynecological assessments using modern imaging technology.",
    icon: "Monitor",
  },
  {
    title: "Egg Freezing",
    shortName: "Egg Freezing",
    slug: "egg-freezing",
    description:
      "Preserve your fertility for the future with our egg freezing (oocyte cryopreservation) service. Ideal for women who wish to delay pregnancy for medical or personal reasons.",
    icon: "Snowflake",
  },
  {
    title: "Semen Freezing",
    shortName: "Semen Freezing",
    slug: "semen-freezing",
    description:
      "Sperm cryopreservation service to safeguard male reproductive potential for future use, whether for medical treatment, fertility planning, or personal choice.",
    icon: "Thermometer",
  },
  {
    title: "Hormone Testing",
    shortName: "Hormone Testing",
    slug: "hormone-testing",
    description:
      "Comprehensive hormonal evaluation to assess reproductive health, diagnose fertility issues, and guide personalized treatment plans for both men and women.",
    icon: "TestTubes",
  },
  {
    title: "Other Fertility & Women Wellness Services",
    shortName: "Other Services",
    slug: "other-services",
    description:
      "A full range of additional reproductive and women's health services including IUI, ovulation induction, semen analysis, PGT, and general gynecological care.",
    icon: "Stethoscope",
  },
];

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Our Doctors", href: "/doctors" },
  { label: "Success Stories", href: "/success-stories" },
  { label: "Insights", href: "/insights" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
] as const;
