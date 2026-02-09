import { createContext, useContext, useEffect, useState, useRef, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isAdmin: false,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  const checkAdmin = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    return !!data;
  };

  useEffect(() => {
    mountedRef.current = true;

    // 1. Register listener FIRST — catches events during hash processing (recovery, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mountedRef.current) return;
        setSession(session);
        // Fire and forget — do NOT control loading state
        if (session?.user) {
          checkAdmin(session.user.id).then((admin) => {
            if (mountedRef.current) setIsAdmin(admin);
          }).catch(() => {});
        } else {
          setIsAdmin(false);
        }
      }
    );

    // 2. Initial load — this is the ONLY thing that controls loading
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mountedRef.current) return;
        setSession(session);
        if (session?.user) {
          const admin = await checkAdmin(session.user.id);
          if (mountedRef.current) setIsAdmin(admin);
        }
      } catch (err: any) {
        if (err?.name === "AbortError" ||
            err?.message?.includes("abort") ||
            err?.message?.includes("signal")) {
          return;
        }
        console.error("Auth session error:", err);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        isAdmin,
        loading,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
