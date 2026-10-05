import { Check, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export const PROCESSING_STAGES = [
  "Reading PDF",
  "Extracting text",
  "Extracting figures",
  "Generating SciBERT embeddings",
  "Generating ViT embeddings",
  "Fusing multimodal features",
  "Classifying research field",
  "Generating explanation",
];

/**
 * Stage display. The backend runs as one request, so stages advance as an
 * indicator of the pipeline; the final stage only completes once the API responds.
 */
export function ProcessingStatus({ current, fileName, uploadPct }: { current: number; fileName?: string; uploadPct: number }) {
  const done = Math.min(current, PROCESSING_STAGES.length);
  const progress = Math.round((done / PROCESSING_STAGES.length) * 100);
  return (
    <div className="surface mx-auto max-w-2xl p-6 md:p-10 animate-fade-up">
      <div className="flex items-center gap-3">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
        </span>
        <h2 className="font-display text-2xl md:text-3xl">Analyzing Research Paper…</h2>
      </div>
      {fileName && <p className="mt-1 truncate pl-6 font-mono text-xs text-muted-foreground">{fileName}</p>}

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-xs text-muted-foreground">
          <span>{uploadPct < 100 ? `Uploading… ${uploadPct}%` : "PDF received"}</span>
          <span className="font-mono">{progress}%</span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      <ol className="mt-8 space-y-1">
        {PROCESSING_STAGES.map((s, i) => {
          const state = i < current ? "done" : i === current ? "active" : "pending";
          return (
            <li key={s} className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors", state === "active" && "bg-accent/60")}>
              <span
                className={cn(
                  "grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs",
                  state === "done" && "border-success bg-success text-primary-foreground",
                  state === "active" && "border-primary text-primary",
                  state === "pending" && "text-muted-foreground",
                )}
              >
                {state === "done" ? <Check className="h-3.5 w-3.5" /> : state === "active" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : i + 1}
              </span>
              <span className={cn("text-sm", state === "pending" ? "text-muted-foreground" : "text-foreground", state === "active" && "font-medium")}>{s}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
