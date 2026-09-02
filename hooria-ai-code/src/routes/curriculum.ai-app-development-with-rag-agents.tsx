import { createFileRoute } from "@tanstack/react-router";
import { CurriculumPage } from "@/components/CurriculumPage";

export const Route = createFileRoute(
  "/curriculum/ai-app-development-with-rag-agents",
)({
  head: () => ({
    meta: [
      { title: "AI App Development with RAG & Agents | Hooria AI" },
      {
        name: "description",
        content:
          "Go from prompting to building. Learn embeddings, RAG pipelines, and your first AI agent, then add memory and ship a live, deployed app.",
      },
    ],
  }),
  component: () => <CurriculumPage slug="ai-app-development-with-rag-agents" />,
});
