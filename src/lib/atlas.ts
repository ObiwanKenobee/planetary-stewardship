import { supabase } from "@/integrations/supabase/client";
import { queryOptions } from "@tanstack/react-query";

export type River = {
  id: string;
  slug: string;
  name: string;
  basin: string;
  city: string;
  lat: number;
  lng: number;
  map_x: number;
  map_y: number;
  health: number;
  health_trend: number;
  flow_m3s: number | null;
  ph: number | null;
  turbidity: string | null;
  do_mgl: number | null;
  flood_risk: string;
  biodiversity: number;
  waste_removed_t: number;
  trees_restored: number;
  rangers_active: number;
  status_note: string | null;
  baseline_year: number;
};

export type Ranger = {
  id: string;
  name: string;
  zone: string;
  reputation: number;
  status: string;
  river_id: string | null;
};

export type LedgerEntry = {
  id: string;
  river_id: string | null;
  event_at: string;
  title: string;
  description: string | null;
  quantity: string;
  proof_type: string;
  tx_hash: string;
  verified: boolean;
};

export type RiverPhoto = {
  id: string;
  river_id: string;
  url: string;
  caption: string | null;
  taken_at: string;
};

async function unwrap<T>(p: PromiseLike<{ data: T | null; error: unknown }>): Promise<T> {
  const { data, error } = await p;
  if (error) throw error;
  return (data ?? []) as T;
}

export const riversQuery = queryOptions({
  queryKey: ["rivers"],
  queryFn: () =>
    unwrap<River[]>(
      supabase.from("rivers").select("*").order("health", { ascending: false }) as never,
    ),
});

export const rangersQuery = queryOptions({
  queryKey: ["rangers"],
  queryFn: () =>
    unwrap<Ranger[]>(
      supabase.from("rangers").select("*").order("reputation", { ascending: false }) as never,
    ),
});

export const ledgerQuery = queryOptions({
  queryKey: ["ledger"],
  queryFn: () =>
    unwrap<LedgerEntry[]>(
      supabase
        .from("ledger_entries")
        .select("*")
        .order("event_at", { ascending: false })
        .limit(20) as never,
    ),
});

export const riverBySlugQuery = (slug: string) =>
  queryOptions({
    queryKey: ["river", slug],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from("rivers")
        .select("*")
        .eq("slug", slug)
        .maybeSingle() as never as Promise<{ data: River | null; error: unknown }>);
      if (error) throw error;
      return data;
    },
  });

export const riverLedgerQuery = (riverId: string | undefined) =>
  queryOptions({
    queryKey: ["river-ledger", riverId],
    enabled: !!riverId,
    queryFn: () =>
      unwrap<LedgerEntry[]>(
        supabase
          .from("ledger_entries")
          .select("*")
          .eq("river_id", riverId!)
          .order("event_at", { ascending: false }) as never,
      ),
  });

export const riverPhotosQuery = (riverId: string | undefined) =>
  queryOptions({
    queryKey: ["river-photos", riverId],
    enabled: !!riverId,
    queryFn: () =>
      unwrap<RiverPhoto[]>(
        supabase
          .from("river_photos")
          .select("*")
          .eq("river_id", riverId!)
          .order("taken_at", { ascending: false }) as never,
      ),
  });

export function formatRelative(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.round(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)} h ago`;
  return `${Math.round(diff / 86400)} d ago`;
}
