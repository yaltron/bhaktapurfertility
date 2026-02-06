import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Users, Mail, Phone } from "lucide-react";
import { useState } from "react";

interface Doctor {
  id: string;
  full_name: string;
  position: string;
  image_url: string | null;
  experience: string | null;
  description: string | null;
  email: string | null;
  phone: string | null;
}

const Doctors = () => {
  const [selected, setSelected] = useState<Doctor | null>(null);

  const { data: doctors, isLoading } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data as Doctor[];
    },
  });

  return (
    <Layout>
      <section className="bg-secondary py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">Our Doctors</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Meet our team of experienced fertility specialists and healthcare professionals.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-muted" />
                  <CardContent className="p-5">
                    <div className="h-5 bg-muted rounded w-2/3 mb-2" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : doctors && doctors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {doctors.map((doc) => (
                <Card
                  key={doc.id}
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelected(doc)}
                >
                  <div className="aspect-[3/4] bg-muted flex items-center justify-center">
                    {doc.image_url ? (
                      <img src={doc.image_url} alt={doc.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="h-20 w-20 text-muted-foreground/20" />
                    )}
                  </div>
                  <CardContent className="p-5 text-center">
                    <h3 className="font-semibold text-lg">{doc.full_name}</h3>
                    <p className="text-sm text-muted-foreground">{doc.position}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Our doctor profiles are being updated. Please check back soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Doctor Detail Modal */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-xl">{selected.full_name}</DialogTitle>
                <DialogDescription>{selected.position}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {selected.image_url && (
                  <img
                    src={selected.image_url}
                    alt={selected.full_name}
                    className="w-full max-h-64 object-cover rounded-lg"
                  />
                )}
                {selected.experience && (
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Experience</h4>
                    <p className="text-sm text-muted-foreground">{selected.experience}</p>
                  </div>
                )}
                {selected.description && (
                  <div>
                    <h4 className="font-semibold text-sm mb-1">About</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{selected.description}</p>
                  </div>
                )}
                <div className="flex flex-wrap gap-4 text-sm">
                  {selected.email && (
                    <a href={`mailto:${selected.email}`} className="flex items-center gap-1 text-primary hover:underline">
                      <Mail className="h-4 w-4" /> {selected.email}
                    </a>
                  )}
                  {selected.phone && (
                    <a href={`tel:${selected.phone}`} className="flex items-center gap-1 text-primary hover:underline">
                      <Phone className="h-4 w-4" /> {selected.phone}
                    </a>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Doctors;
