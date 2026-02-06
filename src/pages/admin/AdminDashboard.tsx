import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, CalendarCheck, MessageSquare } from "lucide-react";

const AdminDashboard = () => {
  const { data: blogCount } = useQuery({
    queryKey: ["admin-blog-count"],
    queryFn: async () => {
      const { count } = await supabase.from("blogs").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: doctorCount } = useQuery({
    queryKey: ["admin-doctor-count"],
    queryFn: async () => {
      const { count } = await supabase.from("doctors").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: appointmentCount } = useQuery({
    queryKey: ["admin-appointment-count"],
    queryFn: async () => {
      const { count } = await supabase.from("appointment_requests").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: messageCount } = useQuery({
    queryKey: ["admin-message-count"],
    queryFn: async () => {
      const { count } = await supabase.from("contact_messages").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const stats = [
    { label: "Blog Posts", count: blogCount ?? 0, icon: FileText, color: "text-blue-600" },
    { label: "Doctors", count: doctorCount ?? 0, icon: Users, color: "text-primary" },
    { label: "Appointments", count: appointmentCount ?? 0, icon: CalendarCheck, color: "text-green-600" },
    { label: "Messages", count: messageCount ?? 0, icon: MessageSquare, color: "text-orange-600" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{s.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
