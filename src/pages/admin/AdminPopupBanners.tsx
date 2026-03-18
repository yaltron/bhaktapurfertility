import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface BannerForm {
  name: string;
  image_url: string;
  display_seconds: number;
  is_active: boolean;
}

const EMPTY_FORM: BannerForm = { name: "", image_url: "", display_seconds: 5, is_active: false };

const AdminPopupBanners = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<BannerForm>(EMPTY_FORM);

  const { data: banners, isLoading } = useQuery({
    queryKey: ["popup-banners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("popup_banners")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (values: BannerForm & { id?: string }) => {
      // If activating this banner, deactivate others first
      if (values.is_active) {
        await supabase
          .from("popup_banners")
          .update({ is_active: false })
          .neq("id", values.id ?? "");
      }

      if (values.id) {
        const { error } = await supabase
          .from("popup_banners")
          .update({ name: values.name, image_url: values.image_url, display_seconds: values.display_seconds, is_active: values.is_active })
          .eq("id", values.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("popup_banners")
          .insert({ name: values.name, image_url: values.image_url, display_seconds: values.display_seconds, is_active: values.is_active });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["popup-banners"] });
      toast.success(editId ? "Banner updated" : "Banner created");
      closeDialog();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("popup_banners").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["popup-banners"] });
      toast.success("Banner deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const closeDialog = () => {
    setDialogOpen(false);
    setEditId(null);
    setForm(EMPTY_FORM);
  };

  const openEdit = (banner: any) => {
    setEditId(banner.id);
    setForm({ name: banner.name, image_url: banner.image_url, display_seconds: banner.display_seconds, is_active: banner.is_active });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.image_url) {
      toast.error("Name and image are required");
      return;
    }
    saveMutation.mutate({ ...form, id: editId ?? undefined });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold">Popup Banners</h1>
        <Button onClick={() => { setForm(EMPTY_FORM); setEditId(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Banner
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : !banners?.length ? (
        <p className="text-muted-foreground">No banners yet.</p>
      ) : (
        <div className="grid gap-4">
          {banners.map((b) => (
            <Card key={b.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="h-20 w-32 rounded bg-muted overflow-hidden shrink-0">
                  {b.image_url && <img src={b.image_url} alt={b.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{b.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {b.display_seconds}s · {b.is_active ? "✅ Active" : "Inactive"}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="icon" variant="outline" onClick={() => openEdit(b)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline" className="text-destructive" onClick={() => deleteMutation.mutate(b.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Banner" : "New Banner"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Banner Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. New Year Offer" />
            </div>
            <div>
              <Label>Banner Image</Label>
              <ImageUpload folder="banners" value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} />
            </div>
            <div>
              <Label>Display Time (seconds)</Label>
              <Input type="number" min={1} max={60} value={form.display_seconds} onChange={(e) => setForm({ ...form, display_seconds: parseInt(e.target.value) || 5 })} />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
              <Label>Active (only one banner can be active)</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Saving…" : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPopupBanners;
