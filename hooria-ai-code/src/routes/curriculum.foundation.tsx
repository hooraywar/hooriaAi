import { createFileRoute } from "@tanstack/react-router";
import { CurriculumPage } from "@/components/CurriculumPage";

export const Route = createFileRoute("/curriculum/foundation")({
  head: () => ({
    meta: [
      { title: "AI Foundations + Prompt Engineering | Hooria AI" },
      {
        name: "description",
        content:
          "Master prompt engineering, LLM APIs, and the fundamentals every AI engineer needs before building agents.",
      },
    ],
  }),
  component: () => <CurriculumPage slug="foundation" />,
});
