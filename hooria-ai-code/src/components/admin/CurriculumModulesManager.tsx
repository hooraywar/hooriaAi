import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type ModuleRow = Tables<"curriculum_modules">;
type Session = { title: string; points: string[] };

const ICONS = [
  "Sparkles",
  "BookOpen",
  "Cpu",
  "Database",
  "Bot",
  "Workflow",
  "Server",
  "Trophy",
  "Presentation",
  "GraduationCap",
  "Rocket",
  "Zap",
];

type FormState = {
  module_number: string;
  weeks: string;
  title: string;
  icon: string;
  intro: string;
  deliverable: string;
  sort_order: number;
  sessions: Session[];
};

const emptyForm: FormState = {
  module_number: "",
  weeks: "",
  title: "",
  icon: "Sparkles",
  intro: "",
  deliverable: "",
  sort_order: 0,
  sessions: [],
};

async function fetchModules(): Promise<ModuleRow[]> {
  const { data, error } = await supabase
    .from("curriculum_modules")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

function toFormState(row: ModuleRow): FormState {
  return {
    module_number: row.module_number,
    weeks: row.weeks,
    title: row.title,
    icon: row.icon,
    intro: row.intro ?? "",
    deliverable: row.deliverable ?? "",
    sort_order: row.sort_order,
    sessions: Array.isArray(row.sessions)
      ? (row.sessions as unknown as Session[])
      : [],
  };
}

export function CurriculumModulesManager() {
  const queryClient = useQueryClient();
  const { data: modules = [], isLoading } = useQuery({
    queryKey: ["admin-curriculum-modules"],
    queryFn: fetchModules,
  });

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(row: ModuleRow) {
    setEditingId(row.id);
    setForm(toFormState(row));
    setOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    const payload = {
      module_number: form.module_number,
      weeks: form.weeks,
      title: form.title,
      icon: form.icon,
      intro: form.intro || null,
      deliverable: form.deliverable || null,
      sort_order: form.sort_order,
      sessions: form.sessions,
    };
    const { error } = editingId
      ? await supabase
          .from("curriculum_modules")
          .update(payload)
          .eq("id", editingId)
      : await supabase.from("curriculum_modules").insert(payload);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(editingId ? "Module updated" : "Module created");
    setOpen(false);
    queryClient.invalidateQueries({ queryKey: ["admin-curriculum-modules"] });
    queryClient.invalidateQueries({ queryKey: ["curriculum-modules"] });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this module?")) return;
    const { error } = await supabase
      .from("curriculum_modules")
      .delete()
      .eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Module deleted");
    queryClient.invalidateQueries({ queryKey: ["admin-curriculum-modules"] });
    queryClient.invalidateQueries({ queryKey: ["curriculum-modules"] });
  }

  function addSession() {
    setForm((f) => ({
      ...f,
      sessions: [...f.sessions, { title: "", points: [""] }],
    }));
  }

  function removeSession(index: number) {
    setForm((f) => ({
      ...f,
      sessions: f.sessions.filter((_, i) => i !== index),
    }));
  }

  function updateSessionTitle(index: number, title: string) {
    setForm((f) => ({
      ...f,
      sessions: f.sessions.map((s, i) => (i === index ? { ...s, title } : s)),
    }));
  }

  function addPoint(sessionIndex: number) {
    setForm((f) => ({
      ...f,
      sessions: f.sessions.map((s, i) =>
        i === sessionIndex ? { ...s, points: [...s.points, ""] } : s,
      ),
    }));
  }

  function updatePoint(
    sessionIndex: number,
    pointIndex: number,
    value: string,
  ) {
    setForm((f) => ({
      ...f,
      sessions: f.sessions.map((s, i) =>
        i === sessionIndex
          ? {
              ...s,
              points: s.points.map((p, pi) => (pi === pointIndex ? value : p)),
            }
          : s,
      ),
    }));
  }

  function removePoint(sessionIndex: number, pointIndex: number) {
    setForm((f) => ({
      ...f,
      sessions: f.sessions.map((s, i) =>
        i === sessionIndex
          ? { ...s, points: s.points.filter((_, pi) => pi !== pointIndex) }
          : s,
      ),
    }));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          The week-by-week modules on the full /curriculum page.
        </p>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" /> New Module
        </Button>
      </div>

      <div className="rounded-lg border border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Weeks</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Sessions</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {!isLoading && modules.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  No modules yet.
                </TableCell>
              </TableRow>
            )}
            {modules.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-mono">{m.module_number}</TableCell>
                <TableCell>{m.weeks}</TableCell>
                <TableCell className="font-medium">{m.title}</TableCell>
                <TableCell>
                  {Array.isArray(m.sessions) ? m.sessions.length : 0}
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(m)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(m.id)}
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
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Module" : "New Module"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="module_number">Number</Label>
                <Input
                  id="module_number"
                  value={form.module_number}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, module_number: e.target.value }))
                  }
                  placeholder="01"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="weeks">Weeks label</Label>
                <Input
                  id="weeks"
                  value={form.weeks}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, weeks: e.target.value }))
                  }
                  placeholder="Week 1"
                />
              </div>
            </div>
            <div className="grid grid-cols-[1fr_160px] gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Icon</Label>
                <Select
                  value={form.icon}
                  onValueChange={(v) => setForm((f) => ({ ...f, icon: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ICONS.map((i) => (
                      <SelectItem key={i} value={i}>
                        {i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="intro">Intro (optional one-line summary)</Label>
              <Textarea
                id="intro"
                value={form.intro}
                onChange={(e) =>
                  setForm((f) => ({ ...f, intro: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="deliverable">Deliverable (optional)</Label>
              <Input
                id="deliverable"
                value={form.deliverable}
                onChange={(e) =>
                  setForm((f) => ({ ...f, deliverable: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sort_order">Sort order</Label>
              <Input
                id="sort_order"
                type="number"
                className="w-32"
                value={form.sort_order}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))
                }
              />
            </div>

            <div className="space-y-3 rounded-xl border border-border/60 p-4">
              <div className="flex items-center justify-between">
                <Label>Sessions</Label>
                <Button variant="outline" size="sm" onClick={addSession}>
                  <Plus className="h-4 w-4" /> Add session
                </Button>
              </div>
              {form.sessions.map((session, si) => (
                <div
                  key={si}
                  className="space-y-2 rounded-lg border border-border/50 p-3"
                >
                  <div className="flex items-center gap-2">
                    <Input
                      value={session.title}
                      placeholder="Session title"
                      onChange={(e) => updateSessionTitle(si, e.target.value)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSession(si)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 pl-3">
                    {session.points.map((point, pi) => (
                      <div key={pi} className="flex items-center gap-2">
                        <Textarea
                          value={point}
                          placeholder="Bullet point"
                          className="min-h-9"
                          onChange={(e) => updatePoint(si, pi, e.target.value)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removePoint(si, pi)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addPoint(si)}
                    >
                      <Plus className="h-4 w-4" /> Add point
                    </Button>
                  </div>
                </div>
              ))}
              {form.sessions.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No sessions yet.
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                saving || !form.module_number || !form.weeks || !form.title
              }
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
