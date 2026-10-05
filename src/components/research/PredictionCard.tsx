import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FieldPrediction } from "@/lib/types";
import { pct } from "./states";

export function ConfidenceChart({ value, size = 180 }: { value: number; size?: number }) {
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(1, value));
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-muted)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#confGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - v)}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.2,.7,.2,1)" }}
        />
        <defs>
          <linearGradient id="confGrad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="var(--color-violet)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl">{pct(v)}</span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">confidence</span>
      </div>
    </div>
  );
}

export function TopPredictions({ items }: { items: FieldPrediction[] }) {
  if (!items.length) return <p className="text-sm text-muted-foreground">No alternative predictions returned.</p>;
  const max = Math.max(...items.map((i) => i.confidence), 0.0001);
  return (
    <ul className="space-y-3">
      {items.map((p, i) => (
        <li key={p.field + i}>
          <div className="mb-1 flex justify-between text-sm">
            <span className={i === 0 ? "font-medium" : "text-muted-foreground"}>{p.field}</span>
            <span className="font-mono text-xs">{pct(p.confidence)}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div className={i === 0 ? "h-full rounded-full bg-primary" : "h-full rounded-full bg-primary/35"} style={{ width: `${(p.confidence / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function PredictionCard({ prediction, top, onExplain }: { prediction: FieldPrediction; top: FieldPrediction[]; onExplain?: () => void }) {
  return (
    <section className="surface grid gap-8 p-6 md:grid-cols-[auto_1fr_1fr] md:items-center md:p-8">
      <ConfidenceChart value={prediction.confidence} />
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-primary">Research Field Prediction</p>
        <h2 className="mt-2 font-display text-4xl leading-tight md:text-5xl">{prediction.field}</h2>
        <p className="mt-2 text-sm text-muted-foreground">Predicted from fused SciBERT text and ViT visual embeddings.</p>
        {onExplain && (
          <Button variant="outline" className="mt-5" onClick={onExplain}>
            <Lightbulb /> View Explanation
          </Button>
        )}
      </div>
      <div className="rounded-xl border bg-background p-5">
        <p className="mb-4 text-sm font-medium">Top Predictions</p>
        <TopPredictions items={top} />
      </div>
    </section>
  );
}
