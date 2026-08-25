import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type Instructor = Tables<"instructor">;
type Highlight = { icon: string; title: string; desc: string };
type Stat = { value: string; label: string };

const ICONS = [
  "Cpu",
  "Bot",
  "Boxes",
  "GraduationCap",
  "Sparkles",
  "Rocket",
  "BookOpen",
  "Zap",
  "Users",
  "Workflow",
  "Trophy",
  "BrainCircuit",
  "Code2",
  "Database",
  "MessagesSquare",
];

type FormState = {
  name: string;
  role: string;
  bio: string;
  image_url: string;
  linkedin_url: string;
  highlights: Highlight[];
  stats: Stat[];
  stack: string[];
};

const emptyForm: FormState = {
  name: "",
  role: "",
  bio: "",
  image_url: "",
  linkedin_url: "",
  highlights: [],
  stats: [],
  stack: [],
};

async function fetchInstructor(): Promise<Instructor | null> {
  const { data, error } = await supabase
    .from("instructor")
    .select("*")
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

function toFormState(row: Instructor | null): FormState {
  if (!row) return emptyForm;
  return {
    name: row.name,
    role: row.role,
    bio: row.bio,
    image_url: row.image_url,
    linkedin_url: row.linkedin_url,
    highlights: Array.isArray(row.highlights)
      ? (row.highlights as unknown as Highlight[])
      : [],
    stats: Array.isArray(row.stats) ? (row.stats as unknown as Stat[]) : [],
    stack: Array.isArray(row.stack) ? (row.stack as unknown as string[]) : [],
  };
}

export function InstructorManager() {
  const queryClient = useQueryClient();
  const { data: row, isLoading } = useQuery({
    queryKey: ["admin-instructor"],
    queryFn: fetchInstructor,
  });

  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [newStackTag, setNewStackTag] = useState("");

  useEffect(() => {
    if (row !== undefined) setForm(toFormState(row ?? null));
  }, [row]);

  async function handleSave() {
    setSaving(true);
    const payload = {
      name: form.name,
      role: form.role,
      bio: form.bio,
      image_url: form.image_url,
      linkedin_url: form.linkedin_url,
      highlights: form.highlights,
      stats: form.stats,
      stack: form.stack,
    };
    const { error } = row
      ? await supabase.from("instructor").update(payload).eq("id", row.id)
      : await supabase.from("instructor").insert(payload);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Instructor profile saved");
    queryClient.invalidateQueries({ queryKey: ["admin-instructor"] });
    queryClient.invalidateQueries({ queryKey: ["instructor"] });
  }

  function updateHighlight(index: number, patch: Partial<Highlight>) {
    setForm((f) => ({
      ...f,
      highlights: f.highlights.map((h, i) =>
        i === index ? { ...h, ...patch } : h,
      ),
    }));
  }

  function addHighlight() {
    setForm((f) => ({
      ...f,
      highlights: [...f.highlights, { icon: "Sparkles", title: "", desc: "" }],
    }));
  }

  function removeHighlight(index: number) {
    setForm((f) => ({
      ...f,
      highlights: f.highlights.filter((_, i) => i !== index),
    }));
  }

  function updateStat(index: number, patch: Partial<Stat>) {
    setForm((f) => ({
      ...f,
      stats: f.stats.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    }));
  }

  function addStat() {
    setForm((f) => ({ ...f, stats: [...f.stats, { value: "", label: "" }] }));
  }

  function removeStat(index: number) {
    setForm((f) => ({ ...f, stats: f.stats.filter((_, i) => i !== index) }));
  }

  function addStackTag() {
    const tag = newStackTag.trim();
    if (!tag) return;
    setForm((f) => ({ ...f, stack: [...f.stack, tag] }));
    setNewStackTag("");
  }

  function removeStackTag(index: number) {
    setForm((f) => ({ ...f, stack: f.stack.filter((_, i) => i !== index) }));
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <p className="text-sm text-muted-foreground">
        The Instructor section on the homepage. There's only one profile.
      </p>

      <div className="rounded-2xl border border-border/60 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              value={form.image_url}
              onChange={(e) =>
                setForm((f) => ({ ...f, image_url: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="linkedin_url">LinkedIn URL</Label>
            <Input
              id="linkedin_url"
              value={form.linkedin_url}
              onChange={(e) =>
                setForm((f) => ({ ...f, linkedin_url: e.target.value }))
              }
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 p-6 space-y-3">
        <div className="flex items-center justify-between">
          <Label>Highlight cards</Label>
          <Button variant="outline" size="sm" onClick={addHighlight}>
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
        {form.highlights.map((h, i) => (
          <div
            key={i}
            className="grid grid-cols-[120px_1fr_1fr_auto] gap-2 items-start"
          >
            <Select
              value={h.icon}
              onValueChange={(v) => updateHighlight(i, { icon: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ICONS.map((icon) => (
                  <SelectItem key={icon} value={icon}>
                    {icon}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={h.title}
              placeholder="Title"
              onChange={(e) => updateHighlight(i, { title: e.target.value })}
            />
            <Input
              value={h.desc}
              placeholder="Description"
              onChange={(e) => updateHighlight(i, { desc: e.target.value })}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeHighlight(i)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border/60 p-6 space-y-3">
        <div className="flex items-center justify-between">
          <Label>Stats</Label>
          <Button variant="outline" size="sm" onClick={addStat}>
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
        {form.stats.map((s, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_2fr_auto] gap-2 items-start"
          >
            <Input
              value={s.value}
              placeholder="1+"
              onChange={(e) => updateStat(i, { value: e.target.value })}
            />
            <Input
              value={s.label}
              placeholder="Year in Industry"
              onChange={(e) => updateStat(i, { label: e.target.value })}
            />
            <Button variant="ghost" size="icon" onClick={() => removeStat(i)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border/60 p-6 space-y-3">
        <Label>Tech stack tags</Label>
        <div className="flex flex-wrap gap-2">
          {form.stack.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-3 py-1 text-xs"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeStackTag(i)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newStackTag}
            placeholder="Add a tag"
            onChange={(e) => setNewStackTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addStackTag();
              }
            }}
          />
          <Button variant="outline" onClick={addStackTag}>
            Add
          </Button>
        </div>
      </div>

      <Button
        onClick={handleSave}
        disabled={saving || !form.name || !form.role}
      >
        {saving ? "Saving..." : "Save profile"}
      </Button>
    </div>
  );
}
