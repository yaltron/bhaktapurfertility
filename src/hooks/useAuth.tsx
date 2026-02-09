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

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mountedRef.current) return;
      setSession(session);
      if (session?.user) {
        const admin = await checkAdmin(session.user.id);
        if (!mountedRef.current) return;
        setIsAdmin(admin);
      }
      setLoading(false);
    }).catch((err: any) => {
      if (err?.name === "AbortError" || 
          err?.message?.includes("abort") || 
          err?.message?.includes("signal")) {
        return;
      }
      console.error("Auth session error:", err);
      if (mountedRef.current) setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        try {
          if (!mountedRef.current) return;
          setSession(session);
          if (session?.user) {
            setLoading(true);
            const admin = await checkAdmin(session.user.id);
            if (!mountedRef.current) return;
            setIsAdmin(admin);
          } else {
            setIsAdmin(false);
          }
          setLoading(false);
        } catch (err: any) {
          if (err?.name === "AbortError" || 
              err?.message?.includes("abort") || 
              err?.message?.includes("signal")) {
            return;
          }
          console.error("Auth state change error:", err);
          if (mountedRef.current) setLoading(false);
        }
      }
    );

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
