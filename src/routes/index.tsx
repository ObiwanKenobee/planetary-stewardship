import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Globe2,
  Waves,
  Sparkle,
  Users,
  ScrollText,
  LayoutGrid,
  Search,
  ArrowUpRight,
  ChevronRight,
  CircleDot,
  Radio,
  ShieldCheck,
  TreePine,
  Trash2,
  Droplets,
  AlertTriangle,
} from "lucide-react";
import livingMap from "@/assets/living-map.jpg";
import earthOrbit from "@/assets/earth-orbit.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Atlas Sanctum — Living Intelligence Network" },
      {
        name: "description",
        content:
          "Atlas Sanctum is the planetary intelligence platform for stewarding rivers, ecosystems, and cities.",
      },
      { property: "og:title", content: "Atlas Sanctum — Living Intelligence Network" },
      {
        property: "og:description",
        content:
          "Operate the control room of planetary stewardship: living map, river telemetry, Oracle, Rangers, and verified Impact Ledger.",
      },
    ],
  }),
  component: Sanctum,
});

/* ────────────────────────────────────────────────────────────────────────── */

const NAV = [
  { id: "map", label: "Living Map", icon: Globe2 },
  { id: "river", label: "River Intelligence", icon: Waves },
  { id: "oracle", label: "Atlas Oracle", icon: Sparkle },
  { id: "rangers", label: "Ranger Network", icon: Users },
  { id: "ledger", label: "Impact Ledger", icon: ScrollText },
  { id: "command", label: "Command Center", icon: LayoutGrid },
] as const;

type NavId = (typeof NAV)[number]["id"];

