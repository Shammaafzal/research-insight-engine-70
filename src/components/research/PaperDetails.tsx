import { Check, Copy } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PaperMetadata, PaperSummaryContent } from "@/lib/types";
import { NotAvailable } from "./states";

const show = (v: ReactNode) => (v === null || v === undefined || v === "" ? <NotAvailable /> : v);

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 border-b py-3 last:border-0 sm:grid-cols-[160px_1fr]">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="text-sm">{children}</dd>
    </div>
  );
}

export function PaperInfo({ meta, fallbackTitle }: { meta: PaperMetadata; fallbackTitle: string }) {
  return (
    <section className="surface p-6 md:p-8">
      <h3 className="mb-4 text-lg font-semibold">Paper Information</h3>
      <dl>
        <Row label="Title">{show(meta.title || fallbackTitle)}</Row>
        <Row label="Authors">{show(meta.authors?.length ? meta.authors.join(", ") : null)}</Row>
        <Row label="Abstract">{show(meta.abstract && <span className="leading-relaxed text-muted-foreground">{meta.abstract}</span>)}</Row>
        <Row label="Keywords">
          {meta.keywords?.length ? (
            <div className="flex flex-wrap gap-1.5">
              {meta.keywords.map((k) => (
                <Badge key={k} variant="secondary" className="font-normal">
                  {k}
                </Badge>
              ))}
            </div>
          ) : (
            <NotAvailable />
          )}
        </Row>
        <Row label="Publication">{show([meta.publication, meta.year].filter(Boolean).join(" · ") || null)}</Row>
        {meta.doi && <Row label="DOI">{meta.doi}</Row>}
      </dl>
      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          ["Pages", meta.num_pages],
          ["Figures", meta.num_figures],
          ["References", meta.num_references],
        ].map(([l, v]) => (
          <div key={l as string} className="rounded-xl bg-muted p-4 text-center">
            <p className="font-display text-3xl">{v ?? "—"}</p>
            <p className="text-xs text-muted-foreground">{l}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function PaperSummary({ summary }: { summary: PaperSummaryContent }) {
  const [copied, setCopied] = useState(false);
  const findings = Array.isArray(summary.main_findings) ? summary.main_findings : summary.main_findings ? [summary.main_findings] : [];
  const empty = !summary.short_summary && !summary.methodology && !summary.key_contributions?.length && !findings.length;

  const copy = async () => {
    const text = [
      `Summary: ${summary.short_summary ?? "Not available"}`,
      `Key Contributions:\n${(summary.key_contributions ?? []).map((c) => `- ${c}`).join("\n") || "Not available"}`,
      `Methodology: ${summary.methodology ?? "Not available"}`,
      `Main Findings:\n${findings.map((c) => `- ${c}`).join("\n") || "Not available"}`,
      `Research Area: ${summary.research_area ?? "Not available"}`,
    ].join("\n\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Summary copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy to clipboard");
    }
  };

  return (
    <section className="surface p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold">Paper Summary</h3>
        <Button variant="outline" size="sm" onClick={copy} disabled={empty}>
          {copied ? <Check /> : <Copy />} Copy Summary
        </Button>
      </div>
      {empty ? (
        <p className="text-sm text-muted-foreground">The backend did not return a summary for this paper.</p>
      ) : (
        <div className="space-y-6">
          <Block title="Short Summary">{show(summary.short_summary && <p className="leading-relaxed">{summary.short_summary}</p>)}</Block>
          <Block title="Key Contributions"><List items={summary.key_contributions ?? []} /></Block>
          <Block title="Methodology">{show(summary.methodology && <p className="leading-relaxed text-muted-foreground">{summary.methodology}</p>)}</Block>
          <Block title="Main Findings"><List items={findings} /></Block>
          <Block title="Research Area">{show(summary.research_area && <Badge>{summary.research_area}</Badge>)}</Block>
        </div>
      )}
    </section>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">{title}</p>
      <div className="text-sm">{children}</div>
    </div>
  );
}
function List({ items }: { items: string[] }) {
  if (!items.length) return <NotAvailable />;
  return (
    <ul className="space-y-1.5">
      {items.map((c, i) => (
        <li key={i} className="flex gap-2">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          <span>{c}</span>
        </li>
      ))}
    </ul>
  );
}
