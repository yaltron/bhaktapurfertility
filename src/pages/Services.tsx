import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SERVICES } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

const Services = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <Layout>
      <section className="bg-secondary py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">Our Services</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We offer a comprehensive range of fertility treatments and reproductive health services to help you on your journey to parenthood.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {SERVICES.map((service) => {
              const isOpen = expanded === service.shortName;
              return (
                <Card key={service.shortName} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl flex-shrink-0">{service.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1">{service.title}</h3>
                        <p className={`text-sm text-muted-foreground leading-relaxed ${isOpen ? "" : "line-clamp-2"}`}>
                          {service.description}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 text-primary px-0 h-auto font-medium"
                          onClick={() => setExpanded(isOpen ? null : service.shortName)}
                        >
                          {isOpen ? (
                            <>Show Less <ChevronUp className="h-4 w-4 ml-1" /></>
                          ) : (
                            <>Learn More <ChevronDown className="h-4 w-4 ml-1" /></>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
