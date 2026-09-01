import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/curriculum")({
  head: () => ({
    meta: [{ title: "Curriculum | Hooria AI" }],
  }),
  component: CurriculumIndexPage,
});

async function fetchDefaultSlug(): Promise<string | null> {
  const { data, error } = await supabase
    .from("curriculums")
    .select("slug")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data?.slug ?? null;
}

function CurriculumIndexPage() {
  const navigate = useNavigate();
  const { data: slug, isLoading } = useQuery({
    queryKey: ["curriculum-default-slug"],
    queryFn: fetchDefaultSlug,
  });

  useEffect(() => {
    if (slug) {
      navigate({ to: "/curriculum/$slug", params: { slug }, replace: true });
    }
  }, [slug, navigate]);

  if (isLoading || slug) {
    return (
      <div className="min-h-screen bg-background px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="h-64 rounded-2xl border border-border/60 bg-surface/50 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-sm text-center">
        <h1 className="text-xl font-bold">No curriculum available</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          There isn't a published curriculum to show right now.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 text-sm text-brand-blue hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
      </div>
    </div>
  );
}
