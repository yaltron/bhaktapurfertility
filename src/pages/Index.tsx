import { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, ArrowRight, Shield, Heart, Users, Award, Clock, Stethoscope } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AppointmentModal } from "@/components/AppointmentModal";
import { CLINIC, SERVICES } from "@/lib/constants";

const WHY_CHOOSE = [
  { icon: Shield, title: "Advanced Technology", desc: "State-of-the-art fertility lab with latest reproductive technologies." },
  { icon: Heart, title: "Compassionate Care", desc: "Personalized treatment plans with emotional and psychological support." },
  { icon: Users, title: "Expert Team", desc: "Experienced fertility specialists and embryologists dedicated to your success." },
  { icon: Award, title: "High Success Rates", desc: "Proven track record of successful pregnancies and healthy babies." },
  { icon: Clock, title: "Timely Treatment", desc: "Prompt consultations and treatment schedules respecting your time." },
  { icon: Stethoscope, title: "Comprehensive Services", desc: "Full range of fertility and women's wellness services under one roof." },
];

const Index = () => {
  const [appointmentOpen, setAppointmentOpen] = useState(false);

  const { data: doctors } = useQuery({
    queryKey: ["doctors-preview"],
    queryFn: async () => {
      const { data } = await supabase
        .from("doctors")
        .select("id, full_name, position, image_url")
        .order("display_order")
        .limit(3);
      return data ?? [];
    },
  });

  const { data: blogs } = useQuery({
    queryKey: ["blogs-preview"],
    queryFn: async () => {
      const { data } = await supabase
        .from("blogs")
        .select("id, title, slug, excerpt, cover_image_url, publish_date, reading_time")
        .eq("status", "published")
        .order("publish_date", { ascending: false })
        .limit(3);
      return data ?? [];
    },
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(176,73%,38%)_0%,transparent_60%)] opacity-40" />
        <div className="container relative py-20 md:py-32 lg:py-40">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
              {CLINIC.tagline}
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/85 mb-8 max-w-lg leading-relaxed">
              Advanced fertility treatments with compassionate care at {CLINIC.shortName}, {CLINIC.address}.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => setAppointmentOpen(true)}
                className="font-semibold"
              >
                Book Appointment
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <a href={`tel:${CLINIC.phones[0]}`}>
                  <Phone className="h-4 w-4 mr-2" /> Call Now
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Highlight */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">Our Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive fertility and reproductive health services tailored to your needs.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {SERVICES.slice(0, 5).map((s) => (
              <Card key={s.shortName} className="group hover:shadow-md transition-shadow border-border/60">
                <CardContent className="p-5 text-center">
                  <div className="text-3xl mb-3">{s.icon}</div>
                  <h3 className="font-semibold text-sm mb-1">{s.shortName}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{s.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/services">
                View All Services <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">Why Choose Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Trusted by families across Nepal for quality fertility care.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_CHOOSE.map((item) => (
              <div key={item.title} className="flex gap-4 p-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Preview */}
      {doctors && doctors.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">Our Specialists</h2>
              <p className="text-muted-foreground">Meet our experienced fertility experts.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {doctors.map((doc) => (
                <Card key={doc.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-[3/4] bg-muted flex items-center justify-center">
                    {doc.image_url ? (
                      <img src={doc.image_url} alt={doc.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="h-16 w-16 text-muted-foreground/30" />
                    )}
                  </div>
                  <CardContent className="p-4 text-center">
                    <h3 className="font-semibold">{doc.full_name}</h3>
                    <p className="text-sm text-muted-foreground">{doc.position}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button variant="outline" asChild>
                <Link to="/doctors">
                  View All Doctors <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Blog Preview */}
      {blogs && blogs.length > 0 && (
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">Latest Insights</h2>
              <p className="text-muted-foreground">Helpful articles on fertility and women&apos;s health.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogs.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-muted">
                    {post.cover_image_url && (
                      <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <span>{post.publish_date}</span>
                      <span>·</span>
                      <span>{post.reading_time} min read</span>
                    </div>
                    <h3 className="font-semibold mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    <Link to={`/insights/${post.slug}`} className="text-sm text-primary font-medium mt-3 inline-block hover:underline">
                      Read More →
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button variant="outline" asChild>
                <Link to="/insights">All Articles <ArrowRight className="h-4 w-4 ml-1" /></Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Contact Strip */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-display font-bold mb-1">Ready to Start Your Journey?</h2>
              <p className="text-primary-foreground/80">Contact us today for a consultation.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" size="lg" onClick={() => setAppointmentOpen(true)}>
                Book Appointment
              </Button>
              <Button variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <a href={`tel:${CLINIC.phones[0]}`}>
                  <Phone className="h-4 w-4 mr-2" /> {CLINIC.phones[0]}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <AppointmentModal open={appointmentOpen} onOpenChange={setAppointmentOpen} />
    </Layout>
  );
};

export default Index;
