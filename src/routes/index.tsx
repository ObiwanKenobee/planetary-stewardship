import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  ArrowUpRight,
  ChevronRight,
  ShieldCheck,
  TreePine,
  Trash2,
  Droplets,
  AlertTriangle,
  Users,
} from "lucide-react";
import livingMap from "@/assets/living-map.jpg";
import earthOrbit from "@/assets/earth-orbit.jpg";
import { SanctumShell, Panel, PanelTitle, Section } from "@/components/sanctum/SanctumShell";
import { Oracle } from "@/components/sanctum/Oracle";
import {
  riversQuery,
  rangersQuery,
  ledgerQuery,
  formatRelative,
  type River,
} from "@/lib/atlas";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Atlas Sanctum — Stewardship Dashboard" },
      {
        name: "description",
        content:
          "The Atlas Sanctum dashboard: living map, river telemetry, Oracle, Rangers, and verified Impact Ledger.",
      },
    ],
  }),
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(riversQuery),
      context.queryClient.ensureQueryData(rangersQuery),
      context.queryClient.ensureQueryData(ledgerQuery),
    ]),
  errorComponent: ({ error }) => (
    <div className="p-10 font-mono text-sm text-signal-rose">⚠ {error.message}</div>
  ),
  notFoundComponent: () => <div className="p-10">Not found.</div>,
  component: Dashboard,
});

