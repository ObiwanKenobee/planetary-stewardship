import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Globe2,
  Waves,
  Sparkle,
  Users,
  ScrollText,
  LayoutGrid,
  ChevronRight,
  Search,
} from "lucide-react";

const NAV = [
  { to: "/", label: "Dashboard", icon: Globe2 },
  { to: "/rivers", label: "Rivers", icon: Waves },
  { to: "/oracle", label: "Atlas Oracle", icon: Sparkle },
  { to: "/rangers", label: "Rangers", icon: Users },
  { to: "/ledger", label: "Impact Ledger", icon: ScrollText },
  { to: "/command", label: "Command Center", icon: LayoutGrid },
] as const;

export function SanctumShell({
  breadcrumb,
  children,
}: {
  breadcrumb?: ReactNode;
  children: ReactNode;
}) {
  const { pathname } = useLocation();
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "UTC",
        }) + " UTC",
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 telemetry-grid opacity-[0.35] pointer-events-none" />

      <div className="relative flex min-h-screen">
        <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-background/60 backdrop-blur-md sticky top-0 h-screen">
          <div className="px-5 py-5 border-b border-border">
            <Link to="/" className="block">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-river shadow-[0_0_10px_var(--river)]" />
                <span className="font-mono text-[10px] tracking-[0.3em] text-river uppercase">
                  Atlas Sanctum
                </span>
              </div>
              <p className="mt-3 font-display italic text-xl leading-tight">
                Living Intelligence Network
              </p>
            </Link>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.to === "/"
                  ? pathname === "/"
                  : pathname === item.to || pathname.startsWith(item.to + "/");
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`w-full group flex items-center gap-3 px-3 py-2 rounded-sm text-left transition-colors ${
                    isActive
                      ? "bg-river/10 text-river"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}
                >
                  <Icon className="size-4 shrink-0" strokeWidth={1.5} />
                  <span className="text-[13px] tracking-tight">{item.label}</span>
                  {isActive && (
                    <ChevronRight className="size-3 ml-auto opacity-60" strokeWidth={2} />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="px-5 py-4 border-t border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Node
              </span>
              <span className="font-mono text-[10px] text-river">AS-09 / EAFR</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Uplink
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[10px] text-signal-emerald">
                <span className="size-1.5 rounded-full bg-signal-emerald blink" />
                nominal
              </span>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
            <div className="px-6 py-3 flex items-center gap-4">
              <div className="md:hidden font-mono text-[10px] tracking-[0.3em] text-river uppercase">
                Atlas Sanctum
              </div>
              <div className="hidden md:flex items-center gap-2 font-mono text-[11px] text-muted-foreground min-w-0">
                <Link to="/" className="text-foreground hover:text-river transition-colors">
                  Sanctum
                </Link>
                {breadcrumb && (
                  <>
                    <ChevronRight className="size-3" />
                    <span className="truncate">{breadcrumb}</span>
                  </>
                )}
              </div>
              <div className="ml-auto flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-border rounded-sm bg-secondary/40">
                  <Search className="size-3.5 text-muted-foreground" />
                  <input
                    className="bg-transparent outline-none text-[12px] w-44 placeholder:text-muted-foreground"
                    placeholder="Search basins, rangers, ledger…"
                  />
                  <span className="font-mono text-[10px] text-muted-foreground border border-border px-1 rounded">
                    /
                  </span>
                </div>
                <div className="font-mono text-[10px] text-muted-foreground tabular-nums">
                  {clock}
                </div>
              </div>
            </div>
          </header>

          <div className="px-6 py-6 space-y-10 max-w-[1400px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative bg-card/70 border border-border rounded-sm backdrop-blur-sm ${className}`}
    >
      <span className="absolute top-0 left-0 w-2 h-px bg-river" />
      <span className="absolute top-0 left-0 h-2 w-px bg-river" />
      <span className="absolute bottom-0 right-0 w-2 h-px bg-river" />
      <span className="absolute bottom-0 right-0 h-2 w-px bg-river" />
      {children}
    </div>
  );
}

export function PanelTitle({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        {children}
      </span>
    </div>
  );
}

export function Section({
  eyebrow,
  title,
  subtitle,
  children,
  className = "",
  action,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <section className={`scroll-mt-24 ${className}`}>
      <header className="flex items-end justify-between gap-4 border-b border-border pb-3 mb-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-river">
              [{eyebrow}]
            </span>
            <h2 className="font-display text-2xl leading-none">{title}</h2>
          </div>
          {subtitle && (
            <p className="mt-1.5 font-mono text-[11px] text-muted-foreground tracking-tight">
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}
