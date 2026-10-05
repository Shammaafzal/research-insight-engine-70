import { Quote, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Citation } from "@/lib/types";
import { EmptyState, NotAvailable } from "./states";

const authorsOf = (c: Citation) => (Array.isArray(c.authors) ? c.authors.join(", ") : c.authors ?? "");

export function CitationList({ citations }: { citations: Citation[] }) {
  const [q, setQ] = useState("");
  const [year, setYear] = useState("all");
  const years = useMemo(() => [...new Set(citations.map((c) => c.year).filter(Boolean).map(String))].sort().reverse(), [citations]);
  const rows = useMemo(() => {
    const s = q.toLowerCase();
    return citations.filter(
      (c) => (year === "all" || String(c.year) === year) && (!s || [c.title, authorsOf(c), c.venue, c.raw, c.year].join(" ").toLowerCase().includes(s)),
    );
  }, [citations, q, year]);

  if (!citations.length) return <EmptyState icon={<Quote className="h-5 w-5" />} title="No citations extracted" description="The backend did not return references for this paper." />;

  return (
    <div className="surface overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 border-b p-4">
        <div className="relative min-w-52 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title, author, venue…" className="pl-9" />
        </div>
        <select value={year} onChange={(e) => setYear(e.target.value)} className="h-9 rounded-md border bg-card px-3 text-sm" aria-label="Filter by year">
          <option value="all">All years</option>
          {years.map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
        <span className="font-mono text-xs text-muted-foreground">
          {rows.length} / {citations.length} citations
        </span>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">#</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="hidden md:table-cell">Author</TableHead>
            <TableHead className="w-20">Year</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((c, i) => (
            <TableRow key={c.id ?? i}>
              <TableCell className="font-mono text-xs text-muted-foreground">{citations.indexOf(c) + 1}</TableCell>
              <TableCell>
                <p className="font-medium">{c.title || c.raw || <NotAvailable />}</p>
                {c.venue && <p className="text-xs text-muted-foreground">{c.venue}</p>}
                <p className="text-xs text-muted-foreground md:hidden">{authorsOf(c)}</p>
              </TableCell>
              <TableCell className="hidden text-sm text-muted-foreground md:table-cell">{authorsOf(c) || <NotAvailable />}</TableCell>
              <TableCell className="font-mono text-xs">{c.year ?? "—"}</TableCell>
            </TableRow>
          ))}
          {!rows.length && (
            <TableRow>
              <TableCell colSpan={4} className="py-10 text-center text-sm text-muted-foreground">
                No citations match your search.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
