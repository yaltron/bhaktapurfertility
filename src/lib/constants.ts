export const CLINIC = {
  name: "Bhaktapur Fertility & Women Wellness Center",
  shortName: "Bhaktapur Fertility Center",
  tagline: "Your Journey to Parenthood Starts Here",
  address: "Ayu Bhawan, Gatthaghar, Bhaktapur",
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
    title: "In Vitro Fertilization (IVF)",
    shortName: "IVF",
    slug: "ivf",
    description:
      "IVF is an advanced assisted reproductive technology where eggs are fertilized with sperm outside the body in a laboratory. The resulting embryos are then transferred to the uterus, offering hope to couples facing complex fertility challenges.",
    icon: "🔬",
  },
  {
    title: "Intracytoplasmic Sperm Injection (ICSI)",
    shortName: "ICSI",
    slug: "icsi",
    description:
      "ICSI involves directly injecting a single sperm into the center of an egg to achieve fertilization. This technique is especially beneficial for male factor infertility and cases where conventional IVF has not succeeded.",
    icon: "💉",
  },
  {
    title: "Percutaneous Epididymal Sperm Aspiration (PESA)",
    shortName: "PESA",
    slug: "pesa",
    description:
      "PESA is a minimally invasive procedure used to retrieve sperm directly from the epididymis using a fine needle. It is ideal for men with obstructive azoospermia who cannot produce sperm through ejaculation.",
    icon: "🩺",
  },
  {
    title: "Testicular Sperm Aspiration (TESA)",
    shortName: "TESA",
    slug: "tesa",
    description:
      "TESA extracts sperm directly from testicular tissue using a needle aspiration technique. It is commonly used when sperm cannot be obtained from the epididymis or through ejaculation.",
    icon: "🔍",
  },
  {
    title: "Testicular Sperm Extraction (TESE)",
    shortName: "TESE",
    slug: "tese",
    description:
      "TESE is a surgical procedure to extract sperm from testicular tissue through a small biopsy. It is recommended for men with non-obstructive azoospermia where other retrieval methods are not feasible.",
    icon: "⚕️",
  },
  {
    title: "Preimplantation Genetic Testing (PGT)",
    shortName: "PGT",
    slug: "pgt",
    description:
      "PGT involves screening embryos for genetic abnormalities before they are implanted during an IVF cycle. This helps identify healthy embryos, improving pregnancy success rates and reducing the risk of genetic disorders.",
    icon: "🧬",
  },
  {
    title: "Fertility Preservation",
    shortName: "Fertility Preservation",
    slug: "fertility-preservation",
    description:
      "Fertility preservation includes techniques like egg freezing, sperm freezing, and embryo cryopreservation to safeguard reproductive potential for the future, whether for medical or personal reasons.",
    icon: "❄️",
  },
  {
    title: "Intrauterine Insemination (IUI)",
    shortName: "IUI",
    slug: "iui",
    description:
      "IUI is a fertility treatment where prepared, concentrated sperm is placed directly into the uterus around the time of ovulation. It is a less invasive and more affordable first-line treatment option.",
    icon: "🌱",
  },
  {
    title: "Ovulation Induction",
    shortName: "Ovulation Induction",
    slug: "ovulation-induction",
    description:
      "Ovulation induction uses medications to stimulate the ovaries to produce and release eggs. It is often the first step in fertility treatment for women with irregular or absent ovulation.",
    icon: "💊",
  },
  {
    title: "Semen Analysis",
    shortName: "Semen Analysis",
    slug: "semen-analysis",
    description:
      "Semen analysis is a diagnostic test that evaluates the health and viability of sperm, including count, motility, and morphology. It is a fundamental step in assessing male fertility.",
    icon: "🔎",
  },
];

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Our Doctors", href: "/doctors" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
] as const;
