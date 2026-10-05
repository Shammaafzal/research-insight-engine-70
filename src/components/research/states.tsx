import { AlertTriangle, Inbox, Loader2, ServerOff, FlaskConical } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api";
import { useMockMode } from "@/hooks/use-mock-mode";

export function ErrorState({ error, onRetry, title }: { error: unknown; onRetry?: () => void; title?: string }) {
  const e = error instanceof ApiError ? error : new ApiError("unknown");
  const Icon = e.kind === "unavailable" ? ServerOff : AlertTriangle;
  return (
    <div className="surface flex flex-col items-center px-6 py-12 text-center">
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-destructive/10 text-destructive">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold">{title ?? (e.kind === "unavailable" ? "Backend unavailable" : "Something went wrong")}</h3>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{e.message}</p>
      {onRetry && (
        <Button variant="outline" className="mt-5" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export function EmptyState({ icon, title, description, action }: { icon?: ReactNode; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed px-6 py-12 text-center">
      <div className="mb-3 grid h-11 w-11 place-items-center rounded-full bg-muted text-muted-foreground">{icon ?? <Inbox className="h-5 w-5" />}</div>
      <h3 className="font-medium">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" /> {label}
    </div>
  );
}

export function NotAvailable() {
  return <span className="italic text-muted-foreground">Not available</span>;
}

export function MockBanner() {
  const on = useMockMode();
  if (!on) return null;
  return (
    <div className="flex items-center justify-center gap-2 border-b border-warning/40 bg-warning/15 px-4 py-1.5 text-xs font-medium text-foreground">
      <FlaskConical className="h-3.5 w-3.5" />
      MOCK MODE — showing demo data, not real model output. Disable in the profile menu.
    </div>
  );
}

export function SectionHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="mb-1 font-mono text-xs uppercase tracking-widest text-primary">{eyebrow}</p>}
        <h1 className="font-display text-3xl md:text-4xl">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export const pct = (v?: number | null, d = 1) => (v == null || Number.isNaN(v) ? "—" : `${(v * 100).toFixed(d)}%`);
