import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type Faq = Tables<"faqs">;

const emptyForm: TablesInsert<"faqs"> = {
  question: "",
  answer: "",
  sort_order: 0,
};

async function fetchFaqs(): Promise<Faq[]> {
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export function FaqsManager() {
  const queryClient = useQueryClient();
  const { data: faqs = [], isLoading } = useQuery({
    queryKey: ["admin-faqs"],
    queryFn: fetchFaqs,
  });

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TablesInsert<"faqs">>(emptyForm);
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(faq: Faq) {
    setEditingId(faq.id);
    setForm(faq);
    setOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    const { error } = editingId
      ? await supabase.from("faqs").update(form).eq("id", editingId)
      : await supabase.from("faqs").insert(form);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(editingId ? "FAQ updated" : "FAQ created");
    setOpen(false);
    queryClient.invalidateQueries({ queryKey: ["admin-faqs"] });
    queryClient.invalidateQueries({ queryKey: ["faqs"] });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this FAQ?")) return;
    const { error } = await supabase.from("faqs").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("FAQ deleted");
    queryClient.invalidateQueries({ queryKey: ["admin-faqs"] });
    queryClient.invalidateQueries({ queryKey: ["faqs"] });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Questions shown in the FAQ section.
        </p>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" /> New FAQ
        </Button>
      </div>

      <div className="rounded-lg border border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-muted-foreground"
                >
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {!isLoading && faqs.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-muted-foreground"
                >
                  No FAQs yet.
                </TableCell>
              </TableRow>
            )}
            {faqs.map((f) => (
              <TableRow key={f.id}>
                <TableCell className="font-medium max-w-md truncate">
                  {f.question}
                </TableCell>
                <TableCell>{f.sort_order}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(f)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(f.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit FAQ" : "New FAQ"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                value={form.question}
                onChange={(e) =>
                  setForm((f) => ({ ...f, question: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="answer">Answer</Label>
              <Textarea
                id="answer"
                value={form.answer}
                onChange={(e) =>
                  setForm((f) => ({ ...f, answer: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sort_order">Sort order</Label>
              <Input
                id="sort_order"
                type="number"
                value={form.sort_order}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !form.question || !form.answer}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
