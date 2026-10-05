import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api, friendlyError } from "@/lib/api";
import { EmptyState, ErrorState, LoadingState, SectionHeader } from "@/components/research/states";
import { HistoryTable } from "@/components/research/HistoryTable";

export const Route = createFileRoute("/_app/history")({
  validateSearch: (s: Record<string, unknown>): { q?: string } => ({ q: typeof s.q === "string" ? s.q : undefined }),
  head: () => ({
    meta: [
      { title: "Analysis History – ResearchAI" },
      { name: "description", content: "Previously analyzed research papers and their predicted fields." },
      { property: "og:title", content: "Analysis History – ResearchAI" },
      { property: "og:description", content: "Browse and manage past paper analyses." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const search = Route.useSearch();
  const [q, setQ] = useState(search.q ?? "");
  const qc = useQueryClient();
  const list = useQuery({ queryKey: ["papers"], queryFn: api.listPapers, retry: false });
  const del = useMutation({
    mutationFn: api.deletePaper,
    onSuccess: () => {
      toast.success("Analysis deleted");
      qc.invalidateQueries({ queryKey: ["papers"] });
    },
    onError: (e) => toast.error(friendlyError(e).message),
  });

  const items = (list.data ?? []).filter((p) => !q || [p.title, p.predicted_field].join(" ").toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <SectionHeader eyebrow="Archive" title="History" description="All papers you've analyzed." />
      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by title or field…" className="bg-card pl-9" />
      </div>
      {list.isPending ? (
        <LoadingState />
      ) : list.isError ? (
        <ErrorState error={list.error} onRetry={() => list.refetch()} />
      ) : !list.data.length ? (
        <EmptyState title="No analyses yet" description="Upload your first paper to see it here." action={<Button asChild><Link to="/analyze">Analyze a Paper</Link></Button>} />
      ) : !items.length ? (
        <EmptyState title="No matches" description={`Nothing matches “${q}”.`} />
      ) : (
        <HistoryTable items={items} onDelete={(id) => del.mutate(id)} />
      )}
    </div>
  );
}
