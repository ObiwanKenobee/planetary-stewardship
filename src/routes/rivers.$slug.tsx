import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Droplets,
  TreePine,
  Trash2,
  Users,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import { SanctumShell, Panel, PanelTitle, Section } from "@/components/sanctum/SanctumShell";
import { Oracle } from "@/components/sanctum/Oracle";
import {
  riverBySlugQuery,
  riverLedgerQuery,
  riverPhotosQuery,
  formatRelative,
} from "@/lib/atlas";

export const Route = createFileRoute("/rivers/$slug")({
  loader: async ({ params, context }) => {
    const river = await context.queryClient.ensureQueryData(riverBySlugQuery(params.slug));
    if (!river) throw notFound();
    await Promise.all([
      context.queryClient.ensureQueryData(riverLedgerQuery(river.id)),
      context.queryClient.ensureQueryData(riverPhotosQuery(river.id)),
    ]);
    return { riverId: river.id };
  },
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — Atlas Sanctum` },
      {
        name: "description",
        content: `Live telemetry, restoration timeline, and gallery for ${params.slug}.`,
      },
    ],
  }),
  errorComponent: ({ error }) => (
    <div className="p-10 font-mono text-sm text-signal-rose">⚠ {error.message}</div>
  ),
  notFoundComponent: () => (
    <div className="p-10 font-mono text-sm text-muted-foreground">River not found.</div>
  ),
  component: RiverDetail,
});

function RiverDetail() {
  const { slug } = Route.useParams();
  const { data: river } = useSuspenseQuery(riverBySlugQuery(slug));
  if (!river) return null;
  const { data: ledger } = useSuspenseQuery(riverLedgerQuery(river.id));
  const { data: photos } = useSuspenseQuery(riverPhotosQuery(river.id));

  const metrics = [
    { icon: Trash2, label: "Waste removed", value: `${river.waste_removed_t} t` },
    { icon: TreePine, label: "Trees restored", value: river.trees_restored.toLocaleString() },
    { icon: Droplets, label: "Biodiversity", value: river.biodiversity.toFixed(2) },
    {
      icon: AlertTriangle,
      label: "Flood risk",
      value: river.flood_risk,
      tone: river.flood_risk === "High" ? "rose" : river.flood_risk === "Medium" ? "amber" : "emerald",
    },
    { icon: Users, label: "Rangers active", value: String(river.rangers_active) },
  ] as const;

  return (
    <SanctumShell breadcrumb={<><span className="text-foreground">Rivers</span> ▸ <span className="text-river">{river.name}</span></>}>
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-river transition-colors"
        >
          <ArrowLeft className="size-3" /> back to dashboard
        </Link>
        <div className="mt-4 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-river">
              River Node · {river.basin}
            </span>
            <h1 className="font-display text-5xl mt-2">{river.name}</h1>
            <p className="font-mono text-[11px] text-muted-foreground mt-1">
              {river.lat.toFixed(3)}, {river.lng.toFixed(3)} · near {river.city}
            </p>
          </div>
          <Panel className="px-5 py-4 flex items-baseline gap-3">
            <span className="font-mono text-5xl text-river tabular-nums">{river.health}</span>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Health index
              </div>
              <div className="font-mono text-[11px] text-signal-emerald">
                ↑ +{river.health_trend.toFixed(1)} / mo
              </div>
            </div>
          </Panel>
        </div>
      </div>

      <Section eyebrow="01" title="Live Telemetry & Health" subtitle={river.status_note ?? undefined}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <Panel className="lg:col-span-8 p-5">
            <PanelTitle>Health composition</PanelTitle>
            <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-river shadow-[0_0_10px_var(--river)]"
                style={{ width: `${river.health}%` }}
              />
            </div>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              <Metric label="Flow" value={river.flow_m3s?.toString() ?? "—"} unit="m³/s" />
              <Metric label="pH" value={river.ph?.toString() ?? "—"} />
              <Metric label="Turbidity" value={river.turbidity ?? "—"} tone="amber" />
              <Metric
                label="DO"
                value={river.do_mgl?.toString() ?? "—"}
                unit="mg/L"
                tone="emerald"
              />
            </div>
          </Panel>
          <Panel className="lg:col-span-4 p-5">
            <PanelTitle>Pilot zone metrics</PanelTitle>
            <ul className="mt-4 divide-y divide-border">
              {metrics.map((m) => {
                const Icon = m.icon;
                return (
                  <li key={m.label} className="py-3 flex items-center gap-3 first:pt-0 last:pb-0">
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

      <Section eyebrow="02" title="Restoration Timeline" subtitle="Auditable record of every action">
        <Panel className="p-0 overflow-hidden">
          {ledger.length === 0 ? (
            <div className="px-5 py-8 font-mono text-[11px] text-muted-foreground uppercase tracking-widest">
              No restoration events recorded yet.
            </div>
          ) : (
            <ol className="divide-y divide-border">
              {ledger.map((e) => (
                <li key={e.id} className="px-5 py-4 flex gap-4 items-start">
                  <div className="size-2 mt-2 rounded-full bg-river shadow-[0_0_8px_var(--river)] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <span className="text-[14px]">{e.title}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {formatRelative(e.event_at)}
                      </span>
                    </div>
                    {e.description && (
                      <p className="mt-1 text-[12.5px] text-muted-foreground leading-relaxed">
                        {e.description}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-3 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                      <span>qty · <span className="text-foreground">{e.quantity}</span></span>
                      <span>proof · {e.proof_type}</span>
                      <span>{e.tx_hash}</span>
                    </div>
                  </div>
                  {e.verified && (
                    <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-river shrink-0">
                      <ShieldCheck className="size-3" strokeWidth={2} /> verified
                    </span>
                  )}
                </li>
              ))}
            </ol>
          )}
        </Panel>
      </Section>

      <Section eyebrow="03" title="Photo Gallery" subtitle="Field captures from rangers and remote sensors">
        {photos.length === 0 ? (
          <Panel className="p-8 font-mono text-[11px] text-muted-foreground uppercase tracking-widest">
            No photos uploaded yet.
          </Panel>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {photos.map((p) => (
              <Panel key={p.id} className="p-0 overflow-hidden group">
                <div className="aspect-[4/3] overflow-hidden bg-secondary">
                  <img
                    src={p.url}
                    alt={p.caption ?? "River photo"}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 flex items-center justify-between gap-3">
                  <span className="text-[12px] truncate">{p.caption ?? "Untitled capture"}</span>
                  <span className="font-mono text-[10px] text-muted-foreground shrink-0">
                    {formatRelative(p.taken_at)}
                  </span>
                </div>
              </Panel>
            ))}
          </div>
        )}
      </Section>

      <Section eyebrow="04" title="Ask the Oracle" subtitle={`Context-aware insights for ${river.name}`}>
        <Oracle
          context={{
            name: river.name,
            city: river.city,
            basin: river.basin,
            health: river.health,
          }}
        />
      </Section>
    </SanctumShell>
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
