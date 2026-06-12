import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SanctumShell, Section, Panel } from "@/components/sanctum/SanctumShell";
import { Oracle } from "@/components/sanctum/Oracle";
import { riversQuery } from "@/lib/atlas";

export const Route = createFileRoute("/oracle")({
  head: () => ({
    meta: [
      { title: "Atlas Oracle — Atlas Sanctum" },
      {
        name: "description",
        content: "Conversational planetary intelligence for rivers, basins, and cities.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(riversQuery),
  errorComponent: ({ error }) => (
    <div className="p-10 font-mono text-sm text-signal-rose">⚠ {error.message}</div>
  ),
  notFoundComponent: () => <div className="p-10">Not found.</div>,
  component: OraclePage,
});

function OraclePage() {
  const { data: rivers } = useSuspenseQuery(riversQuery);
  const [slug, setSlug] = useState<string>("");
  const selected = rivers.find((r) => r.slug === slug);

  return (
    <SanctumShell breadcrumb={<span className="text-river">Atlas Oracle</span>}>
      <Section
        eyebrow="OR"
        title="Atlas Oracle"
        subtitle="Ask anything about the network — telemetry, threats, restoration plans."
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <Panel className="lg:col-span-3 p-5 h-fit">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Context
            </div>
            <div className="mt-4 space-y-1">
              <button
                onClick={() => setSlug("")}
                className={`w-full text-left px-3 py-2 rounded-sm text-[13px] transition-colors ${
                  !selected
                    ? "bg-river/10 text-river"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                Whole network
              </button>
              {rivers.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSlug(r.slug)}
                  className={`w-full text-left px-3 py-2 rounded-sm text-[13px] transition-colors flex items-center justify-between ${
                    selected?.id === r.id
                      ? "bg-river/10 text-river"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}
                >
                  <span>{r.name}</span>
                  <span className="font-mono text-[10px] tabular-nums">{r.health}</span>
                </button>
              ))}
            </div>
          </Panel>

          <div className="lg:col-span-9">
            <Oracle
              key={slug || "global"}
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
          </div>
        </div>
      </Section>
    </SanctumShell>
  );
}
