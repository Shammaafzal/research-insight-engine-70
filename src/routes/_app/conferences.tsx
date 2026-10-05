import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/lib/api";
import { RESEARCH_FIELDS } from "@/lib/types";
import { ErrorState, LoadingState, SectionHeader } from "@/components/research/states";
import { ConferenceGrid } from "@/components/research/ConferenceCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/conferences")({
  head: () => ({
    meta: [
      { title: "Conference Recommendations – ResearchAI" },
      { name: "description", content: "Find suitable academic conferences for your research field." },
      { property: "og:title", content: "Conference Recommendations – ResearchAI" },
      { property: "og:description", content: "Venue recommendations matched to research fields." },
    ],
  }),
  component: ConferencesPage,
});

function ConferencesPage() {
  const [field, setField] = useState<string | undefined>();
  const q = useQuery({ queryKey: ["conferences", field], queryFn: () => api.getConferences({ field }), retry: false });

  return (
    <div>
      <SectionHeader
        eyebrow="Venues"
        title="Conference Recommendations"
        description="For paper-specific match scores, open an analysis and view its Conferences tab. Deadlines and locations are shown only when provided by the backend."
      />
      <div className="mb-6 flex flex-wrap gap-2">
        {[undefined, ...RESEARCH_FIELDS].map((f) => (
          <button
            key={f ?? "all"}
            onClick={() => setField(f)}
            className={cn("rounded-full border px-3.5 py-1.5 text-sm transition-colors", field === f ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted")}
          >
            {f ?? "All fields"}
          </button>
        ))}
      </div>
      {q.isPending ? (
        <LoadingState label="Fetching conferences…" />
      ) : q.isError ? (
        <ErrorState error={q.error} title="Conference information could not be retrieved" onRetry={() => q.refetch()} />
      ) : (
        <ConferenceGrid items={q.data} />
      )}
    </div>
  );
}
