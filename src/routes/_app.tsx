import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/research/AppShell";

export const Route = createFileRoute("/_app")({
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
});
