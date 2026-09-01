import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export type Curriculum = Tables<"curriculums">;

async function fetchCurriculums(): Promise<Curriculum[]> {
  const { data, error } = await supabase
    .from("curriculums")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export function useCurriculums() {
  return useQuery({
    queryKey: ["admin-curriculums"],
    queryFn: fetchCurriculums,
  });
}

export function CurriculumSelector({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const queryClient = useQueryClient();
  const { data: curriculums = [], isLoading } = useCurriculums();

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["admin-curriculums"] });
    queryClient.invalidateQueries({ queryKey: ["curriculum-modules"] });
    queryClient.invalidateQueries({ queryKey: ["curriculum-preview"] });
  }

  function openCreate() {
    setEditingId(null);
    setTitle("");
    setOpen(true);
  }

  function openEdit(c: Curriculum) {
    setEditingId(c.id);
    setTitle(c.title);
    setOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    const { data, error } = editingId
      ? await supabase
          .from("curriculums")
          .update({ title })
          .eq("id", editingId)
          .select()
          .single()
      : await supabase
          .from("curriculums")
          .insert({ title, sort_order: curriculums.length })
          .select()
          .single();
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(editingId ? "Curriculum updated" : "Curriculum created");
    setOpen(false);
    invalidate();
    if (!editingId && data) onSelect(data.id);
  }

  async function handleDelete(c: Curriculum) {
    if (
      !confirm(
        `Delete "${c.title}"? This also deletes its modules and preview cards.`,
      )
    )
      return;
    const { error } = await supabase
      .from("curriculums")
      .delete()
      .eq("id", c.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Curriculum deleted");
    invalidate();
    if (selectedId === c.id) onSelect("");
  }

  async function togglePublished(c: Curriculum, value: boolean) {
    const { error } = await supabase
      .from("curriculums")
      .update({ is_published: value })
      .eq("id", c.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(
      value ? "Curriculum is now visible" : "Curriculum is now hidden",
    );
    invalidate();
  }

  return (
    <div className="space-y-2 rounded-xl border border-border/60 p-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">
          Curriculum
        </Label>
        <Button variant="outline" size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" /> New curriculum
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {isLoading && (
          <p className="text-sm text-muted-foreground">Loading...</p>
        )}
        {!isLoading && curriculums.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No curriculums yet. Create one to get started.
          </p>
        )}
        {curriculums.map((c) => (
          <div
            key={c.id}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-2.5 py-1.5",
              selectedId === c.id
                ? "border-brand-blue bg-brand-blue/10"
                : "border-border/60",
            )}
          >
            <button
              type="button"
              onClick={() => onSelect(c.id)}
              className="text-sm font-medium"
            >
              {c.title}
            </button>
            <div className="flex items-center gap-1.5">
              <Switch
                checked={c.is_published}
                onCheckedChange={(v) => togglePublished(c, v)}
              />
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                {c.is_published ? "On" : "Off"}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => openEdit(c)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => handleDelete(c)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit curriculum" : "New curriculum"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label htmlFor="curriculum-title">Title</Label>
            <Input
              id="curriculum-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Become an AI Engineer"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving || !title}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
