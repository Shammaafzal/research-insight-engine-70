import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FileStack, Gauge, Layers, Trophy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { EmptyState, ErrorState, LoadingState, SectionHeader, pct } from "@/components/research/states";
import { FieldDistributionChart, FieldShareChart } from "@/components/research/DashboardCharts";
import { HistoryTable } from "@/components/research/HistoryTable";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard – ResearchAI" },
      { name: "description", content: "Overview of analyzed papers, field distribution and classification confidence." },
      { property: "og:title", content: "Dashboard – ResearchAI" },
      { property: "og:description", content: "Research paper analytics at a glance." },
    ],
  }),
  component: Dashboard,
});

function Stat({ icon: Icon, label, value }: { icon: typeof Gauge; label: string; value: string | number }) {
  return (
    <div className="surface p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <p className="mt-3 truncate font-display text-4xl">{value}</p>
    </div>
  );
}

function Dashboard() {
  const list = useQuery({ queryKey: ["papers"], queryFn: api.listPapers, retry: false });
  const head = <SectionHeader eyebrow="Overview" title="Dashboard" action={<Button asChild><Link to="/analyze">Analyze a Paper <ArrowRight /></Link></Button>} />;

  if (list.isPending) return <>{head}<LoadingState /></>;
  if (list.isError) return <>{head}<ErrorState error={list.error} onRetry={() => list.refetch()} /></>;

  const papers = list.data;
  if (!papers.length)
    return <>{head}<EmptyState title="No papers analyzed yet" description="Statistics will appear here once you analyze your first paper." action={<Button asChild><Link to="/analyze">Analyze a Paper</Link></Button>} /></>;

  const counts = new Map<string, number>();
  papers.forEach((p) => p.predicted_field && counts.set(p.predicted_field, (counts.get(p.predicted_field) ?? 0) + 1));
  const dist = [...counts].map(([field, count]) => ({ field, count })).sort((a, b) => b.count - a.count);
  const confs = papers.map((p) => p.confidence).filter((c): c is number => c != null);
  const avg = confs.length ? confs.reduce((a, b) => a + b, 0) / confs.length : null;

  return (
    <div className="space-y-6">
      {head}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={FileStack} label="Total Papers Analyzed" value={papers.length} />
        <Stat icon={Gauge} label="Average Confidence" value={pct(avg)} />
        <Stat icon={Trophy} label="Most Common Field" value={dist[0]?.field ?? "—"} />
        <Stat icon={Layers} label="Distinct Fields" value={dist.length} />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="surface p-6 lg:col-span-2">
          <p className="mb-4 font-medium">Research Field Distribution</p>
          <FieldDistributionChart data={dist} />
        </div>
        <div className="surface p-6">
          <p className="mb-4 font-medium">Most Common Research Fields</p>
          <FieldShareChart data={dist} />
        </div>
      </div>
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="font-medium">Recent Analyses</p>
          <Button asChild variant="link" size="sm"><Link to="/history">View all</Link></Button>
        </div>
        <HistoryTable items={papers.slice(0, 5)} compact />
      </div>
    </div>
  );
}
