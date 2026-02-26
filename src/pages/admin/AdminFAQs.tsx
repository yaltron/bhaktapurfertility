import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface FAQForm {
  question: string;
  answer: string;
  category: string;
  display_order: number;
}

const emptyForm: FAQForm = {
  question: "",
  answer: "",
  category: "",
  display_order: 0,
};

const AdminFAQs = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FAQForm>(emptyForm);

  const { data: faqs, isLoading } = useQuery({
    queryKey: ["admin-faqs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data;
    },
  });

  const upsert = useMutation({
    mutationFn: async (data: FAQForm & { id?: string }) => {
      if (data.id) {
        const { id, ...rest } = data;
        const { error } = await supabase.from("faqs").update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { ...rest } = data;
        const { error } = await supabase.from("faqs").insert(rest);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-faqs"] });
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      toast.success(editingId ? "FAQ updated!" : "FAQ added!");
      closeDialog();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteFAQ = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("faqs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-faqs"] });
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      toast.success("FAQ removed");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const openCreate = () => { setEditingId(null); setForm(emptyForm); setDialogOpen(true); };

  const openEdit = (f: any) => {
    setEditingId(f.id);
    setForm({
      question: f.question,
      answer: f.answer,
      category: f.category || "",
      display_order: f.display_order || 0,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => { setDialogOpen(false); setEditingId(null); setForm(emptyForm); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsert.mutate({ ...form, id: editingId ?? undefined });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold">FAQs</h1>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" /> Add FAQ</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
              ) : faqs && faqs.length > 0 ? (
                faqs.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="font-medium max-w-xs truncate">{f.question}</TableCell>
                    <TableCell className="text-muted-foreground">{f.category || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{f.display_order}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(f)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { if (confirm("Remove this FAQ?")) deleteFAQ.mutate(f.id); }}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No FAQs yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingId ? "Edit FAQ" : "Add FAQ"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Question *</Label>
              <Input value={form.question} onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label>Answer *</Label>
              <Textarea value={form.answer} onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))} rows={4} required />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="e.g. Treatment, General" />
            </div>
            <div className="space-y-2">
              <Label>Display Order</Label>
              <Input type="number" value={form.display_order} onChange={(e) => setForm((f) => ({ ...f, display_order: +e.target.value }))} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
              <Button type="submit" disabled={upsert.isPending}>{upsert.isPending ? "Saving..." : editingId ? "Update" : "Add"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminFAQs;
