import { FileText, UploadCloud, X } from "lucide-react";
import { useRef, useState, type DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { MAX_UPLOAD_MB } from "@/lib/config";
import { cn } from "@/lib/utils";

interface Props {
  file: File | null;
  onSelect: (file: File | null) => void;
  disabled?: boolean;
}

export function PDFUploader({ file, onSelect, disabled }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDrag(false);
    if (disabled) return;
    const f = e.dataTransfer.files?.[0];
    if (f) onSelect(f);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-card px-6 py-14 text-center transition-all",
        drag ? "border-primary bg-accent/60 shadow-lift" : "border-border hover:border-primary/40",
        disabled && "pointer-events-none opacity-60",
      )}
    >
      <input
        ref={input}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(e) => {
          onSelect(e.target.files?.[0] ?? null);
          e.target.value = "";
        }}
      />
      <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-accent text-primary">
        {file ? <FileText className="h-8 w-8" /> : <UploadCloud className="h-8 w-8" />}
      </div>
      <h2 className="font-display text-2xl md:text-3xl">Upload your research paper</h2>
      <p className="mt-2 text-sm text-muted-foreground">Drag and drop a PDF here, or browse your files</p>
      <Button className="mt-6" onClick={() => input.current?.click()}>
        Browse Files
      </Button>
      <p className="mt-4 font-mono text-xs text-muted-foreground">Supported format: PDF · Maximum size: {MAX_UPLOAD_MB} MB</p>

      {file && (
        <div className="mt-6 flex w-full max-w-md items-center gap-3 rounded-xl border bg-background px-4 py-3 text-left animate-fade-up">
          <FileText className="h-5 w-5 shrink-0 text-destructive" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onSelect(null)} aria-label="Remove file">
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
