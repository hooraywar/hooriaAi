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
import { CurriculumSelector, useCurriculums } from "./CurriculumSelector";

type Module = Tables<"curriculum_preview">;

function emptyForm(curriculumId: string): TablesInsert<"curriculum_preview"> {
  return {
    curriculum_id: curriculumId,
    module_number: "",
    title: "",
    description: "",
    sort_order: 0,
  };
}

async function fetchModules(curriculumId: string): Promise<Module[]> {
  const { data, error } = await supabase
    .from("curriculum_preview")
    .select("*")
    .eq("curriculum_id", curriculumId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export function CurriculumPreviewManager() {
  const queryClient = useQueryClient();
  const { data: curriculums = [] } = useCurriculums();
  const [selectedCurriculumId, setSelectedCurriculumId] = useState<
    string | null
  >(null);
  const curriculumId = selectedCurriculumId ?? curriculums[0]?.id ?? null;

  const { data: modules = [], isLoading } = useQuery({
    queryKey: ["admin-curriculum-preview", curriculumId],
    queryFn: () => fetchModules(curriculumId as string),
    enabled: !!curriculumId,
  });

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TablesInsert<"curriculum_preview">>(
    emptyForm(curriculumId ?? ""),
  );
  const [saving, setSaving] = useState(false);

  function openCreate() {
    if (!curriculumId) return;
    setEditingId(null);
    setForm(emptyForm(curriculumId));
    setOpen(true);
  }

  function openEdit(m: Module) {
    setEditingId(m.id);
    setForm(m);
    setOpen(true);
  }

  async function handleSave() {
    if (!curriculumId) return;
    setSaving(true);
    const payload = { ...form, curriculum_id: curriculumId };
    const { error } = editingId
      ? await supabase
          .from("curriculum_preview")
          .update(payload)
          .eq("id", editingId)
      : await supabase.from("curriculum_preview").insert(payload);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(editingId ? "Module updated" : "Module created");
    setOpen(false);
    queryClient.invalidateQueries({ queryKey: ["admin-curriculum-preview"] });
    queryClient.invalidateQueries({ queryKey: ["curriculum-preview"] });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this module?")) return;
    const { error } = await supabase
      .from("curriculum_preview")
      .delete()
      .eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Module deleted");
    queryClient.invalidateQueries({ queryKey: ["admin-curriculum-preview"] });
    queryClient.invalidateQueries({ queryKey: ["curriculum-preview"] });
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        The curriculum preview grid on the homepage. Cards follow the same
        curricula and on/off visibility as the curriculum page.
      </p>

      <CurriculumSelector
        selectedId={curriculumId}
        onSelect={setSelectedCurriculumId}
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {curriculumId
            ? "Preview cards for the selected curriculum."
            : "Select or create a curriculum above to manage its preview cards."}
        </p>
        <Button size="sm" onClick={openCreate} disabled={!curriculumId}>
          <Plus className="h-4 w-4" /> New Module
        </Button>
      </div>

      <div className="rounded-lg border border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {!isLoading && modules.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  No modules yet.
                </TableCell>
              </TableRow>
            )}
            {modules.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-mono">{m.module_number}</TableCell>
                <TableCell className="font-medium">{m.title}</TableCell>
                <TableCell>{m.sort_order}</TableCell>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Module" : "New Module"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
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
                <Label htmlFor="sort_order">Sort order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={form.sort_order}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      sort_order: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
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
              disabled={
                saving ||
                !form.module_number ||
                !form.title ||
                !form.description
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
