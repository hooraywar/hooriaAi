import { createFileRoute } from "@tanstack/react-router";
import { CurriculumPage } from "@/components/CurriculumPage";

export const Route = createFileRoute("/curriculum/$slug")({
  head: () => ({
    meta: [
      { title: "Curriculum | Hooria AI" },
      { name: "description", content: "Week-by-week program curriculum." },
    ],
  }),
  component: CurriculumDetailPage,
});

function CurriculumDetailPage() {
  const { slug } = Route.useParams();
  return <CurriculumPage slug={slug} />;
}
