import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ClinicPhoto {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  display_order: number | null;
  created_at: string;
}

const AdminClinicPhotos = () => {
  const [photos, setPhotos] = useState<ClinicPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ClinicPhoto | null>(null);
  const [form, setForm] = useState({ title: "", description: "", image_url: "" });
  const [saving, setSaving] = useState(false);

  const fetchPhotos = async () => {
    const { data } = await supabase
      .from("clinic_photos")
      .select("*")
      .order("display_order", { ascending: true });
    setPhotos((data as ClinicPhoto[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchPhotos(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: "", description: "", image_url: "" });
    setDialogOpen(true);
  };

  const openEdit = (photo: ClinicPhoto) => {
    setEditing(photo);
    setForm({
      title: photo.title || "",
      description: photo.description || "",
      image_url: photo.image_url,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.image_url) {
      toast.error("Please upload an image");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        const { error } = await supabase
          .from("clinic_photos")
          .update({
            title: form.title || null,
            description: form.description || null,
            image_url: form.image_url,
          })
          .eq("id", editing.id);
        if (error) throw error;
        toast.success("Photo updated");
      } else {
        const { error } = await supabase.from("clinic_photos").insert({
          title: form.title || null,
          description: form.description || null,
          image_url: form.image_url,
          display_order: photos.length,
        });
        if (error) throw error;
        toast.success("Photo added");
      }
      setDialogOpen(false);
      fetchPhotos();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this photo?")) return;
    const { error } = await supabase.from("clinic_photos").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete");
    } else {
      toast.success("Photo deleted");
      fetchPhotos();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Clinic Photos</h1>
          <p className="text-sm text-muted-foreground">Manage photos shown on the About page</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" /> Add Photo
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : photos.length === 0 ? (
        <p className="text-muted-foreground">No photos yet. Add your first one!</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden">
              <img
                src={photo.image_url}
                alt={photo.title || "Clinic photo"}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-4">
                {photo.title && <h3 className="font-semibold text-sm mb-1">{photo.title}</h3>}
                {photo.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{photo.description}</p>
                )}
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" onClick={() => openEdit(photo)}>
                    <Pencil className="h-3 w-3 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(photo.id)}>
                    <Trash2 className="h-3 w-3 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Photo" : "Add Photo"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <ImageUpload
              value={form.image_url}
              onChange={(url) => setForm((f) => ({ ...f, image_url: url }))}
              folder="clinic-photos"
            />
            <div>
              <label className="text-sm font-medium">Title (optional)</label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Reception Area"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description (optional)</label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Brief description..."
                rows={2}
              />
            </div>
            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? "Saving..." : editing ? "Update" : "Add Photo"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminClinicPhotos;
