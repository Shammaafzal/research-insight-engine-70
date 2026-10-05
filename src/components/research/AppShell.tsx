import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, BookOpen, Clock, FileUp, LayoutDashboard, Menu, Search, Trophy, Sparkles } from "lucide-react";
import { useState, type ReactNode, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MockBanner } from "./states";
import { setMockMode } from "@/lib/config";
import { useMockMode } from "@/hooks/use-mock-mode";
import { API_BASE_URL } from "@/lib/config";
import { useQueryClient } from "@tanstack/react-query";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/analyze", label: "Analyze Paper", icon: FileUp },
  { to: "/history", label: "History", icon: Clock },
  { to: "/conferences", label: "Conference Recommendations", icon: Trophy },
  { to: "/about", label: "About Project", icon: BookOpen },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
        <Sparkles className="h-4 w-4" />
      </span>
      <span className="leading-tight">
        <span className="block text-[15px] font-semibold tracking-tight">ResearchAI</span>
        <span className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">From Chaos to Knowledge</span>
      </span>
    </Link>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          activeProps={{ className: "bg-sidebar-accent !text-sidebar-accent-foreground font-medium" }}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-8 p-5">
      <Logo />
      <NavList onNavigate={onNavigate} />
      <div className="mt-auto rounded-xl border bg-card p-4 text-xs text-muted-foreground">
        <p className="font-medium text-foreground">Model stack</p>
        <p className="mt-1">SciBERT · ViT · Fusion · SHAP</p>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const mock = useMockMode();
  const qc = useQueryClient();

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    navigate({ to: "/history", search: { q: q.trim() || undefined } });
  };

  return (
    <div className="min-h-screen bg-background">
      <MockBanner />
      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r bg-sidebar lg:block">
          <SidebarBody />
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur md:px-8">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-sidebar p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <SidebarBody onNavigate={() => setOpen(false)} />
              </SheetContent>
            </Sheet>
            <form onSubmit={onSearch} className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search analyzed papers…" className="h-9 bg-card pl-9" />
            </form>
            <div className="ml-auto flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Notifications">
                    <Bell className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <p className="px-2 py-4 text-center text-sm text-muted-foreground">You're all caught up.</p>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="ml-1 grid h-9 w-9 place-items-center rounded-full bg-accent text-sm font-semibold text-accent-foreground" aria-label="User profile">
                    R
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuLabel>
                    <p>Researcher</p>
                    <p className="truncate font-mono text-[11px] font-normal text-muted-foreground">API: {API_BASE_URL}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <label className="flex cursor-pointer items-center justify-between gap-3 px-2 py-2 text-sm">
                    <span>
                      Mock mode
                      <span className="block text-xs text-muted-foreground">Demo data only — not real predictions</span>
                    </span>
                    <Switch
                      checked={mock}
                      onCheckedChange={(v) => {
                        setMockMode(v);
                        qc.invalidateQueries();
                      }}
                    />
                  </label>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
