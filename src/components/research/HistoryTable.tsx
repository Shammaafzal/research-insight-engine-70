import { Link } from "@tanstack/react-router";
import { Eye, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { PaperListItem } from "@/lib/types";
import { pct } from "./states";

const fmt = (d: string) => {
  try {
    return format(new Date(d), "MMM d, yyyy · HH:mm");
  } catch {
    return d;
  }
};

function Status({ s }: { s: string }) {
  const cls = s === "completed" ? "text-success" : s === "failed" ? "text-destructive" : "text-warning";
  return <Badge variant="outline" className={`capitalize ${cls}`}>{s}</Badge>;
}

export function HistoryTable({ items, onDelete, compact }: { items: PaperListItem[]; onDelete?: (id: string) => void; compact?: boolean }) {
  return (
    <div className="surface overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Paper</TableHead>
            {!compact && <TableHead className="hidden md:table-cell">Analyzed</TableHead>}
            <TableHead className="hidden sm:table-cell">Predicted field</TableHead>
            <TableHead>Confidence</TableHead>
            {!compact && <TableHead className="hidden md:table-cell">Status</TableHead>}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((p) => (
            <TableRow key={p.paper_id}>
              <TableCell className="max-w-xs">
                <p className="truncate font-medium">{p.title}</p>
                <p className="text-xs text-muted-foreground md:hidden">{fmt(p.created_at)}</p>
              </TableCell>
              {!compact && <TableCell className="hidden text-sm text-muted-foreground md:table-cell">{fmt(p.created_at)}</TableCell>}
              <TableCell className="hidden sm:table-cell">{p.predicted_field ?? "—"}</TableCell>
              <TableCell className="font-mono text-xs">{pct(p.confidence)}</TableCell>
              {!compact && <TableCell className="hidden md:table-cell"><Status s={p.status} /></TableCell>}
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button asChild variant="ghost" size="sm" disabled={p.status !== "completed"}>
                    <Link to="/results/$paperId" params={{ paperId: p.paper_id }}>
                      <Eye /> <span className="hidden lg:inline">View Results</span>
                    </Link>
                  </Button>
                  {onDelete && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" aria-label="Delete">
                          <Trash2 />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this analysis?</AlertDialogTitle>
                          <AlertDialogDescription>“{p.title}” and its results will be permanently removed.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(p.paper_id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
