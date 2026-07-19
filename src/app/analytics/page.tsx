"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ArrowPillButton } from "@/components/ui/ArrowPillButton";
import { FileText, Download, ShieldCheck, BarChart2, Loader2 } from "lucide-react";
import { AIAssistantWidget } from "@/components/ui/AIAssistantWidget";
import { WhiteAtmosphereSection } from "@/components/ui/WhiteAtmosphereSection";

export default function AnalyticsDashboardPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/platforms")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProfiles(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load profiles", err);
        setLoading(false);
      });
  }, []);

  const getProfile = (id: string) => profiles.find((p) => p.id === id);
  const totalFollowers = profiles.reduce((acc, p) => acc + p.currentValue, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoaderSpinner />
      </div>
    );
  }

  return (
    <div className="bg-white text-ink min-h-screen">
      {/* Overview Hero */}
      <WhiteAtmosphereSection grid={true} halo="both" className="pt-24 lg:pt-32 pb-16 bg-white border-b border-border">
        <div className="max-w-4xl text-left space-y-6">
          <Badge className="bg-blue text-white border-transparent">
            VERIFIED MEDIA KIT
          </Badge>
          <h1 className="font-heading text-4xl sm:text-6xl font-bold tracking-tight text-ink leading-tight">
            Audience Insights & <br />
            <span className="text-blue">Performance Reports</span>
          </h1>
          <p className="text-base sm:text-lg text-body max-w-[60ch] leading-relaxed">
            Direct console screenshots verified and analyzed. Use this dashboard to view channel growth, demographics, and download PDF reports.
          </p>
        </div>
      </WhiteAtmosphereSection>

      {/* Community proof strip */}
      <section className="bg-surface-soft border-b border-border py-12">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center divide-y md:divide-y-0 md:divide-x divide-border text-center">
            <div className="p-2">
              <span className="font-heading text-3xl font-bold text-ink block">
                {totalFollowers.toLocaleString()}
              </span>
              <span className="text-[9px] uppercase font-bold text-muted tracking-wider block mt-1.5">
                Total platform follows and subscriptions
              </span>
            </div>
            <div className="p-2 pt-4 md:pt-2">
              <span className="font-heading text-2xl font-bold text-blue block">
                {getProfile("instagram_fitness")?.currentValue.toLocaleString() ?? "11,900"}
              </span>
              <span className="text-[9px] uppercase font-bold text-muted tracking-wider block mt-1.5">
                Instagram Fitness Followers
              </span>
            </div>
            <div className="p-2 pt-4 md:pt-2">
              <span className="font-heading text-2xl font-bold text-ink block">
                {getProfile("instagram_finance")?.currentValue.toLocaleString() ?? "15,100"}
              </span>
              <span className="text-[9px] uppercase font-bold text-muted tracking-wider block mt-1.5">
                Instagram Finance Followers
              </span>
            </div>
            <div className="p-2 pt-4 md:pt-2">
              <span className="font-heading text-2xl font-bold text-blue-deep block">
                {getProfile("youtube_main")?.currentValue.toLocaleString() ?? "19,700"}
              </span>
              <span className="text-[9px] uppercase font-bold text-muted tracking-wider block mt-1.5">
                YouTube Subscribers
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* Archives directories */}
      <WhiteAtmosphereSection halo="left" className="bg-white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Fitness card */}
            <Card className="p-8 border border-border bg-white shadow-soft flex flex-col justify-between h-full min-h-[300px]">
              <div>
                <Badge className="bg-blue-pale text-blue border-transparent">Instagram Fitness</Badge>
                <h3 className="font-heading text-xl font-bold text-ink mt-4">Fitness Insights Archive</h3>
                <p className="text-xs text-body mt-2 leading-relaxed">
                  Track weekly reach, video views, and target bodybuilding demographics.
                </p>
              </div>
              <div className="pt-8 flex gap-3">
                <ArrowPillButton href="/analytics/fitness" size="md" className="flex-1 text-center justify-center">
                  View Archive
                </ArrowPillButton>
                <a
                  href="/api/reports/latest-fitness/pdf"
                  className="size-10 rounded-full border border-border flex items-center justify-center text-ink hover:border-blue transition-colors shrink-0"
                  title="Download latest PDF"
                >
                  <Download className="size-4" />
                </a>
              </div>
            </Card>

            {/* Finance card */}
            <Card className="p-8 border border-border bg-white shadow-soft flex flex-col justify-between h-full min-h-[300px]">
              <div>
                <Badge className="bg-blue-pale text-blue border-transparent">Instagram Finance</Badge>
                <h3 className="font-heading text-xl font-bold text-ink mt-4">Finance Insights Archive</h3>
                <p className="text-xs text-body mt-2 leading-relaxed">
                  Analyze fintech audience reach, compliance logs, and demographics.
                </p>
              </div>
              <div className="pt-8 flex gap-3">
                <ArrowPillButton href="/analytics/finance" size="md" className="flex-1 text-center justify-center">
                  View Archive
                </ArrowPillButton>
                <a
                  href="/api/reports/latest-finance/pdf"
                  className="size-10 rounded-full border border-border flex items-center justify-center text-ink hover:border-blue transition-colors shrink-0"
                  title="Download latest PDF"
                >
                  <Download className="size-4" />
                </a>
              </div>
            </Card>

            {/* YouTube card */}
            <Card className="p-8 border border-border bg-white shadow-soft flex flex-col justify-between h-full min-h-[300px]">
              <div>
                <Badge className="bg-blue-pale text-blue border-transparent">YouTube Main</Badge>
                <h3 className="font-heading text-xl font-bold text-ink mt-4">YouTube Insights Archive</h3>
                <p className="text-xs text-body mt-2 leading-relaxed">
                  Review subscriber changes, views, watch time, and CTR indices.
                </p>
              </div>
              <div className="pt-8 flex gap-3">
                <ArrowPillButton href="/analytics/youtube" size="md" className="flex-1 text-center justify-center">
                  View Archive
                </ArrowPillButton>
                <a
                  href="/api/reports/latest-youtube/pdf"
                  className="size-10 rounded-full border border-border flex items-center justify-center text-ink hover:border-blue transition-colors shrink-0"
                  title="Download latest PDF"
                >
                  <Download className="size-4" />
                </a>
              </div>
            </Card>
          </div>
        </Container>
      </WhiteAtmosphereSection>

      {/* Floating chatbot widget */}
      <AIAssistantWidget />
    </div>
  );
}

function LoaderSpinner() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Loader2 className="size-6 animate-spin text-blue" />
      <span className="text-[10px] uppercase font-bold text-muted tracking-widest">
        Loading analytics profiles
      </span>
    </div>
  );
}
