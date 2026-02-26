import { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, ArrowRight, Users, BookOpen, MessageCircle, MapPin, Microscope, Flower2, HeartPulse, Monitor, Snowflake, Thermometer, TestTubes, Stethoscope } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AppointmentModal } from "@/components/AppointmentModal";
import { CLINIC, SERVICES } from "@/lib/constants";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const SERVICE_ICONS: Record<string, React.ElementType> = {
  Microscope, Flower2, HeartPulse, Monitor, Snowflake, Thermometer, TestTubes, Stethoscope,
};

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

  const { data: stories } = useQuery({
    queryKey: ["success-stories-preview"],
    queryFn: async () => {
      const { data } = await supabase
        .from("success_stories")
        .select("*")
        .order("display_order")
        .limit(6);
      return data ?? [];
    },
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(110,35%,45%)_0%,transparent_60%)] opacity-30" />
        <div className="container relative py-20 md:py-32 lg:py-40">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-nepali font-bold leading-tight mb-6">
              {CLINIC.tagline}
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/85 mb-8 max-w-lg leading-relaxed">
              Advanced fertility treatments with compassionate care at {CLINIC.name}.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" variant="secondary" onClick={() => setAppointmentOpen(true)} className="font-semibold">
                Book Appointment
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20" asChild>
                <a href={`tel:${CLINIC.phones[0]}`}>
                  <Phone className="h-4 w-4 mr-2" /> Call Now
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20" asChild>
                <a href={`https://wa.me/${CLINIC.whatsapp}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">Our Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive fertility and women's wellness services tailored to your needs.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {SERVICES.map((s) => {
              const Icon = SERVICE_ICONS[s.icon] || Stethoscope;
              return (
                <Link key={s.slug} to={`/services/${s.slug}`}>
                  <Card className="group hover:shadow-md transition-all hover:border-primary/30 h-full">
                    <CardContent className="p-5 text-center flex flex-col items-center">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-sm">{s.shortName}</h3>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/services">View All Services <ArrowRight className="h-4 w-4 ml-1" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">Success Stories</h2>
            <p className="text-muted-foreground">Real stories from families we've helped.</p>
          </div>
          {stories && stories.length > 0 ? (
            <Carousel opts={{ align: "start", loop: true }} className="max-w-5xl mx-auto">
              <CarouselContent>
                {stories.map((story) => (
                  <CarouselItem key={story.id} className="md:basis-1/2 lg:basis-1/3">
                    <Card className="overflow-hidden h-full">
                      <div className="aspect-video bg-muted flex items-center justify-center">
                        {story.photo_url ? (
                          <img src={story.photo_url} alt={story.title} className="w-full h-full object-cover" />
                        ) : (
                          <Users className="h-10 w-10 text-muted-foreground/20" />
                        )}
                      </div>
                      <CardContent className="p-5">
                        <h3 className="font-semibold mb-2 line-clamp-1">{story.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">{story.description}</p>
                        <Link to="/success-stories" className="text-sm text-primary font-medium mt-3 inline-block hover:underline">
                          Read More →
                        </Link>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">Success stories coming soon.</p>
            </div>
          )}
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/success-stories">View All Stories <ArrowRight className="h-4 w-4 ml-1" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">About Our Centre</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              <strong>{CLINIC.name}</strong> is dedicated to compassionate, advanced fertility and women's health care in Bhaktapur. 
              Our team of experienced specialists uses cutting-edge technology to help families achieve their dream of parenthood.
            </p>
            <Button asChild>
              <Link to="/about">About Us <ArrowRight className="h-4 w-4 ml-1" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Doctors Preview */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">Our Specialists</h2>
            <p className="text-muted-foreground">Meet our experienced fertility experts.</p>
          </div>
          {doctors && doctors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {doctors.map((doc) => (
                <Link key={doc.id} to={`/doctors/${doc.id}`}>
                  <Card className="overflow-hidden hover:shadow-md transition-shadow">
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
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">Our specialist profiles are coming soon.</p>
            </div>
          )}
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/doctors">View All Doctors <ArrowRight className="h-4 w-4 ml-1" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">Latest Insights</h2>
            <p className="text-muted-foreground">Helpful articles on fertility and women's health.</p>
          </div>
          {blogs && blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogs.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-muted">
                    {post.cover_image_url ? (
                      <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="h-10 w-10 text-muted-foreground/20" />
                      </div>
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
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">Articles coming soon. Stay tuned!</p>
            </div>
          )}
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/insights">All Articles <ArrowRight className="h-4 w-4 ml-1" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact & Address Strip */}
      <section className="py-12 bg-primary text-white">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-display font-bold mb-2">Ready to Start Your Journey?</h2>
              <div className="flex items-start gap-2 text-primary-foreground/80">
                <MapPin className="h-4 w-4 mt-1 shrink-0" />
                <span>{CLINIC.address}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" size="lg" onClick={() => setAppointmentOpen(true)}>
                Book Appointment
              </Button>
              <Button variant="outline" size="lg" className="border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20" asChild>
                <a href={`tel:${CLINIC.phones[0]}`}>
                  <Phone className="h-4 w-4 mr-2" /> {CLINIC.phones[0]}
                </a>
              </Button>
              <Button variant="outline" size="lg" className="border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20" asChild>
                <a href={`https://wa.me/${CLINIC.whatsapp}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp
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
