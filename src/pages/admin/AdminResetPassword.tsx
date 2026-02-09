import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { CLINIC } from "@/lib/constants";
import { Loader2 } from "lucide-react";

const AdminResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const navigate = useNavigate();
  const sessionFoundRef = useRef(false);

  useEffect(() => {
    let pollInterval: ReturnType<typeof setInterval> | null = null;
    let timeoutTimer: ReturnType<typeof setTimeout> | null = null;

    const markReady = () => {
      if (!sessionFoundRef.current) {
        sessionFoundRef.current = true;
        setSessionReady(true);
        if (pollInterval) clearInterval(pollInterval);
        if (timeoutTimer) clearTimeout(timeoutTimer);
      }
    };

    // 1. Check URL hash for recovery signal
    const hash = window.location.hash;
    const isRecoveryFlow = hash.includes("type=recovery") || hash.includes("access_token");

    // 2. Listen for multiple auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN" || event === "TOKEN_REFRESHED") &&
        session
      ) {
        markReady();
      }
    });

    // 3. Poll getSession() to catch async hash processing
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        markReady();
      }
    };

    // Immediate check
    checkSession();

    // Poll every 500ms
    pollInterval = setInterval(checkSession, 500);

    // 4. Timeout after 5 seconds
    timeoutTimer = setTimeout(() => {
      if (!sessionFoundRef.current) {
        if (pollInterval) clearInterval(pollInterval);
        // One final check
        checkSession().then(() => {
          if (!sessionFoundRef.current) {
            setTimedOut(true);
          }
        });
      }
    }, 5000);

    return () => {
      subscription.unsubscribe();
      if (pollInterval) clearInterval(pollInterval);
      if (timeoutTimer) clearTimeout(timeoutTimer);
    };
  }, []);

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

  if (timedOut) {
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

  if (!sessionReady) {
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
