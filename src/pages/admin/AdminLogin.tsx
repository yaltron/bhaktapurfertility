import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { CLINIC } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const mountedRef = useRef(true);
  const hasTriedLogin = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Redirect admins, reject non-admins (only after auth finishes loading AND user actively logged in)
  useEffect(() => {
    if (authLoading) return;

    if (user && isAdmin) {
      navigate("/admin", { replace: true });
      return;
    }

    if (user && !isAdmin && hasTriedLogin.current) {
      hasTriedLogin.current = false;
      supabase.auth.signOut();
      toast.error("Access denied. Admin privileges required.");
      if (mountedRef.current) setLoading(false);
    }
  }, [user, isAdmin, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    hasTriedLogin.current = true;

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // useAuth handles admin check + the useEffect above handles navigation
    } catch (err: any) {
      // Silently ignore abort errors (React Strict Mode double-mount)
      if (
        err?.name === "AbortError" ||
        err?.message?.includes("abort") ||
        err?.message?.includes("signal")
      ) {
        return;
      }
      if (mountedRef.current) {
        toast.error(err.message || "Login failed");
        setLoading(false);
        hasTriedLogin.current = false;
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-display text-2xl text-primary">{CLINIC.shortName}</CardTitle>
          <CardDescription>Admin Panel Login</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
