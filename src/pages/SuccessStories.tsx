import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Phone } from "lucide-react";
import { CLINIC } from "@/lib/constants";
import { AppointmentModal } from "@/components/AppointmentModal";

const SuccessStories = () => {
  const [appointmentOpen, setAppointmentOpen] = useState(false);

  const { data: stories, isLoading } = useQuery({
    queryKey: ["success-stories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("success_stories")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data;
    },
  });

  return (
    <Layout>
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">Success Stories</h1>
              <p className="text-lg text-primary-foreground/80 leading-relaxed">
                Real stories from families whose dreams came true at {CLINIC.name}.
              </p>
            </div>
            <Button onClick={() => setAppointmentOpen(true)} size="lg" variant="outline" className="self-start md:self-auto border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20">
              Book Appointment
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-video bg-muted" />
                  <CardContent className="p-5">
                    <div className="h-5 bg-muted rounded w-2/3 mb-2" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : stories && stories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <Card key={story.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    {story.photo_url ? (
                      <img src={story.photo_url} alt={story.title} className="w-full h-full object-cover" />
                    ) : story.video_url ? (
                      <video src={story.video_url} className="w-full h-full object-cover" controls />
                    ) : (
                      <Users className="h-12 w-12 text-muted-foreground/20" />
                    )}
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-lg mb-2">{story.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{story.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Success stories will be shared soon.</p>
              <Button onClick={() => setAppointmentOpen(true)}>Book Appointment</Button>
            </div>
          )}
        </div>
      </section>

      <AppointmentModal open={appointmentOpen} onOpenChange={setAppointmentOpen} />
    </Layout>
  );
};

export default SuccessStories;
