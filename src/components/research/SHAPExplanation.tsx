import { Info } from "lucide-react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { FieldPrediction, ShapExplanation } from "@/lib/types";
import { EmptyState, pct } from "./states";
import { Badge } from "@/components/ui/badge";

export function SHAPExplanation({ shap, prediction }: { shap: ShapExplanation; prediction: FieldPrediction }) {
  const features = [...(shap.features ?? [])].sort((a, b) => Math.abs(b.value) - Math.abs(a.value)).slice(0, 12);
  const positive = features.filter((f) => f.value > 0);
  const max = Math.max(...features.map((f) => Math.abs(f.value)), 0.0001);

  return (
    <div className="space-y-6">
      <div className="surface p-6 md:p-8">
        <h2 className="font-display text-3xl">Why did the model make this prediction?</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          SHAP helps identify the words and features that contributed most to the model's prediction.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <Badge variant="secondary">Prediction: {prediction.field}</Badge>
          <Badge variant="secondary">Model confidence: {pct(prediction.confidence)}</Badge>
          {shap.base_value != null && <Badge variant="outline">Base value: {shap.base_value.toFixed(3)}</Badge>}
        </div>
      </div>

      {!features.length ? (
        <EmptyState title="No SHAP values returned" description="The backend did not include an explanation for this analysis." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="surface p-6 lg:col-span-3">
            <p className="mb-4 text-sm font-medium">Feature Importance</p>
            <div style={{ height: Math.max(220, features.length * 34) }}>
              <ResponsiveContainer>
                <BarChart data={features} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <XAxis type="number" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                  <YAxis type="category" dataKey="feature" width={150} tick={{ fontSize: 12 }} stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    cursor={{ fill: "var(--color-muted)" }}
                    contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", fontSize: 12 }}
                    formatter={(v: number) => v.toFixed(4)}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {features.map((f) => (
                      <Cell key={f.feature} fill={f.value >= 0 ? "var(--color-primary)" : "var(--color-destructive)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Blue bars push toward the predicted field; red bars push away.</p>
          </div>

          <div className="surface p-6 lg:col-span-2">
            <p className="mb-4 text-sm font-medium">Top contributing words</p>
            <ul className="space-y-2.5">
              {positive.slice(0, 8).map((f) => (
                <li key={f.feature} className="flex items-center gap-3">
                  <span className="w-36 truncate font-mono text-xs">{f.feature}</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <span className="block h-full rounded-full bg-gradient-to-r from-primary to-violet" style={{ width: `${(f.value / max) * 100}%` }} />
                  </span>
                  {f.modality && <span className="font-mono text-[10px] uppercase text-muted-foreground">{f.modality}</span>}
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-lg bg-muted p-4 text-sm">
              <p className="mb-1 font-medium">Explanation</p>
              <p className="text-muted-foreground">{shap.explanation || "No textual explanation was returned by the backend."}</p>
            </div>
          </div>
        </div>
      )}

      <p className="flex items-start gap-2 rounded-lg border bg-card p-4 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        SHAP explanations describe model behavior and should be interpreted as supporting information rather than absolute reasoning.
      </p>
    </div>
  );
}
