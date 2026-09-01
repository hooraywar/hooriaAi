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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
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
  is_active: true,
  is_coming_soon: false,
  discount_percentage: 0,
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

  const [discountTargetIds, setDiscountTargetIds] = useState<string[]>([]);
  const [discountPercent, setDiscountPercent] = useState("");
  const [applyingDiscount, setApplyingDiscount] = useState(false);

  function toggleDiscountTarget(id: string) {
    setDiscountTargetIds((ids) =>
      ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id],
    );
  }

  async function handleApplyDiscount() {
    const pct = Number(discountPercent);
    if (discountTargetIds.length === 0) {
      toast.error("Select at least one program");
      return;
    }
    if (!Number.isFinite(pct) || pct < 0 || pct > 100) {
      toast.error("Enter a discount percentage between 0 and 100");
      return;
    }
    setApplyingDiscount(true);
    const { error } = await supabase
      .from("services")
      .update({ discount_percentage: pct })
      .in("id", discountTargetIds);
    setApplyingDiscount(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(
      `${pct}% discount applied to ${discountTargetIds.length} program${discountTargetIds.length === 1 ? "" : "s"}`,
    );
    setDiscountTargetIds([]);
    setDiscountPercent("");
    queryClient.invalidateQueries({ queryKey: ["admin-services"] });
    queryClient.invalidateQueries({ queryKey: ["services"] });
  }

  async function toggleActive(service: Service, value: boolean) {
    const { error } = await supabase
      .from("services")
      .update({ is_active: value })
      .eq("id", service.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(value ? "Program is now available" : "Program is now off");
    queryClient.invalidateQueries({ queryKey: ["admin-services"] });
    queryClient.invalidateQueries({ queryKey: ["services"] });
  }

  async function toggleComingSoon(service: Service, value: boolean) {
    const { error } = await supabase
      .from("services")
      .update({ is_coming_soon: value })
      .eq("id", service.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["admin-services"] });
    queryClient.invalidateQueries({ queryKey: ["services"] });
  }

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

      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border/60 p-4">
        <div className="space-y-1.5">
          <Label>Apply discount to programs</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-64 justify-start">
                {discountTargetIds.length === 0
                  ? "Select programs..."
                  : `${discountTargetIds.length} program${discountTargetIds.length === 1 ? "" : "s"} selected`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2">
              <div className="max-h-64 space-y-1 overflow-y-auto">
                {services.length === 0 && (
                  <p className="px-2 py-1.5 text-sm text-muted-foreground">
                    No programs yet.
                  </p>
                )}
                {services.map((s) => (
                  <label
                    key={s.id}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-surface/80"
                  >
                    <Checkbox
                      checked={discountTargetIds.includes(s.id)}
                      onCheckedChange={() => toggleDiscountTarget(s.id)}
                    />
                    {s.title}
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="discount_percent">Discount %</Label>
          <Input
            id="discount_percent"
            type="number"
            min={0}
            max={100}
            className="w-28"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
            placeholder="e.g. 20"
          />
        </div>
        <Button
          onClick={handleApplyDiscount}
          disabled={applyingDiscount || !discountPercent}
        >
          {applyingDiscount ? "Applying..." : "Apply discount"}
        </Button>
      </div>

      <div className="rounded-lg border border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Coming soon</TableHead>
              <TableHead>Highlighted</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center text-muted-foreground"
                >
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {!isLoading && services.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
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
                <TableCell>
                  {s.discount_percentage > 0 ? (
                    <Badge variant="secondary">
                      {s.discount_percentage}% off
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={s.is_active}
                    onCheckedChange={(v) => toggleActive(s, v)}
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={s.is_coming_soon}
                    onCheckedChange={(v) => toggleComingSoon(s, v)}
                  />
                </TableCell>
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
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Switch
                  id="is_active"
                  checked={form.is_active ?? true}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, is_active: v }))
                  }
                />
                <Label htmlFor="is_active">Available (on/off)</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="is_coming_soon"
                  checked={form.is_coming_soon ?? false}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, is_coming_soon: v }))
                  }
                />
                <Label htmlFor="is_coming_soon">Coming soon</Label>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="discount_percentage">Discount %</Label>
              <Input
                id="discount_percentage"
                type="number"
                min={0}
                max={100}
                className="w-32"
                value={form.discount_percentage ?? 0}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    discount_percentage: Number(e.target.value),
                  }))
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
