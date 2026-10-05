import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { ErrorState, LoadingState } from "@/components/research/states";
import { PredictionCard } from "@/components/research/PredictionCard";
import { PaperInfo, PaperSummary } from "@/components/research/PaperDetails";
import { SHAPExplanation } from "@/components/research/SHAPExplanation";
import { FigureGallery } from "@/components/research/FigureGallery";
import { CitationList } from "@/components/research/CitationList";
import { ConferenceGrid } from "@/components/research/ConferenceCard";

const TABS = ["overview", "explanation", "figures", "citations", "conferences"] as const;
type Tab = (typeof TABS)[number];

export const Route = createFileRoute("/_app/results/$paperId")({
  validateSearch: (s: Record<string, unknown>): { tab?: Tab } => ({
    tab: TABS.includes(s.tab as Tab) ? (s.tab as Tab) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Analysis Results – ResearchAI" },
      { name: "description", content: "Research field prediction, SHAP explanation, summary, figures, citations and conference matches." },
      { property: "og:title", content: "Analysis Results – ResearchAI" },
      { property: "og:description", content: "Multimodal research paper analysis results." },
    ],
  }),
  component: ResultsPage,
});

function ResultsPage() {
  const { paperId } = Route.useParams();
  const { tab = "overview" } = Route.useSearch();
  const navigate = Route.useNavigate();
  const q = useQuery({ queryKey: ["paper", paperId], queryFn: () => api.getPaper(paperId), retry: false });

  if (q.isPending) return <LoadingState label="Loading analysis…" />;
  if (q.isError) return <ErrorState error={q.error} onRetry={() => q.refetch()} />;
  const a = q.data;
  const setTab = (t: string) => navigate({ search: { tab: t as Tab }, replace: true });

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <Button asChild variant="ghost" size="sm" className="-ml-3 mb-1 text-muted-foreground">
            <Link to="/history"><ArrowLeft /> History</Link>
          </Button>
          <h1 className="truncate font-display text-3xl md:text-4xl">{a.title}</h1>
          <p className="font-mono text-xs text-muted-foreground">ID {a.paper_id}</p>
        </div>
      </div>

      <PredictionCard prediction={a.prediction} top={a.top_predictions} onExplain={() => setTab("explanation")} />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="h-auto flex-wrap justify-start">
          <TabsTrigger value="overview">Overview & Summary</TabsTrigger>
          <TabsTrigger value="explanation">Explainable AI</TabsTrigger>
          <TabsTrigger value="figures">Figures ({a.figures.length})</TabsTrigger>
          <TabsTrigger value="citations">Citations ({a.citations.length})</TabsTrigger>
          <TabsTrigger value="conferences">Conferences</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6 grid gap-6 xl:grid-cols-2">
          <PaperInfo meta={a.metadata} fallbackTitle={a.title} />
          <PaperSummary summary={a.summary} />
        </TabsContent>
        <TabsContent value="explanation" className="mt-6">
          <SHAPExplanation shap={a.shap} prediction={a.prediction} />
        </TabsContent>
        <TabsContent value="figures" className="mt-6">
          <FigureGallery figures={a.figures} />
        </TabsContent>
        <TabsContent value="citations" className="mt-6">
          <CitationList citations={a.citations} />
        </TabsContent>
        <TabsContent value="conferences" className="mt-6">
          <ConferenceGrid items={a.conferences} error={a.conferences_error} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
