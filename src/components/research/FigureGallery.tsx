import { ImageOff, Images } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { ExtractedFigure } from "@/lib/types";
import { resolveAssetUrl } from "@/lib/api";
import { EmptyState } from "./states";

const src = (f: ExtractedFigure) => (f.image_base64 ? (f.image_base64.startsWith("data:") ? f.image_base64 : `data:image/png;base64,${f.image_base64}`) : resolveAssetUrl(f.image_url));

function StatusBadge({ s }: { s?: string | null }) {
  if (!s) return <Badge variant="outline">Status unknown</Badge>;
  const ok = s === "processed";
  return <Badge variant={ok ? "secondary" : "outline"} className={ok ? "text-success" : s === "failed" ? "text-destructive" : ""}>ViT: {s}</Badge>;
}

export function FigureGallery({ figures }: { figures: ExtractedFigure[] }) {
  const [open, setOpen] = useState<ExtractedFigure | null>(null);
  if (!figures.length) return <EmptyState icon={<Images className="h-5 w-5" />} title="No figures extracted" description="The backend did not return any figures for this paper." />;

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {figures.map((f, i) => {
          const url = src(f);
          return (
            <button key={f.id ?? i} onClick={() => setOpen(f)} className="surface group overflow-hidden text-left transition-shadow hover:shadow-lift">
              <div className="grid aspect-[4/3] place-items-center overflow-hidden border-b bg-muted">
                {url ? (
                  <img src={url} alt={f.caption ?? `Figure ${f.number ?? i + 1}`} className="h-full w-full object-contain transition-transform group-hover:scale-[1.02]" loading="lazy" />
                ) : (
                  <ImageOff className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div className="space-y-2 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">Figure {f.number ?? i + 1}</p>
                  <StatusBadge s={f.embedding_status} />
                </div>
                <p className="line-clamp-2 text-sm text-muted-foreground">{f.caption || "No caption available"}</p>
              </div>
            </button>
          );
        })}
      </div>
      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-4xl">
          {open && (
            <>
              <DialogTitle>Figure {open.number}</DialogTitle>
              <DialogDescription>{open.caption || "No caption available"}</DialogDescription>
              <div className="grid min-h-64 place-items-center rounded-lg bg-muted">
                {src(open) ? <img src={src(open)!} alt={open.caption ?? ""} className="max-h-[65vh] object-contain" /> : <ImageOff className="h-10 w-10 text-muted-foreground" />}
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <StatusBadge s={open.embedding_status} />
                {open.page != null && <Badge variant="outline">Page {open.page}</Badge>}
                {Object.entries(open.visual_info ?? {}).map(([k, v]) => (
                  <Badge key={k} variant="outline">
                    {k}: {String(v)}
                  </Badge>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