function Sanctum() {
  const [active, setActive] = useState<NavId>("map");
  const [clock, setClock] = useState<string>("");

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
        {/* Sidebar */}
        <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-background/60 backdrop-blur-md">
          <div className="px-5 py-5 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-river shadow-[0_0_10px_var(--river)]" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-river uppercase">
                Atlas Sanctum
              </span>
            </div>
            <p className="mt-3 font-display italic text-xl leading-tight">
              Living Intelligence Network
            </p>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActive(item.id);
                    document
                      .getElementById(item.id)
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
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
                </button>
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

        {/* Main */}
        <main className="flex-1 min-w-0">
          {/* Top status bar */}
          <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
            <div className="px-6 py-3 flex items-center gap-4">
              <div className="md:hidden font-mono text-[10px] tracking-[0.3em] text-river uppercase">
                Atlas Sanctum
              </div>
              <div className="hidden md:flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                <span className="text-foreground">Sanctum</span>
                <ChevronRight className="size-3" />
                <span className="text-foreground">East Africa Watershed</span>
                <ChevronRight className="size-3" />
                <span className="text-river">Tana Basin</span>
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

          <div className="px-6 py-6 space-y-10 max-w-[1400px] mx-auto">
            {/* Headline */}
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-river">
                  Stewardship Console
                </span>
                <h1 className="font-display text-4xl md:text-5xl leading-[1.05] mt-2 max-w-2xl">
                  Intelligence for a <em className="text-river">thriving</em> planet.
                </h1>
              </div>
              <KPIStrip />
            </section>

            {/* LIVING MAP */}
            <Section id="map" eyebrow="01" title="Living Map" subtitle="Planet → Sensor">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <Panel className="lg:col-span-8 p-0 overflow-hidden">
                  <div className="relative aspect-[16/9]">
                    <img
                      src={livingMap}
                      alt="Satellite view of the Tana river corridor"
                      className="absolute inset-0 w-full h-full object-cover"
                      width={1600}
                      height={900}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/30" />

                    {/* HUD overlays */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <HudChip label="Alt" value="12,400 m" />
                      <HudChip label="Sector" value="Tana ▸ Delta-4" tone="river" />
                    </div>
                    <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                      <HudChip label="Lat" value="-1.292" />
                      <HudChip label="Lon" value="36.821" />
                    </div>

                    {/* Sensor pings */}
                    <Ping className="top-[34%] left-[42%]" />
                    <Ping className="top-[58%] left-[55%]" delay="0.6s" />
                    <Ping className="top-[72%] left-[48%]" delay="1.2s" />

                    {/* Bottom scale */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-center gap-3 font-mono text-[10px] text-muted-foreground uppercase">
                      <span>0 km</span>
                      <div className="flex-1 h-px bg-border" />
                      <span>25 km</span>
                    </div>
                  </div>
                </Panel>

                <div className="lg:col-span-4 flex flex-col gap-4">
                  <Panel className="p-5">
                    <PanelTitle>Zoom Stack</PanelTitle>
                    <ul className="mt-4 space-y-2 font-mono text-[11px]">
                      {[
                        ["Planet", "Earth"],
                        ["Nation", "Kenya"],
                        ["City", "Nairobi"],
                        ["River", "Tana"],
                        ["Community", "Delta-4"],
                        ["Sensor", "LoRa-#0431"],
                      ].map(([k, v], i, arr) => (
                        <li
                          key={k}
                          className={`flex items-center justify-between px-2 py-1.5 rounded-sm ${
                            i === arr.length - 1
                              ? "bg-river/10 text-river"
                              : "text-muted-foreground"
                          }`}
                        >
                          <span className="uppercase tracking-widest text-[9px]">{k}</span>
                          <span>{v}</span>
                        </li>
                      ))}
                    </ul>
                  </Panel>

                  <Panel className="p-5 flex-1">
                    <PanelTitle>Live Telemetry</PanelTitle>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <Metric label="Flow" value="14.2" unit="m³/s" />
                      <Metric label="pH" value="7.4" />
                      <Metric label="Turbidity" value="Low" tone="amber" />
                      <Metric label="DO" value="8.1" unit="mg/L" tone="emerald" />
                    </div>
                  </Panel>
                </div>
              </div>
            </Section>

            {/* RIVER INTELLIGENCE */}
            <Section
              id="river"
              eyebrow="02"
              title="River Intelligence"
              subtitle="Tana ▸ Delta-4 — Health & Restoration"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left: env health */}
                <Panel className="lg:col-span-3 p-5 flex flex-col gap-6">
                  <div>
                    <PanelTitle>Environmental Health</PanelTitle>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="font-mono text-5xl text-river tabular-nums">86</span>
                      <span className="font-mono text-river/70">%</span>
                    </div>
                    <p className="mt-2 text-[11px] text-signal-emerald font-mono uppercase tracking-wider">
                      ↑ Improving · +2.4 / mo
                    </p>
                    <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-river shadow-[0_0_8px_var(--river)]"
                        style={{ width: "86%" }}
                      />
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <PanelTitle>Status</PanelTitle>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      Oxygenation rising following upstream desilting. Mangrove canopy at{" "}
                      <span className="text-foreground">72%</span> recovery.
                    </p>
                  </div>
                </Panel>

                {/* Center: before/after */}
                <Panel className="lg:col-span-6 p-0 overflow-hidden">
                  <BeforeAfter />
                </Panel>

                {/* Right: live metrics */}
                <Panel className="lg:col-span-3 p-5">
                  <PanelTitle>Pilot Zone Metrics</PanelTitle>
                  <ul className="mt-4 divide-y divide-border">
                    {[
                      { icon: Trash2, label: "Waste removed", value: "842.4 t" },
                      { icon: TreePine, label: "Trees restored", value: "14,203" },
                      { icon: Droplets, label: "Biodiversity", value: "0.74" },
                      {
                        icon: AlertTriangle,
                        label: "Flood risk",
                        value: "Medium",
                        tone: "amber" as const,
                      },
                      { icon: Users, label: "Rangers active", value: "127" },
                    ].map((m) => {
                      const Icon = m.icon;
                      return (
                        <li
                          key={m.label}
                          className="py-3 flex items-center gap-3 first:pt-0 last:pb-0"
                        >
                          <Icon className="size-3.5 text-muted-foreground" strokeWidth={1.5} />
                          <span className="text-[12px] text-muted-foreground flex-1">
                            {m.label}
                          </span>
                          <span
                            className={`font-mono text-[12px] tabular-nums ${
                              m.tone === "amber" ? "text-signal-amber" : "text-foreground"
                            }`}
                          >
                            {m.value}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </Panel>
              </div>
            </Section>

            {/* ORACLE + RANGERS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <Section
                id="oracle"
                eyebrow="03"
                title="Atlas Oracle"
                subtitle="Planetary intelligence layer"
                className="lg:col-span-7"
              >
                <Oracle />
              </Section>

              <Section
                id="rangers"
                eyebrow="04"
                title="Ranger Network"
                subtitle="Stewards on the ground"
                className="lg:col-span-5"
              >
                <Rangers />
              </Section>
            </div>

            {/* LEDGER */}
            <Section
              id="ledger"
              eyebrow="05"
              title="Impact Ledger"
              subtitle="Every action verified, every outcome auditable"
            >
              <Ledger />
            </Section>

            {/* COMMAND CENTER */}
            <Section
              id="command"
              eyebrow="06"
              title="Sanctum Command Center"
              subtitle="Portfolio view — cities, rivers, projects"
            >
              <CommandGrid />
            </Section>

            <footer className="pt-8 pb-6 border-t border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
                © Atlas Sanctum · Stewardship Protocol 1.0
              </div>
              <div className="flex gap-6 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                <a href="#" className="hover:text-river transition-colors">
                  Telemetry Feed
                </a>
                <a href="#" className="hover:text-river transition-colors">
                  Ranger Auth
                </a>
                <a href="#" className="hover:text-river transition-colors">
                  Public Ledger
                </a>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Primitives                                                                */
/* ────────────────────────────────────────────────────────────────────────── */

function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className = "",
}: {
  id?: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-24 ${className}`}>
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
        <button className="hidden sm:flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-river transition-colors">
          Expand <ArrowUpRight className="size-3" />
        </button>
      </header>
      {children}
    </section>
  );
}

function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative bg-card/70 border border-border rounded-sm backdrop-blur-sm ${className}`}
    >
      {/* corner ticks */}
      <span className="absolute top-0 left-0 w-2 h-px bg-river" />
      <span className="absolute top-0 left-0 h-2 w-px bg-river" />
      <span className="absolute bottom-0 right-0 w-2 h-px bg-river" />
      <span className="absolute bottom-0 right-0 h-2 w-px bg-river" />
      {children}
    </div>
  );
}

function PanelTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        {children}
      </span>
      <CircleDot className="size-3 text-muted-foreground" strokeWidth={1.5} />
    </div>
  );
}

function HudChip({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "river";
}) {
  return (
    <div
      className={`px-2 py-1 border rounded-sm bg-background/80 backdrop-blur-md font-mono text-[10px] uppercase tracking-tighter ${
        tone === "river" ? "border-river/40 text-river" : "border-border text-muted-foreground"
      }`}
    >
      <span className="opacity-60 mr-1.5">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}

function Ping({ className = "", delay = "0s" }: { className?: string; delay?: string }) {
  return (
    <span className={`absolute ${className}`} style={{ animationDelay: delay }}>
      <span className="block size-2 rounded-full bg-river shadow-[0_0_12px_var(--river)]" />
      <span className="absolute inset-0 size-2 rounded-full border border-river animate-ping" />
    </span>
  );
}

function Metric({
  label,
  value,
  unit,
  tone,
}: {
  label: string;
  value: string;
  unit?: string;
  tone?: "emerald" | "amber";
}) {
  const color =
    tone === "emerald" ? "text-signal-emerald" : tone === "amber" ? "text-signal-amber" : "text-foreground";
  return (
    <div className="border border-border rounded-sm p-3">
      <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className={`font-mono text-lg tabular-nums ${color}`}>{value}</span>
        {unit && <span className="font-mono text-[10px] text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Sections                                                                  */
/* ────────────────────────────────────────────────────────────────────────── */

function KPIStrip() {
  const items = [
    { label: "Basins online", value: "14" },
    { label: "Rangers", value: "2,408" },
    { label: "Verified actions", value: "31,902" },
    { label: "CO₂e averted", value: "1.24 kt" },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 min-w-0">
      {items.map((i) => (
        <div key={i.label} className="border border-border rounded-sm px-4 py-3 bg-card/60">
          <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            {i.label}
          </div>
          <div className="font-display text-2xl mt-0.5 tabular-nums">{i.value}</div>
        </div>
      ))}
    </div>
  );
}

function BeforeAfter() {
  const [pos, setPos] = useState(52);
  return (
    <div className="relative aspect-[16/10] overflow-hidden bg-background">
      <img
        src={earthOrbit}
        alt="Earth from orbit — before"
        className="absolute inset-0 w-full h-full object-cover opacity-80"
        loading="lazy"
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
      >
        <img
          src={livingMap}
          alt="River corridor — after restoration"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      {/* divider */}
      <div
        className="absolute top-0 bottom-0 w-px bg-river shadow-[0_0_10px_var(--river)]"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-6 rounded-full border border-river bg-background flex items-center justify-center">
          <div className="flex gap-0.5">
            <div className="w-0.5 h-2 bg-river" />
            <div className="w-0.5 h-2 bg-river" />
          </div>
        </div>
      </div>
      <input
        type="range"
        min={6}
        max={94}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
        aria-label="Before / after slider"
      />
      <div className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-widest px-2 py-1 bg-background/80 border border-border rounded-sm">
        2019 · Baseline
      </div>
      <div className="absolute top-3 right-3 font-mono text-[10px] uppercase tracking-widest px-2 py-1 bg-background/80 border border-river/40 text-river rounded-sm">
        2026 · Restored
      </div>
    </div>
  );
}

function Oracle() {
  const messages = [
    {
      role: "user" as const,
      text: "What threatens the Tana Delta this season?",
    },
    {
      role: "atlas" as const,
      text:
        "Three signals. Vegetation density up 34% in the upper watershed — runoff load rising. Waste accumulation detected at Sector 7 (-1.341, 36.912). Flood risk elevated 14% within 21 days based on highland precipitation models.",
      cites: ["SAT-09", "Ranger-04", "NOAA-AF"],
    },
    {
      role: "user" as const,
      text: "Recommend a response.",
    },
    {
      role: "atlas" as const,
      text:
        "Dispatch Ranger Unit Delta-4 for verification of Sector 7. Stage 2 desilting at waypoint 09. Notify Nairobi City flood-watch with 21-day window.",
    },
  ];
  return (
    <Panel className="p-0 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-border flex items-center gap-2 bg-secondary/40">
        <Radio className="size-3.5 text-river" strokeWidth={1.5} />
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Oracle Terminal · v2.4
        </span>
        <span className="ml-auto font-mono text-[10px] text-signal-emerald flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-signal-emerald" />
          listening
        </span>
      </div>
      <div className="p-5 space-y-4 max-h-[420px] overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className="flex gap-3">
            <span
              className={`shrink-0 font-mono text-[10px] uppercase tracking-widest pt-1 ${
                m.role === "atlas" ? "text-river" : "text-muted-foreground"
              }`}
            >
              {m.role === "atlas" ? "ATLAS ▸" : "YOU ▸"}
            </span>
            <div className="flex-1 min-w-0">
              <p
                className={`text-[13.5px] leading-relaxed ${
                  m.role === "atlas" ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {m.text}
              </p>
              {m.cites && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {m.cites.map((c) => (
                    <span
                      key={c}
                      className="font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 border border-border rounded-sm text-muted-foreground"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-border px-4 py-3 flex items-center gap-2">
        <span className="font-mono text-river text-sm">›</span>
        <input
          placeholder="Query the planet…"
          className="flex-1 bg-transparent outline-none text-[13px] placeholder:text-muted-foreground"
        />
        <span className="w-2 h-4 bg-river blink" />
      </div>
    </Panel>
  );
}

function Rangers() {
  const rangers = [
    { name: "A. Mwangi", zone: "Delta-4", rep: 982, status: "field" },
    { name: "J. Kariuki", zone: "Sector 7", rep: 871, status: "field" },
    { name: "N. Otieno", zone: "Westlands", rep: 744, status: "review" },
    { name: "P. Wanjiru", zone: "Koma Rock", rep: 690, status: "field" },
    { name: "S. Achieng", zone: "Athi Bend", rep: 612, status: "rest" },
  ];
  return (
    <Panel className="p-5 h-full">
      <PanelTitle>Active Roster · 127</PanelTitle>
      <ul className="mt-4 divide-y divide-border">
        {rangers.map((r) => (
          <li key={r.name} className="py-3 flex items-center gap-3">
            <div className="size-8 rounded-full bg-secondary border border-border grid place-items-center font-mono text-[10px] text-muted-foreground">
              {r.name
                .split(" ")
                .map((p) => p[0])
                .join("")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] truncate">{r.name}</div>
              <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                {r.zone}
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[12px] tabular-nums">{r.rep}</div>
              <div
                className={`font-mono text-[9px] uppercase tracking-widest ${
                  r.status === "field"
                    ? "text-signal-emerald"
                    : r.status === "review"
                      ? "text-signal-amber"
                      : "text-muted-foreground"
                }`}
              >
                {r.status}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <button className="border border-border hover:border-river/50 hover:text-river rounded-sm py-2 font-mono text-[10px] uppercase tracking-widest transition-colors">
          Photo
        </button>
        <button className="border border-border hover:border-river/50 hover:text-river rounded-sm py-2 font-mono text-[10px] uppercase tracking-widest transition-colors">
          Report
        </button>
        <button className="border border-border hover:border-river/50 hover:text-river rounded-sm py-2 font-mono text-[10px] uppercase tracking-widest transition-colors">
          Verify
        </button>
      </div>
    </Panel>
  );
}

function Ledger() {
  const entries = [
    {
      t: "14:20 UTC",
      title: "Plastic removal · Grogon crossing",
      qty: "1.4 t",
      proof: "SAT + ranger",
      hash: "0x1a2…f3b",
    },
    {
      t: "09:12 UTC",
      title: "Mangrove saplings deployed · Delta-4",
      qty: "2,400 units",
      proof: "Ranger photo",
      hash: "0x4c9…e12",
    },
    {
      t: "Yesterday",
      title: "Urban runoff diversion · Westlands",
      qty: "operational",
      proof: "Sensor sync",
      hash: "0x9d0…a88",
    },
    {
      t: "2 d ago",
      title: "Riparian buffer planting · Athi Bend",
      qty: "0.8 ha",
      proof: "Multispectral",
      hash: "0x77e…b04",
    },
  ];
  return (
    <Panel className="p-0 overflow-hidden">
      <div className="grid grid-cols-12 px-5 py-3 border-b border-border font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        <div className="col-span-2">Time</div>
        <div className="col-span-5">Action</div>
        <div className="col-span-2">Quantity</div>
        <div className="col-span-2">Proof</div>
        <div className="col-span-1 text-right">Status</div>
      </div>
      {entries.map((e) => (
        <div
          key={e.hash}
          className="grid grid-cols-12 px-5 py-4 border-b last:border-b-0 border-border items-center hover:bg-secondary/30 transition-colors group"
        >
          <div className="col-span-2 font-mono text-[11px] text-muted-foreground">{e.t}</div>
          <div className="col-span-5">
            <div className="text-[13px]">{e.title}</div>
            <div className="font-mono text-[10px] text-muted-foreground mt-0.5">{e.hash}</div>
          </div>
          <div className="col-span-2 font-mono text-[12px] tabular-nums">{e.qty}</div>
          <div className="col-span-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {e.proof}
          </div>
          <div className="col-span-1 flex justify-end">
            <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-river">
              <ShieldCheck className="size-3" strokeWidth={2} />
              verified
            </span>
          </div>
        </div>
      ))}
    </Panel>
  );
}

function CommandGrid() {
  const cities = [
    {
      name: "Nairobi",
      tag: "Tana ▸ Athi",
      health: 82,
      flood: "Medium",
      bio: "Improving",
      rangers: 127,
      projects: 14,
    },
    {
      name: "Mombasa",
      tag: "Coastal Delta",
      health: 71,
      flood: "High",
      bio: "Stable",
      rangers: 64,
      projects: 9,
    },
    {
      name: "Kisumu",
      tag: "Lake Victoria",
      health: 88,
      flood: "Low",
      bio: "Improving",
      rangers: 92,
      projects: 11,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cities.map((c) => (
        <Panel key={c.name} className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-display text-2xl">{c.name}</h3>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
                {c.tag}
              </p>
            </div>
            <div className="text-right">
              <div className="font-mono text-3xl text-river tabular-nums">{c.health}</div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                Health
              </div>
            </div>
          </div>

          <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-river"
              style={{ width: `${c.health}%` }}
            />
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-y-3 gap-x-2 text-[12px]">
            <Datum k="Flood risk" v={c.flood} tone={c.flood === "High" ? "rose" : c.flood === "Medium" ? "amber" : "emerald"} />
            <Datum k="Biodiversity" v={c.bio} tone="emerald" />
            <Datum k="Rangers" v={String(c.rangers)} />
            <Datum k="Projects" v={`${c.projects} live`} />
          </dl>

          <button className="mt-5 w-full text-left flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-river transition-colors border-t border-border pt-3">
            Enter command center
            <ArrowUpRight className="size-3" />
          </button>
        </Panel>
      ))}
    </div>
  );
}

function Datum({
  k,
  v,
  tone,
}: {
  k: string;
  v: string;
  tone?: "emerald" | "amber" | "rose";
}) {
  const color =
    tone === "emerald"
      ? "text-signal-emerald"
      : tone === "amber"
        ? "text-signal-amber"
        : tone === "rose"
          ? "text-signal-rose"
          : "text-foreground";
  return (
    <div>
      <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
        {k}
      </div>
      <div className={`font-mono mt-0.5 ${color}`}>{v}</div>
    </div>
  );
}
