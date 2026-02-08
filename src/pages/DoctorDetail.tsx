import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Users, Mail, Phone } from "lucide-react";

const DoctorDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: doctor, isLoading } = useQuery({
    queryKey: ["doctor", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: otherDoctors } = useQuery({
    queryKey: ["other-doctors", id],
    queryFn: async () => {
      const { data } = await supabase
        .from("doctors")
        .select("id, full_name, position, image_url")
        .neq("id", id!)
        .order("display_order")
        .limit(3);
      return data ?? [];
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Layout>
        <section className="py-20">
          <div className="container max-w-4xl animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-6" />
            <div className="h-64 bg-muted rounded mb-6" />
            <div className="h-4 bg-muted rounded w-2/3 mb-3" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </section>
      </Layout>
    );
  }

  if (!doctor) {
    return (
      <Layout>
        <section className="py-20">
          <div className="container text-center">
            <h1 className="text-3xl font-display font-bold mb-4">Doctor Not Found</h1>
            <p className="text-muted-foreground mb-6">This profile doesn't exist.</p>
            <Button asChild>
              <Link to="/doctors">View All Doctors</Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container">
          <Link
            to="/doctors"
            className="inline-flex items-center gap-1 text-primary-foreground/70 hover:text-primary-foreground text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Doctors
          </Link>

          <div className="grid md:grid-cols-[300px_1fr] gap-8 max-w-4xl">
            {/* Photo */}
            <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden flex items-center justify-center">
              {doctor.image_url ? (
                <img
                  src={doctor.image_url}
                  alt={doctor.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Users className="h-20 w-20 text-muted-foreground/20" />
              )}
            </div>

            {/* Info */}
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
                {doctor.full_name}
              </h1>
              <p className="text-lg text-primary-foreground/80 font-medium mb-4">{doctor.position}</p>

              {doctor.experience && (
                <div className="mb-4">
                  <h3 className="font-semibold text-sm mb-1 text-primary-foreground/90">Experience</h3>
                  <p className="text-primary-foreground/70">{doctor.experience}</p>
                </div>
              )}

              {doctor.description && (
                <div className="mb-6">
                  <h3 className="font-semibold text-sm mb-1 text-primary-foreground/90">About</h3>
                  <p className="text-primary-foreground/70 leading-relaxed">{doctor.description}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                {doctor.email && (
                  <a
                    href={`mailto:${doctor.email}`}
                    className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground hover:underline"
                  >
                    <Mail className="h-4 w-4" /> {doctor.email}
                  </a>
                )}
                {doctor.phone && (
                  <a
                    href={`tel:${doctor.phone}`}
                    className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground hover:underline"
                  >
                    <Phone className="h-4 w-4" /> {doctor.phone}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Doctors */}
      {otherDoctors && otherDoctors.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-8">Other Specialists</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
              {otherDoctors.map((doc) => (
                <Link key={doc.id} to={`/doctors/${doc.id}`}>
                  <Card className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-[3/4] bg-muted flex items-center justify-center">
                      {doc.image_url ? (
                        <img
                          src={doc.image_url}
                          alt={doc.full_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Users className="h-16 w-16 text-muted-foreground/20" />
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
          </div>
        </section>
      )}
    </Layout>
  );
};

export default DoctorDetail;
