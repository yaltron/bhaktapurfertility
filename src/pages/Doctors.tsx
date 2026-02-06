import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

const Doctors = () => {
  const { data: doctors, isLoading } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data;
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
                <Link key={doc.id} to={`/doctors/${doc.id}`}>
                  <Card className="overflow-hidden hover:shadow-md transition-shadow">
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
                </Link>
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
    </Layout>
  );
};

export default Doctors;
