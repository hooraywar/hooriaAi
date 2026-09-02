import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/curriculum")({
  head: () => ({
    meta: [{ title: "Curriculum | Hooria AI" }],
  }),
  component: CurriculumLayout,
});

function CurriculumLayout() {
  return <Outlet />;
}
