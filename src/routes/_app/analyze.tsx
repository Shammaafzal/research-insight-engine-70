import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PDFUploader } from "@/components/research/PDFUploader";
import { PROCESSING_STAGES, ProcessingStatus } from "@/components/research/ProcessingStatus";
import { ErrorState, SectionHeader } from "@/components/research/states";
import { api, friendlyError, validatePdf, type ApiError } from "@/lib/api";

export const Route = createFileRoute("/_app/analyze")({
  head: () => ({
    meta: [
      { title: "Analyze a Paper – ResearchAI" },
      { name: "description", content: "Upload a research paper PDF for multimodal classification and SHAP explanation." },
      { property: "og:title", content: "Analyze a Paper – ResearchAI" },
      { property: "og:description", content: "Upload a PDF and let SciBERT + ViT classify it." },
    ],
  }),
  component: AnalyzePage,
});

type Phase = "idle" | "processing" | "error";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [stage, setStage] = useState(0);
  const [upload, setUpload] = useState(0);
  const [error, setError] = useState<ApiError | null>(null);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);
  const navigate = useNavigate();
  const qc = useQueryClient();

  useEffect(() => () => clearInterval(timer.current), []);

  const select = async (f: File | null) => {
    setError(null);
    if (!f) return setFile(null);
    try {
      await validatePdf(f);
      setFile(f);
    } catch (e) {
      setFile(null);
      setError(friendlyError(e));
    }
  };

  const run = async () => {
    if (!file) return;
    setPhase("processing");
    setStage(0);
    setUpload(0);
    setError(null);
    // Visual pipeline indicator: advances but holds before the last stage until the API responds.
    timer.current = setInterval(() => setStage((s) => Math.min(s + 1, PROCESSING_STAGES.length - 1)), 1500);
    try {
      const result = await api.analyzePaper(file, setUpload);
      clearInterval(timer.current);
      for (let s = 0; s <= PROCESSING_STAGES.length; s++) {
        setStage((cur) => Math.max(cur, s));
        await sleep(180);
      }
      qc.setQueryData(["paper", result.paper_id], result);
      qc.invalidateQueries({ queryKey: ["papers"] });
      await sleep(400);
      navigate({ to: "/results/$paperId", params: { paperId: result.paper_id } });
    } catch (e) {
      clearInterval(timer.current);
      setError(friendlyError(e));
      setPhase("error");
    }
  };

  if (phase === "processing") return <ProcessingStatus current={stage} uploadPct={upload} fileName={file?.name} />;

  return (
    <div className="mx-auto max-w-3xl">
      <SectionHeader eyebrow="New analysis" title="Analyze Paper" description="Upload a scientific paper. We'll extract its text and figures, classify the research field, and explain the prediction." />
      {phase === "error" && error ? (
        <ErrorState error={error} title="Analysis failed" onRetry={() => setPhase("idle")} />
      ) : (
        <>
          <PDFUploader file={file} onSelect={select} />
          {error && <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error.message}</p>}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4" /> Your PDF is sent only to the configured analysis server.
            </p>
            <Button size="lg" disabled={!file} onClick={run}>
              Start Analysis <ArrowRight />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
