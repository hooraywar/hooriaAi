import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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

type Item = Tables<"portfolio_items">;
type SectionSettings = Tables<"portfolio_section_settings">;

const ICONS = [
  "Wand2",
  "Server",
  "MessagesSquare",
  "Bot",
  "Workflow",
  "Presentation",
  "Sparkles",
  "Rocket",
  "Trophy",
  "Code2",
  "Database",
  "BrainCircuit",
];

const emptyForm: TablesInsert<"portfolio_items"> = {
  title: "",
  icon: "Wand2",
  tag: "",
  sort_order: 0,
};

async function fetchItems(): Promise<Item[]> {
  const { data, error } = await supabase
    .from("portfolio_items")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

async function fetchSectionSettings(): Promise<SectionSettings | null> {
  const { data, error } = await supabase
    .from("portfolio_section_settings")
    .select("*")
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

function SectionSettingsPanel() {
  const queryClient = useQueryClient();
  const { data: settingsRow } = useQuery({
    queryKey: ["admin-portfolio-section-settings"],
    queryFn: fetchSectionSettings,
  });
  const [form, setForm] = useState({
    eyebrow: "",
    heading: "",
    subheading: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settingsRow) {
      setForm({
        eyebrow: settingsRow.eyebrow,
        heading: settingsRow.heading,
        subheading: settingsRow.subheading,
      });
    }
  }, [settingsRow]);

  function invalidate() {
    queryClient.invalidateQueries({
      queryKey: ["admin-portfolio-section-settings"],
    });
    queryClient.invalidateQueries({ queryKey: ["portfolio-section-settings"] });
  }

  async function handleSave() {
    setSaving(true);
    const { error } = settingsRow
      ? await supabase
          .from("portfolio_section_settings")
          .update(form)
          .eq("id", settingsRow.id)
      : await supabase.from("portfolio_section_settings").insert(form);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Section text saved");
    invalidate();
  }

  async function toggleVisible(value: boolean) {
    const { error } = settingsRow
      ? await supabase
          .from("portfolio_section_settings")
          .update({ is_visible: value })
          .eq("id", settingsRow.id)
      : await supabase
          .from("portfolio_section_settings")
          .insert({ is_visible: value });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(value ? "Section is now visible" : "Section is now hidden");
    invalidate();
  }

  return (
    <div className="space-y-3 rounded-xl border border-border/60 p-4">
      <div className="flex items-center justify-between">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">
          Homepage section
        </Label>
        <div className="flex items-center gap-1.5">
          <Switch
            checked={settingsRow?.is_visible ?? true}
            onCheckedChange={toggleVisible}
          />
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
            {(settingsRow?.is_visible ?? true) ? "On" : "Off"}
          </span>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="portfolio-eyebrow">Eyebrow</Label>
          <Input
            id="portfolio-eyebrow"
            value={form.eyebrow}
            onChange={(e) =>
              setForm((f) => ({ ...f, eyebrow: e.target.value }))
            }
            placeholder="What You'll Ship"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="portfolio-heading">Heading</Label>
          <Input
            id="portfolio-heading"
            value={form.heading}
            onChange={(e) =>
              setForm((f) => ({ ...f, heading: e.target.value }))
            }
            placeholder="6 portfolio projects that get you hired"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="portfolio-subheading">Subheading</Label>
        <Textarea
          id="portfolio-subheading"
          value={form.subheading}
          onChange={(e) =>
            setForm((f) => ({ ...f, subheading: e.target.value }))
          }
          placeholder="These aren't tutorials. You'll deploy real code, on real infrastructure, with your name on it."
        />
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save section text"}
        </Button>
      </div>
    </div>
  );
}

export function PortfolioManager() {
  const queryClient = useQueryClient();
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-portfolio-items"],
    queryFn: fetchItems,
  });

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TablesInsert<"portfolio_items">>(emptyForm);
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(item: Item) {
    setEditingId(item.id);
    setForm(item);
    setOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    const { error } = editingId
      ? await supabase.from("portfolio_items").update(form).eq("id", editingId)
      : await supabase.from("portfolio_items").insert(form);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(editingId ? "Item updated" : "Item created");
    setOpen(false);
    queryClient.invalidateQueries({ queryKey: ["admin-portfolio-items"] });
    queryClient.invalidateQueries({ queryKey: ["portfolio-items"] });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this portfolio item?")) return;
    const { error } = await supabase
      .from("portfolio_items")
      .delete()
      .eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Item deleted");
    queryClient.invalidateQueries({ queryKey: ["admin-portfolio-items"] });
    queryClient.invalidateQueries({ queryKey: ["portfolio-items"] });
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        The "What You'll Ship" portfolio section on the homepage — heading text,
        visibility, and cards.
      </p>

      <SectionSettingsPanel />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Portfolio cards.</p>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" /> New Item
        </Button>
      </div>

      <div className="rounded-lg border border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead>Tag</TableHead>
              <TableHead>Order</TableHead>
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
            {!isLoading && items.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  No items yet.
                </TableCell>
              </TableRow>
            )}
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.icon}</TableCell>
                <TableCell>{item.tag}</TableCell>
                <TableCell>{item.sort_order}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.id)}
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
            <DialogTitle>{editingId ? "Edit Item" : "New Item"}</DialogTitle>
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
                <Label htmlFor="tag">Tag</Label>
                <Input
                  id="tag"
                  value={form.tag}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, tag: e.target.value }))
                  }
                  placeholder="Week 2"
                />
              </div>
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
            <Button onClick={handleSave} disabled={saving || !form.title}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
