import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function uniqueSlug(title: string, existing: Curriculum[], excludeId?: string) {
  const base = slugify(title) || "curriculum";
  const taken = new Set(
    existing.filter((c) => c.id !== excludeId).map((c) => c.slug),
  );
  if (!taken.has(base)) return base;
  let i = 2;
  while (taken.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}

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

type FormState = {
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  prerequisites: string;
  class_duration: string;
  qa_session: string;
};

const emptyForm: FormState = {
  title: "",
  subtitle: "",
  description: "",
  duration: "",
  prerequisites: "",
  class_duration: "",
  qa_session: "",
};

function toFormState(c: Curriculum): FormState {
  return {
    title: c.title,
    subtitle: c.subtitle ?? "",
    description: c.description ?? "",
    duration: c.duration ?? "",
    prerequisites: c.prerequisites ?? "",
    class_duration: c.class_duration ?? "",
    qa_session: c.qa_session ?? "",
  };
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
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["admin-curriculums"] });
    queryClient.invalidateQueries({ queryKey: ["curriculum-modules"] });
    queryClient.invalidateQueries({ queryKey: ["curriculum-preview"] });
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(c: Curriculum) {
    setEditingId(c.id);
    setForm(toFormState(c));
    setOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    const payload = {
      title: form.title,
      slug: uniqueSlug(form.title, curriculums, editingId ?? undefined),
      subtitle: form.subtitle || null,
      description: form.description || null,
      duration: form.duration || null,
      prerequisites: form.prerequisites || null,
      class_duration: form.class_duration || null,
      qa_session: form.qa_session || null,
    };
    const { data, error } = editingId
      ? await supabase
          .from("curriculums")
          .update(payload)
          .eq("id", editingId)
          .select()
          .single()
      : await supabase
          .from("curriculums")
          .insert({ ...payload, sort_order: curriculums.length })
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
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit curriculum" : "New curriculum"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="curriculum-title">Title</Label>
              <Input
                id="curriculum-title"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="e.g. Become an AI Engineer"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="curriculum-subtitle">Subtitle (optional)</Label>
              <Input
                id="curriculum-subtitle"
                value={form.subtitle}
                onChange={(e) =>
                  setForm((f) => ({ ...f, subtitle: e.target.value }))
                }
                placeholder="e.g. Generative AI + AI Agents + Automation Bootcamp"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="curriculum-description">
                Hero description (optional)
              </Label>
              <Textarea
                id="curriculum-description"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="The paragraph shown under the page title."
              />
            </div>

            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Program details (all optional — only filled-in ones show)
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="curriculum-duration">Course duration</Label>
                <Input
                  id="curriculum-duration"
                  value={form.duration}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, duration: e.target.value }))
                  }
                  placeholder="e.g. 10 weeks"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="curriculum-class-duration">
                  Class duration
                </Label>
                <Input
                  id="curriculum-class-duration"
                  value={form.class_duration}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      class_duration: e.target.value,
                    }))
                  }
                  placeholder="e.g. 90 min, 2x/week"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="curriculum-prereq">Pre-requisites</Label>
              <Input
                id="curriculum-prereq"
                value={form.prerequisites}
                onChange={(e) =>
                  setForm((f) => ({ ...f, prerequisites: e.target.value }))
                }
                placeholder="e.g. Basic Python"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="curriculum-qa">Q&amp;A session</Label>
              <Input
                id="curriculum-qa"
                value={form.qa_session}
                onChange={(e) =>
                  setForm((f) => ({ ...f, qa_session: e.target.value }))
                }
                placeholder="e.g. Weekly live Q&A every Friday"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving || !form.title}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
