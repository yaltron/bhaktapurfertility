import { Layout } from "@/components/layout/Layout";
import { Heart, Eye, Target, Building, Award, Handshake } from "lucide-react";
import { CLINIC } from "@/lib/constants";

const VALUES = [
  { icon: Heart, title: "Compassion", desc: "We treat every patient with empathy, dignity, and genuine care." },
  { icon: Award, title: "Excellence", desc: "We pursue the highest standards in fertility treatment and outcomes." },
  { icon: Handshake, title: "Integrity", desc: "We maintain transparency and honesty in every interaction." },
];

const FACILITIES = [
  "State-of-the-art IVF Laboratory",
  "Modern Ultrasound & Imaging Suite",
  "Comfortable Consultation Rooms",
  "Dedicated Procedure Rooms",
  "Cryopreservation Facility",
  "Patient Counseling Area",
];

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">About Us</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {CLINIC.name} is a leading fertility and women&apos;s wellness center located in {CLINIC.address}. We are dedicated to helping families achieve their dream of parenthood through advanced reproductive technologies and compassionate care.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="flex gap-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold mb-3">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To provide accessible, high-quality fertility care to every individual and couple in Nepal, utilizing cutting-edge reproductive technologies while maintaining the highest ethical standards and offering personalized treatment plans.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Eye className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold mb-3">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To be recognized as the premier fertility and women&apos;s wellness center in Nepal, known for our exceptional success rates, patient-centered approach, and unwavering commitment to bringing the joy of parenthood to every family.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container">
          <h2 className="text-3xl font-display font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {VALUES.map((v) => (
              <div key={v.title} className="text-center">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facility */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Building className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-3xl font-display font-bold mb-4">Our Facility</h2>
            <p className="text-muted-foreground mb-8">
              Our center is equipped with modern infrastructure designed to provide the best possible experience and outcomes for our patients.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 text-left">
              {FACILITIES.map((f) => (
                <div key={f} className="flex items-center gap-2 p-3 rounded-lg bg-secondary text-sm">
                  <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