function Dashboard() {
  const { data: rivers } = useSuspenseQuery(riversQuery);
  const { data: rangers } = useSuspenseQuery(rangersQuery);
  const { data: ledger } = useSuspenseQuery(ledgerQuery);

  const [selectedSlug, setSelectedSlug] = useState<string>(rivers[0]?.slug ?? "");
  const selected = rivers.find((r) => r.slug === selectedSlug) ?? rivers[0];

  const totals = {
    basins: rivers.length,
    rangers: rangers.length,
    actions: ledger.length,
    trees: rivers.reduce((s, r) => s + r.trees_restored, 0),
  };

  return (
    <SanctumShell breadcrumb={<span className="text-river">East Africa Watershed</span>}>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 min-w-0">
          <KPI label="Basins online" value={String(totals.basins)} />
          <KPI label="Rangers" value={String(totals.rangers)} />
          <KPI label="Verified actions" value={String(totals.actions)} />
          <KPI label="Trees restored" value={totals.trees.toLocaleString()} />
        </div>
      </section>

      {/* LIVING MAP */}
      <Section eyebrow="01" title="Living Map" subtitle="Click a river node to drill in">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <Panel className="lg:col-span-8 p-0 overflow-hidden">
            <div className="relative aspect-[16/9]">
              <img
                src={livingMap}
                alt="Satellite view of the river corridor"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/30" />

              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <HudChip label="Alt" value="12,400 m" />
                <HudChip label="Sector" value="East Africa" tone="river" />
              </div>
              <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                {selected && (
                  <>
                    <HudChip label="Lat" value={selected.lat.toFixed(3)} />
                    <HudChip label="Lon" value={selected.lng.toFixed(3)} />
                  </>
                )}
              </div>

              {rivers.map((r) => (
                <RiverPing
                  key={r.id}
                  river={r}
                  active={r.slug === selectedSlug}
                  onHover={() => setSelectedSlug(r.slug)}
                />
              ))}

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
                  ["City", selected?.city ?? "—"],
                  ["River", selected?.name ?? "—"],
                  ["Community", selected?.basin ?? "—"],
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

            {selected && (
              <Panel className="p-5 flex-1">
                <div className="flex items-center justify-between">
                  <PanelTitle>{selected.name}</PanelTitle>
                  <Link
                    to="/rivers/$slug"
                    params={{ slug: selected.slug }}
                    className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-river hover:underline"
                  >
                    drill in <ArrowUpRight className="size-3" />
                  </Link>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <SmallMetric label="Flow" value={selected.flow_m3s?.toString() ?? "—"} unit="m³/s" />
                  <SmallMetric label="pH" value={selected.ph?.toString() ?? "—"} />
                  <SmallMetric label="Turbidity" value={selected.turbidity ?? "—"} tone="amber" />
                  <SmallMetric
                    label="DO"
                    value={selected.do_mgl?.toString() ?? "—"}
                    unit="mg/L"
                    tone="emerald"
                  />
                </div>
              </Panel>
            )}
          </div>
        </div>
      </Section>

      {/* RIVER INTELLIGENCE */}
      {selected && (
        <Section
          eyebrow="02"
          title="River Intelligence"
          subtitle={`${selected.name} ▸ ${selected.basin}`}
          action={
            <Link
              to="/rivers/$slug"
              params={{ slug: selected.slug }}
              className="hidden sm:flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-river transition-colors"
            >
              Open detail <ArrowUpRight className="size-3" />
            </Link>
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <Panel className="lg:col-span-3 p-5 flex flex-col gap-6">
              <div>
                <PanelTitle>Environmental Health</PanelTitle>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-mono text-5xl text-river tabular-nums">
                    {selected.health}
                  </span>
                  <span className="font-mono text-river/70">%</span>
                </div>
                <p className="mt-2 text-[11px] text-signal-emerald font-mono uppercase tracking-wider">
                  ↑ +{selected.health_trend.toFixed(1)} / mo
                </p>
                <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-river shadow-[0_0_8px_var(--river)]"
                    style={{ width: `${selected.health}%` }}
                  />
                </div>
              </div>
              {selected.status_note && (
                <div className="border-t border-border pt-4">
                  <PanelTitle>Status</PanelTitle>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {selected.status_note}
                  </p>
                </div>
              )}
            </Panel>

            <Panel className="lg:col-span-6 p-0 overflow-hidden">
              <BeforeAfter baselineYear={selected.baseline_year} />
            </Panel>

            <Panel className="lg:col-span-3 p-5">
              <PanelTitle>Pilot Zone Metrics</PanelTitle>
              <ul className="mt-4 divide-y divide-border">
                {[
                  { icon: Trash2, label: "Waste removed", value: `${selected.waste_removed_t} t` },
                  {
                    icon: TreePine,
                    label: "Trees restored",
                    value: selected.trees_restored.toLocaleString(),
                  },
                  {
                    icon: Droplets,
                    label: "Biodiversity",
                    value: selected.biodiversity.toFixed(2),
                  },
                  {
                    icon: AlertTriangle,
                    label: "Flood risk",
                    value: selected.flood_risk,
                    tone: selected.flood_risk === "High"
                      ? "rose" as const
                      : selected.flood_risk === "Medium"
                        ? "amber" as const
                        : "emerald" as const,
                  },
                  { icon: Users, label: "Rangers active", value: String(selected.rangers_active) },
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <li
                      key={m.label}
                      className="py-3 flex items-center gap-3 first:pt-0 last:pb-0"
                    >
                      <Icon className="size-3.5 text-muted-foreground" strokeWidth={1.5} />
                      <span className="text-[12px] text-muted-foreground flex-1">{m.label}</span>
                      <span
                        className={`font-mono text-[12px] tabular-nums ${
                          "tone" in m && m.tone === "amber"
                            ? "text-signal-amber"
                            : "tone" in m && m.tone === "rose"
                              ? "text-signal-rose"
                              : "tone" in m && m.tone === "emerald"
                                ? "text-signal-emerald"
                                : "text-foreground"
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
      )}

      {/* ORACLE + RANGERS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <Section
          eyebrow="03"
          title="Atlas Oracle"
          subtitle={
            selected ? `Context: ${selected.name}` : "Planetary intelligence layer"
          }
          className="lg:col-span-7"
        >
          <Oracle
            key={selected?.slug}
            context={
              selected
                ? {
                    name: selected.name,
                    city: selected.city,
                    basin: selected.basin,
                    health: selected.health,
                  }
                : undefined
            }
          />
        </Section>

        <Section
          eyebrow="04"
          title="Ranger Network"
          subtitle={`Active roster · ${rangers.length}`}
          className="lg:col-span-5"
        >
          <Panel className="p-5 h-full">
            <PanelTitle>Stewards on the ground</PanelTitle>
            <ul className="mt-4 divide-y divide-border">
              {rangers.slice(0, 7).map((r) => (
                <li key={r.id} className="py-3 flex items-center gap-3">
                  <div className="size-8 rounded-full bg-secondary border border-border grid place-items-center font-mono text-[10px] text-muted-foreground">
                    {r.name.split(" ").map((p) => p[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] truncate">{r.name}</div>
                    <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                      {r.zone}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-[12px] tabular-nums">{r.reputation}</div>
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
          </Panel>
        </Section>
      </div>

      {/* LEDGER */}
      <Section
        eyebrow="05"
        title="Impact Ledger"
        subtitle="Every action verified, every outcome auditable"
      >
        <Panel className="p-0 overflow-hidden">
          <div className="grid grid-cols-12 px-5 py-3 border-b border-border font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <div className="col-span-2">Time</div>
            <div className="col-span-5">Action</div>
            <div className="col-span-2">Quantity</div>
            <div className="col-span-2">Proof</div>
            <div className="col-span-1 text-right">Status</div>
          </div>
          {ledger.map((e) => (
            <div
              key={e.id}
              className="grid grid-cols-12 px-5 py-4 border-b last:border-b-0 border-border items-center hover:bg-secondary/30 transition-colors"
            >
              <div className="col-span-2 font-mono text-[11px] text-muted-foreground">
                {formatRelative(e.event_at)}
              </div>
              <div className="col-span-5">
                <div className="text-[13px]">{e.title}</div>
                <div className="font-mono text-[10px] text-muted-foreground mt-0.5">
                  {e.tx_hash}
                </div>
              </div>
              <div className="col-span-2 font-mono text-[12px] tabular-nums">{e.quantity}</div>
              <div className="col-span-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {e.proof_type}
              </div>
              <div className="col-span-1 flex justify-end">
                {e.verified && (
                  <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-river">
                    <ShieldCheck className="size-3" strokeWidth={2} />
                    verified
                  </span>
                )}
              </div>
            </div>
          ))}
        </Panel>
      </Section>

      {/* COMMAND CENTER */}
      <Section
        eyebrow="06"
        title="Sanctum Command Center"
        subtitle="Portfolio view — rivers, basins, projects"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rivers.map((r) => (
            <Link
              to="/rivers/$slug"
              params={{ slug: r.slug }}
              key={r.id}
              className="block group"
            >
              <Panel className="p-5 h-full group-hover:border-river/40 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-2xl">{r.name}</h3>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
                      {r.basin}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-3xl text-river tabular-nums">{r.health}</div>
                    <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                      Health
                    </div>
                  </div>
                </div>
                <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-river" style={{ width: `${r.health}%` }} />
                </div>
                <dl className="mt-5 grid grid-cols-2 gap-y-3 gap-x-2 text-[12px]">
                  <Datum
                    k="Flood risk"
                    v={r.flood_risk}
                    tone={r.flood_risk === "High" ? "rose" : r.flood_risk === "Medium" ? "amber" : "emerald"}
                  />
                  <Datum k="Biodiversity" v={r.biodiversity.toFixed(2)} tone="emerald" />
                  <Datum k="Rangers" v={String(r.rangers_active)} />
                  <Datum k="Trees" v={r.trees_restored.toLocaleString()} />
                </dl>
                <div className="mt-5 w-full text-left flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-river transition-colors border-t border-border pt-3">
                  Enter command center
                  <ArrowUpRight className="size-3" />
                </div>
              </Panel>
            </Link>
          ))}
        </div>
      </Section>

      <footer className="pt-8 pb-6 border-t border-border flex items-center justify-between">
        <div className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
          © Atlas Sanctum · Stewardship Protocol 1.0
        </div>
      </footer>
    </SanctumShell>
  );
}

function KPI({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border rounded-sm px-4 py-3 bg-card/60">
      <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="font-display text-2xl mt-0.5 tabular-nums">{value}</div>
    </div>
  );
}

function HudChip({ label, value, tone }: { label: string; value: string; tone?: "river" }) {
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

function RiverPing({
  river,
  active,
  onHover,
}: {
  river: River;
  active: boolean;
  onHover: () => void;
}) {
  return (
    <Link
      to="/rivers/$slug"
      params={{ slug: river.slug }}
      onMouseEnter={onHover}
      onFocus={onHover}
      className="absolute -translate-x-1/2 -translate-y-1/2 group"
      style={{ left: `${river.map_x}%`, top: `${river.map_y}%` }}
    >
      <span className="block size-2 rounded-full bg-river shadow-[0_0_12px_var(--river)]" />
      <span className="absolute inset-0 size-2 rounded-full border border-river animate-ping" />
      <span
        className={`absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-widest px-2 py-1 bg-background/90 border rounded-sm transition-opacity ${
          active
            ? "opacity-100 border-river/50 text-river"
            : "opacity-0 group-hover:opacity-100 border-border text-foreground"
        }`}
      >
        {river.name} · {river.health}
      </span>
    </Link>
  );
}

function SmallMetric({
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
      <div className={`font-mono text-[12px] tabular-nums mt-0.5 ${color}`}>{v}</div>
    </div>
  );
}

function BeforeAfter({ baselineYear }: { baselineYear: number }) {
  const [pos, setPos] = useState(52);
  return (
    <div className="relative aspect-[16/10] overflow-hidden bg-background">
      <img
        src={earthOrbit}
        alt="Baseline"
        className="absolute inset-0 w-full h-full object-cover opacity-80"
        loading="lazy"
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
      >
        <img
          src={livingMap}
          alt="Restored"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      </div>
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
        {baselineYear} · Baseline
      </div>
      <div className="absolute top-3 right-3 font-mono text-[10px] uppercase tracking-widest px-2 py-1 bg-background/80 border border-river/40 text-river rounded-sm">
        2026 · Restored
      </div>
    </div>
  );
}
// keep ChevronRight import used
void ChevronRight;
