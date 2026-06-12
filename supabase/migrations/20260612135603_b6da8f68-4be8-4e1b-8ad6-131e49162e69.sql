
CREATE TABLE public.rivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  basin TEXT NOT NULL,
  city TEXT NOT NULL,
  lat NUMERIC NOT NULL,
  lng NUMERIC NOT NULL,
  map_x NUMERIC NOT NULL DEFAULT 50,
  map_y NUMERIC NOT NULL DEFAULT 50,
  health INT NOT NULL DEFAULT 70,
  health_trend NUMERIC NOT NULL DEFAULT 0,
  flow_m3s NUMERIC,
  ph NUMERIC,
  turbidity TEXT,
  do_mgl NUMERIC,
  flood_risk TEXT NOT NULL DEFAULT 'Low',
  biodiversity NUMERIC NOT NULL DEFAULT 0,
  waste_removed_t NUMERIC NOT NULL DEFAULT 0,
  trees_restored INT NOT NULL DEFAULT 0,
  rangers_active INT NOT NULL DEFAULT 0,
  status_note TEXT,
  baseline_year INT NOT NULL DEFAULT 2019,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.rangers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  zone TEXT NOT NULL,
  reputation INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'field',
  river_id UUID REFERENCES public.rivers(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.ledger_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  river_id UUID REFERENCES public.rivers(id) ON DELETE CASCADE,
  event_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  title TEXT NOT NULL,
  description TEXT,
  quantity TEXT NOT NULL,
  proof_type TEXT NOT NULL,
  tx_hash TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE public.river_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  river_id UUID NOT NULL REFERENCES public.rivers(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  taken_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.rivers TO anon, authenticated;
GRANT ALL ON public.rivers TO service_role;
GRANT SELECT ON public.rangers TO anon, authenticated;
GRANT ALL ON public.rangers TO service_role;
GRANT SELECT ON public.ledger_entries TO anon, authenticated;
GRANT ALL ON public.ledger_entries TO service_role;
GRANT SELECT ON public.river_photos TO anon, authenticated;
GRANT ALL ON public.river_photos TO service_role;

ALTER TABLE public.rivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rangers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.river_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Rivers are public" ON public.rivers FOR SELECT USING (true);
CREATE POLICY "Rangers are public" ON public.rangers FOR SELECT USING (true);
CREATE POLICY "Ledger is public" ON public.ledger_entries FOR SELECT USING (true);
CREATE POLICY "Photos are public" ON public.river_photos FOR SELECT USING (true);

CREATE INDEX ON public.ledger_entries(river_id, event_at DESC);
CREATE INDEX ON public.river_photos(river_id, taken_at DESC);
CREATE INDEX ON public.rangers(river_id);
