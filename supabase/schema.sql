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
  ON public.creator_channels FOR ALL TO authenticated, service_role
  USING (true)
  WITH CHECK (true);

-- 2. Analytics Reports (Central Production Table)
CREATE TABLE IF NOT EXISTS public.analytics_reports (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  channel TEXT NOT NULL CHECK (channel IN ('instagram-fitness', 'instagram-finance', 'youtube-main')),
  report_window TEXT NOT NULL CHECK (report_window IN ('30', '60', '90', 'custom')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  title TEXT NOT NULL,
  executive_summary TEXT,
  highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
  metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
  pdf_url TEXT,
  pdf_storage_path TEXT,
  original_pdf_filename TEXT,
  pdf_size_bytes BIGINT,
  cover_storage_path TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS analytics_reports_channel_idx ON public.analytics_reports(channel);
CREATE INDEX IF NOT EXISTS analytics_reports_status_idx ON public.analytics_reports(status);
CREATE INDEX IF NOT EXISTS analytics_reports_published_at_idx ON public.analytics_reports(published_at DESC);
CREATE INDEX IF NOT EXISTS analytics_reports_created_at_idx ON public.analytics_reports(created_at DESC);

-- Enable RLS
ALTER TABLE public.analytics_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can read published reports"
  ON public.analytics_reports FOR SELECT TO anon, authenticated, public
  USING (status = 'published');

CREATE POLICY "Service role and admin full access to analytics_reports"
  ON public.analytics_reports FOR ALL TO service_role, authenticated
  USING (true)
  WITH CHECK (true);

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
  ON public.campaign_inquiries FOR ALL TO authenticated, service_role
  USING (true)
  WITH CHECK (true);

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
  ON public.audit_logs FOR SELECT TO authenticated, service_role
  USING (true);

CREATE POLICY "Server/Admin INSERT audit_logs"
  ON public.audit_logs FOR INSERT TO authenticated, service_role
  WITH CHECK (true);

-- 5. Storage Buckets (Private Analytics Reports Bucket)
INSERT INTO storage.buckets (id, name, public)
VALUES ('analytics-reports', 'analytics-reports', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Admin full storage access on analytics-reports"
  ON storage.objects FOR ALL TO authenticated, service_role
  USING (bucket_id = 'analytics-reports')
  WITH CHECK (bucket_id = 'analytics-reports');

