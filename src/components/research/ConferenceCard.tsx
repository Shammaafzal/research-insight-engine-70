import { CalendarClock, CalendarDays, ExternalLink, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Conference } from "@/lib/types";
import { pct } from "./states";

const Missing = () => <span className="italic text-muted-foreground">Not provided</span>;

export function ConferenceCard({ c }: { c: Conference }) {
  return (
    <article className="surface flex flex-col p-6 transition-shadow hover:shadow-lift">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-3xl">{c.name}</h3>
          {c.field && <Badge variant="secondary" className="mt-2 font-normal">{c.field}</Badge>}
        </div>
        {c.match_score != null && (
          <div className="text-right">
            <p className="font-display text-3xl text-primary">{pct(c.match_score, 0)}</p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">match</p>
          </div>
        )}
      </div>
      {c.match_score != null && (
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-gradient-to-r from-primary to-violet" style={{ width: `${c.match_score * 100}%` }} />
        </div>
      )}
      <p className="mt-4 text-sm text-muted-foreground">{c.description || "No description provided."}</p>
      <dl className="mt-5 space-y-2 text-sm">
        <div className="flex items-center gap-2"><CalendarClock className="h-4 w-4 text-muted-foreground" /><dt className="w-24 text-muted-foreground">Deadline</dt><dd>{c.deadline || <Missing />}</dd></div>
        <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-muted-foreground" /><dt className="w-24 text-muted-foreground">Dates</dt><dd>{c.conference_date || <Missing />}</dd></div>
        <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /><dt className="w-24 text-muted-foreground">Location</dt><dd>{c.location || <Missing />}</dd></div>
      </dl>
      <div className="mt-auto pt-6">
        {c.url ? (
          <Button asChild variant="outline" className="w-full">
            <a href={c.url} target="_blank" rel="noreferrer">
              Official Conference Website <ExternalLink />
            </a>
          </Button>
        ) : (
          <p className="text-center text-xs text-muted-foreground">Official website not provided</p>
        )}
      </div>
    </article>
  );
}

export function ConferenceGrid({ items, error }: { items: Conference[]; error?: string | null }) {
  if (error || !items.length)
    return (
      <div className="rounded-xl border border-dashed p-10 text-center">
        <p className="font-medium">Conference information could not be retrieved</p>
        <p className="mt-1 text-sm text-muted-foreground">{error || "Live conference data is currently unavailable. Please check back later."}</p>
      </div>
    );
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {[...items].sort((a, b) => (b.match_score ?? 0) - (a.match_score ?? 0)).map((c, i) => (
        <ConferenceCard key={c.name + i} c={c} />
      ))}
    </div>
  );
}
