import { createFileRoute } from "@tanstack/react-router";
import { CurriculumPage } from "@/components/CurriculumPage";

export const Route = createFileRoute("/curriculum/become-an-ai-engineer")({
  head: () => ({
    meta: [
      { title: "Become an AI Engineer — 10-Week Curriculum | Hooria AI" },
      {
        name: "description",
        content:
          "Week-by-week curriculum for the Become an AI Engineer Bootcamp: Generative AI, RAG, AI Agents, Automation, MLOps and a live capstone demo day.",
      },
    ],
  }),
  component: () => <CurriculumPage slug="become-an-ai-engineer" />,
});
