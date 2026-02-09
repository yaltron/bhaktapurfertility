import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { CLINIC } from "@/lib/constants";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const AdminResetPassword = () => {
  const { session, loading: authLoading } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      toast.success("Password updated successfully! Please sign in with your new password.");
      await supabase.auth.signOut();
      navigate("/admin/login", { replace: true });
    } catch (err: any) {
      toast.error(err.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  // Auth still loading — show spinner
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="font-display text-2xl text-primary">{CLINIC.shortName}</CardTitle>
            <CardDescription>Verifying your reset link...</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Please wait while we verify your password reset link.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No session after auth loaded — link is invalid/expired
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="font-display text-2xl text-primary">{CLINIC.shortName}</CardTitle>
            <CardDescription>Reset link expired or invalid</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              We couldn't verify your password reset link. It may have expired or already been used.
            </p>
            <p className="text-sm text-muted-foreground">
              Please request a new password reset link from the login page.
            </p>
            <Button onClick={() => navigate("/admin/login", { replace: true })} className="w-full">
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Session exists — show password form
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-display text-2xl text-primary">{CLINIC.shortName}</CardTitle>
          <CardDescription>Set your new password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminResetPassword;
