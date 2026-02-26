import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Doctors from "./pages/Doctors";
import DoctorDetail from "./pages/DoctorDetail";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import SuccessStories from "./pages/SuccessStories";
import SuccessStoryDetail from "./pages/SuccessStoryDetail";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBlogs from "./pages/admin/AdminBlogs";
import AdminDoctors from "./pages/admin/AdminDoctors";
import AdminAppointments from "./pages/admin/AdminAppointments";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminSuccessStories from "./pages/admin/AdminSuccessStories";
import AdminFAQs from "./pages/admin/AdminFAQs";
import AdminResetPassword from "./pages/admin/AdminResetPassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:id" element={<DoctorDetail />} />
            <Route path="/insights" element={<Blog />} />
            <Route path="/insights/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/success-stories" element={<SuccessStories />} />
            <Route path="/success-stories/:slug" element={<SuccessStoryDetail />} />
            <Route path="/faq" element={<FAQ />} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/reset-password" element={<AdminResetPassword />} />
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <AdminLayout />
                </RequireAdmin>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="blogs" element={<AdminBlogs />} />
              <Route path="doctors" element={<AdminDoctors />} />
              <Route path="appointments" element={<AdminAppointments />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="success-stories" element={<AdminSuccessStories />} />
              <Route path="faqs" element={<AdminFAQs />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
