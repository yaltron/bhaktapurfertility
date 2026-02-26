import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CLINIC, SERVICES } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Phone, Microscope, Flower2, HeartPulse, Monitor, Snowflake, Thermometer, TestTubes, Stethoscope } from "lucide-react";
import { AppointmentModal } from "@/components/AppointmentModal";

const SERVICE_ICONS: Record<string, React.ElementType> = {
  Microscope, Flower2, HeartPulse, Monitor, Snowflake, Thermometer, TestTubes, Stethoscope,
};

const Services = () => {
  const [appointmentOpen, setAppointmentOpen] = useState(false);

  return (
    <Layout>
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">Our Services</h1>
              <p className="text-lg text-primary-foreground/80 leading-relaxed">
                We offer a comprehensive range of fertility treatments and women's wellness services at {CLINIC.name}.
              </p>
            </div>
            <Button asChild size="lg" variant="outline" className="self-start md:self-auto border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20">
              <a href={`tel:${CLINIC.phones[0]}`}>
                <Phone className="h-4 w-4 mr-2" /> Call Now
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {SERVICES.map((service) => {
              const Icon = SERVICE_ICONS[service.icon] || Stethoscope;
              return (
                <Card key={service.slug} className="hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
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
                            Book Appointment
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

      <AppointmentModal open={appointmentOpen} onOpenChange={setAppointmentOpen} />
    </Layout>
  );
};

export default Services;
