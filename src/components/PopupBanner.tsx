import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";

const SESSION_KEY = "popup_banner_dismissed";

export const PopupBanner = () => {
  const [visible, setVisible] = useState(false);

  const { data: banner } = useQuery({
    queryKey: ["active-popup-banner"],
    queryFn: async () => {
      const { data } = await supabase
        .from("popup_banners")
        .select("*")
        .eq("is_active", true)
        .limit(1)
        .maybeSingle();
      return data;
    },
    staleTime: 60_000,
  });

  useEffect(() => {
    if (!banner) return;
    const dismissed = sessionStorage.getItem(SESSION_KEY);
    if (dismissed === banner.id) return;
    setVisible(true);

    if (banner.display_seconds > 0) {
      const timer = setTimeout(() => dismiss(), banner.display_seconds * 1000);
      return () => clearTimeout(timer);
    }
  }, [banner]);

  const dismiss = () => {
    setVisible(false);
    if (banner) sessionStorage.setItem(SESSION_KEY, banner.id);
  };

  if (!visible || !banner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={dismiss}>
      <div className="relative max-w-lg w-[90%] animate-in fade-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={dismiss}
          className="absolute -top-3 -right-3 z-10 h-8 w-8 rounded-full bg-background text-foreground shadow-lg flex items-center justify-center hover:bg-muted transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        <img
          src={banner.image_url}
          alt={banner.name}
          className="w-full rounded-lg shadow-2xl"
        />
      </div>
    </div>
  );
};
