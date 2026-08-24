import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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

type Service = Tables<"services">;

const ICONS = [
  "Sparkles",
  "Rocket",
  "BookOpen",
  "Zap",
  "Users",
  "Cpu",
  "Boxes",
  "Bot",
  "Workflow",
  "GraduationCap",
  "Trophy",
  "BrainCircuit",
  "Code2",
  "Database",
  "MessagesSquare",
];

const emptyForm: TablesInsert<"services"> = {
  title: "",
  description: "",
  icon: "Sparkles",
  price_label: "",
  is_highlighted: false,
  sort_order: 0,
};

async function fetchServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export function ServicesManager() {
  const queryClient = useQueryClient();
  const { data: services = [], isLoading } = useQuery({
    queryKey: ["admin-services"],
    queryFn: fetchServices,
  });

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TablesInsert<"services">>(emptyForm);
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(service: Service) {
    setEditingId(service.id);
    setForm(service);
    setOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    const { error } = editingId
      ? await supabase.from("services").update(form).eq("id", editingId)
      : await supabase.from("services").insert(form);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(editingId ? "Program updated" : "Program created");
    setOpen(false);
    queryClient.invalidateQueries({ queryKey: ["admin-services"] });
    queryClient.invalidateQueries({ queryKey: ["services"] });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this program?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Program deleted");
    queryClient.invalidateQueries({ queryKey: ["admin-services"] });
    queryClient.invalidateQueries({ queryKey: ["services"] });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Programs shown in the "Pick your path into AI" section.
        </p>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" /> New Program
        </Button>
      </div>

      <div className="rounded-lg border border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead>Highlighted</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground"
                >
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {!isLoading && services.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground"
                >
                  No programs yet.
                </TableCell>
              </TableRow>
            )}
            {services.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.title}</TableCell>
                <TableCell>{s.price_label}</TableCell>
                <TableCell>{s.icon}</TableCell>
                <TableCell>{s.is_highlighted ? "Yes" : "No"}</TableCell>
                <TableCell>{s.sort_order}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(s)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(s.id)}
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
              {editingId ? "Edit Program" : "New Program"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
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
            <div className="grid grid-cols-2 gap-3">
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
              <div className="space-y-1.5">
                <Label htmlFor="price_label">Price label</Label>
                <Input
                  id="price_label"
                  value={form.price_label}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price_label: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
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
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  id="is_highlighted"
                  checked={!!form.is_highlighted}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, is_highlighted: v }))
                  }
                />
                <Label htmlFor="is_highlighted">Flagship / highlighted</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !form.title || !form.description}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
