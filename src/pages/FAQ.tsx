import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HelpCircle, Phone } from "lucide-react";
import { CLINIC } from "@/lib/constants";
import { useState } from "react";
import { AppointmentModal } from "@/components/AppointmentModal";

const FAQ = () => {
  const [appointmentOpen, setAppointmentOpen] = useState(false);

  const { data: faqs, isLoading } = useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data;
    },
  });

  // Group by category
  const grouped = (faqs ?? []).reduce<Record<string, typeof faqs>>((acc, faq) => {
    const cat = faq.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat]!.push(faq);
    return acc;
  }, {});

  return (
    <Layout>
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">Frequently Asked Questions</h1>
              <p className="text-lg text-primary-foreground/80 leading-relaxed">
                Find answers to common questions about fertility treatments and women's wellness.
              </p>
            </div>
            <Button asChild size="lg" variant="outline" className="self-start md:self-auto border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20">
              <a href={`tel:${CLINIC.phones[0]}`}>
                <Phone className="h-4 w-4 mr-2" /> Call Us
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container max-w-3xl">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse h-14 bg-muted rounded" />
              ))}
            </div>
          ) : Object.keys(grouped).length > 0 ? (
            <div className="space-y-8">
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category}>
                  <h2 className="text-xl font-display font-bold mb-4">{category}</h2>
                  <Accordion type="single" collapsible className="space-y-2">
                    {items!.map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-4">
                        <AccordionTrigger className="text-left font-medium">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <HelpCircle className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">FAQs are being prepared. Contact us directly for any questions.</p>
              <Button onClick={() => setAppointmentOpen(true)}>Book Appointment</Button>
            </div>
          )}
        </div>
      </section>

      <AppointmentModal open={appointmentOpen} onOpenChange={setAppointmentOpen} />
    </Layout>
  );
};

export default FAQ;
