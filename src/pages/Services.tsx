import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CLINIC } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Phone, Microscope, Flower2, HeartPulse, Monitor, Snowflake, Thermometer, TestTubes, Stethoscope, MessageCircle } from "lucide-react";
import { AppointmentModal } from "@/components/AppointmentModal";
import { SEO } from "@/components/SEO";

const SERVICE_ICONS: Record<string, React.ElementType> = {
  Microscope, Flower2, HeartPulse, Monitor, Snowflake, Thermometer, TestTubes, Stethoscope,
};

const Services = () => {
  const [appointmentOpen, setAppointmentOpen] = useState(false);

  const { data: services, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data ?? [];
    },
  });

  const coreServices = services?.filter((s) => s.category === "core") ?? [];
  const otherServices = services?.filter((s) => s.category === "other") ?? [];

  return (
    <Layout>
      <SEO
        title="Fertility Treatment & Women's Health Services in Bhaktapur"
        description={`IVF and IUI services in Nepal. Comprehensive fertility treatment in Bhaktapur and women's reproductive health care at ${CLINIC.name}.`}
      />

      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">
                Our Services
              </h1>
              <p className="text-lg text-primary-foreground/80 leading-relaxed">
                Comprehensive fertility treatments and women's reproductive health care at {CLINIC.name}, Bhaktapur.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="self-start md:self-auto border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
            >
              <a href={`tel:${CLINIC.phones[0]}`}>
                <Phone className="h-4 w-4 mr-2" /> Call Now
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Core Services */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
              Fertility & Women's Health Services
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Expert fertility treatment in Bhaktapur — from evaluation to advanced IVF and IUI services in Nepal.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading services...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {coreServices.map((service) => {
                const Icon = SERVICE_ICONS[service.icon] || Stethoscope;
                return (
                  <Card
                    key={service.id}
                    className="group hover:shadow-lg hover:scale-[1.02] transition-all duration-300 h-full border-border/50"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1">{service.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                            {service.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Link to={`/services/${service.slug}`}>
                              <Button variant="ghost" size="sm" className="text-primary">
                                Learn More <ArrowRight className="h-4 w-4 ml-1" />
                              </Button>
                            </Link>
                            <Button variant="outline" size="sm" onClick={() => setAppointmentOpen(true)}>
                              Book Consultation
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Other Services */}
      {otherServices.length > 0 && (
        <section className="py-16 md:py-24 bg-primary/5">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
                Other Services
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Additional women's reproductive health care and wellness services.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {otherServices.map((service) => {
                const Icon = SERVICE_ICONS[service.icon] || Stethoscope;
                return (
                  <Card
                    key={service.id}
                    className="group hover:shadow-lg hover:scale-[1.02] transition-all duration-300 h-full bg-background"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-accent/60 flex items-center justify-center flex-shrink-0 group-hover:bg-accent transition-colors">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1">{service.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                            {service.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Link to={`/services/${service.slug}`}>
                              <Button variant="ghost" size="sm" className="text-primary">
                                Learn More <ArrowRight className="h-4 w-4 ml-1" />
                              </Button>
                            </Link>
                            <Button variant="outline" size="sm" onClick={() => setAppointmentOpen(true)}>
                              Book Consultation
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="py-16 md:py-20 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-2xl md:text-4xl font-display font-bold mb-4">
            Start Your Fertility Journey Today
          </h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8 text-lg">
            Take the first step towards parenthood. Our experienced specialists are here to guide you every step of the way.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="secondary" size="lg" onClick={() => setAppointmentOpen(true)}>
              Book Appointment
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
              asChild
            >
              <a href={`tel:${CLINIC.phones[0]}`}>
                <Phone className="h-4 w-4 mr-2" /> Call Now
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
              asChild
            >
              <a href={`https://wa.me/${CLINIC.whatsapp}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>

      <AppointmentModal open={appointmentOpen} onOpenChange={setAppointmentOpen} />
    </Layout>
  );
};

export default Services;
