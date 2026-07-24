-- =============================================================================
-- Supabase Core Schema & Row Level Security (RLS) Configuration
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Creator Channels
CREATE TABLE IF NOT EXISTS public.creator_channels (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  handle TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT 'instagram',
  followers_count INTEGER NOT NULL DEFAULT 0,
  follower_display TEXT NOT NULL DEFAULT '',
  positioning TEXT,
  description TEXT,
  accent_color TEXT DEFAULT 'blue',
  status TEXT NOT NULL DEFAULT 'published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.creator_channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public SELECT published creator_channels"
  ON public.creator_channels FOR SELECT TO public
  USING (status = 'published');

CREATE POLICY "Admin INSERT/UPDATE/DELETE creator_channels"
  ON public.creator_channels FOR ALL TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 2. Analytics Reports
CREATE TABLE IF NOT EXISTS public.analytics_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  channel_slug TEXT NOT NULL,
  report_window TEXT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  title TEXT NOT NULL,
  executive_summary TEXT,
  highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
  metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
  pdf_storage_key TEXT,
  original_pdf_filename TEXT,
  pdf_size_bytes BIGINT,
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.analytics_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public SELECT published analytics_reports"
  ON public.analytics_reports FOR SELECT TO public
  USING (status = 'published');

CREATE POLICY "Admin ALL access on analytics_reports"
  ON public.analytics_reports FOR ALL TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 3. Campaign Inquiries
CREATE TABLE IF NOT EXISTS public.campaign_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  collaboration_type TEXT NOT NULL,
  budget_range TEXT NOT NULL,
  timeline TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.campaign_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anonymous INSERT campaign_inquiries"
  ON public.campaign_inquiries FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY "Admin SELECT/UPDATE/DELETE campaign_inquiries"
  ON public.campaign_inquiries FOR ALL TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 4. Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  actor TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin SELECT audit_logs"
  ON public.audit_logs FOR SELECT TO authenticated
  USING (auth.role() = 'authenticated');

CREATE POLICY "Server/Admin INSERT audit_logs"
  ON public.audit_logs FOR INSERT TO authenticated, service_role
  WITH CHECK (true);

-- 5. Storage Bucket Policies
INSERT INTO storage.buckets (id, name, public)
VALUES ('reports', 'reports', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public DENY list storage objects"
  ON storage.objects FOR SELECT TO public
  USING (false);

CREATE POLICY "Admin ALL storage objects"
  ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'reports' AND auth.role() = 'authenticated')
  WITH CHECK (bucket_id = 'reports' AND auth.role() = 'authenticated');
