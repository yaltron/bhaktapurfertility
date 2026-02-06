import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CLINIC, SERVICES } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Phone } from "lucide-react";

const Services = () => {
  return (
    <Layout>
      <section className="bg-secondary py-16 md:py-24">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">Our Services</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We offer a comprehensive range of fertility treatments and reproductive health services to help you on your journey to parenthood.
              </p>
            </div>
            <Button asChild className="self-start md:self-auto">
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
            {SERVICES.map((service) => (
              <Link key={service.slug} to={`/services/${service.slug}`}>
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl flex-shrink-0">{service.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1">{service.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                          {service.description}
                        </p>
                        <span className="mt-2 text-primary text-sm font-medium inline-flex items-center gap-1">
                          Learn More <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
