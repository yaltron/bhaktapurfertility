import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SERVICES, CLINIC } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Phone } from "lucide-react";
import { AppointmentModal } from "@/components/AppointmentModal";
import { useState } from "react";

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [appointmentOpen, setAppointmentOpen] = useState(false);

  const service = SERVICES.find((s) => s.slug === slug);
  const otherServices = SERVICES.filter((s) => s.slug !== slug);

  if (!service) {
    return (
      <Layout>
        <section className="py-20">
          <div className="container text-center">
            <h1 className="text-3xl font-display font-bold mb-4">Service Not Found</h1>
            <p className="text-muted-foreground mb-6">The service you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/services">View All Services</Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container">
          <Link
            to="/services"
            className="inline-flex items-center gap-1 text-primary-foreground/70 hover:text-primary-foreground text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Services
          </Link>
          <div className="flex items-start gap-4">
            <span className="text-5xl">{service.icon}</span>
            <div>
              <h1 className="text-3xl md:text-5xl font-display font-bold mb-3">
                {service.title}
              </h1>
              <p className="text-primary-foreground/80 text-lg max-w-2xl leading-relaxed">
                {service.description}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-8">
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
          </div>
        </div>
      </section>

      {/* Other Services */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-8">Other Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherServices.map((s) => (
              <Link key={s.slug} to={`/services/${s.slug}`}>
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{s.icon}</span>
                      <div>
                        <h3 className="font-semibold text-sm">{s.shortName}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {s.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <AppointmentModal open={appointmentOpen} onOpenChange={setAppointmentOpen} />
    </Layout>
  );
};

export default ServiceDetail;
