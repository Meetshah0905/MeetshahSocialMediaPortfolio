"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowPillButton } from "@/components/ui/ArrowPillButton";
import { Loader2, ShieldCheck, Lock, LogOut, RefreshCw, FileText, Globe, EyeOff, Layout, Plus } from "lucide-react";

export default function AnalyticsAdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [reports, setReports] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  // Check session
  useEffect(() => {
    fetch("/api/admin/platforms")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setIsAuthenticated(true);
          loadDashboardData();
        } else {
          setIsAuthenticated(false);
          setLoading(false);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
        setLoading(false);
      });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setLoggingIn(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        loadDashboardData();
      } else {
        setAuthError(data.error || "Incorrect passcode");
      }
    } catch (err) {
      setAuthError("Failed to authenticate");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAuthenticated(false);
    setReports([]);
    setProfiles([]);
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [profRes, repRes] = await Promise.all([
        fetch("/api/admin/platforms"),
        fetch("/api/reports"),
      ]);
      const profData = await profRes.json();
      const repData = await repRes.json();
      
      if (Array.isArray(profData)) setProfiles(profData);
      if (Array.isArray(repData)) setReports(repData);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  // Publish / Unpublish actions
  const togglePublish = async (reportId: string, currentStatus: "draft" | "published") => {
    setActionId(reportId);
    const action = currentStatus === "published" ? "unpublish" : "publish";

    try {
      const res = await fetch(`/api/admin/reports/${reportId}/${action}`, {
        method: "POST",
      });

      if (res.ok) {
        loadDashboardData();
      } else {
        alert(`Failed to ${action} report`);
      }
    } catch (err) {
      alert("Error executing action");
    } finally {
      setActionId(null);
    }
  };

  if (loading && isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-blue" />
      </div>
    );
  }

  // Auth passcode block
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-surface-soft flex items-center justify-center px-6">
        <Card className="w-full max-w-md p-8 border border-border bg-white shadow-soft text-center flex flex-col items-center">
          <div className="size-12 rounded-full bg-blue/10 flex items-center justify-center text-blue border border-blue-pale mb-4">
            <Lock className="size-5" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-ink">Creator Admin Access</h2>
          <form onSubmit={handleLogin} className="w-full mt-6 space-y-4">
            <input
              type="password"
              placeholder="Passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full border border-border px-4 py-3 rounded-lg text-sm bg-surface-soft focus:outline-none focus:border-blue text-center font-mono"
              required
            />
            {authError && <p className="text-xs font-bold text-danger">{authError}</p>}
            <Button type="submit" disabled={loggingIn} className="w-full bg-blue text-white">
              Access Dashboard
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-white text-ink min-h-screen py-24 border-t border-border">
      <Container>
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 border-b border-border pb-6">
          <div>
            <div className="flex gap-2 items-center">
              <Badge className="bg-blue/10 text-blue border-transparent">Admin Panel</Badge>
              <span className="text-[10px] text-success font-bold flex gap-1 items-center uppercase tracking-wider">
                <ShieldCheck className="size-3.5" /> Secure Session
              </span>
            </div>
            <h1 className="font-heading text-3xl font-bold text-ink mt-2">Creator Hub</h1>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={loadDashboardData}
              className="bg-transparent border-border text-ink hover:bg-surface-soft"
              size="sm"
            >
              <RefreshCw className="size-4 mr-2" /> Refresh
            </Button>
            <Button
              onClick={handleLogout}
              className="bg-danger hover:bg-danger/90 text-white border-transparent"
              size="sm"
            >
              <LogOut className="size-4 mr-2" /> Logout
            </Button>
          </div>
        </div>

        {/* Quick Link Tools grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Metrics editor card */}
          <Card className="p-6 border border-border bg-surface-soft hover:border-blue/20 transition-all flex flex-col justify-between h-full min-h-[180px]">
            <div>
              <Layout className="size-5 text-blue mb-3" />
              <h3 className="font-heading text-sm font-bold text-ink">Manage Live Platform Counts</h3>
              <p className="text-[11px] text-body mt-2 leading-relaxed">
                Update current followers and subscriber numbers displayed on the homepage proof strip. Creates metric updates audit history log.
              </p>
            </div>
            <div className="pt-6">
              <ArrowPillButton href="/analytics/admin/platforms" size="md">
                Open Counts Editor
              </ArrowPillButton>
            </div>
          </Card>

          {/* New report wizard card */}
          <Card className="p-6 border border-border bg-surface-soft hover:border-blue/20 transition-all flex flex-col justify-between h-full min-h-[180px]">
            <div>
              <Plus className="size-5 text-blue mb-3" />
              <h3 className="font-heading text-sm font-bold text-ink">New Insights Report</h3>
              <p className="text-[11px] text-body mt-2 leading-relaxed">
                Upload console insights screenshots and run Gemini server-side extraction to generate demographic performance analytics.
              </p>
            </div>
            <div className="pt-6">
              <ArrowPillButton href="/analytics/admin/reports/new" size="md">
                Launch Report Wizard
              </ArrowPillButton>
            </div>
          </Card>
        </div>

        {/* Reports Archive Grid */}
        <div className="space-y-6">
          <h2 className="font-heading text-lg font-bold text-ink">All Verification Reports ({reports.length})</h2>

          {reports.length === 0 ? (
            <Card className="p-12 text-center border border-border bg-white rounded-panel max-w-xl mx-auto flex flex-col items-center">
              <FileText className="size-8 text-muted mb-4" />
              <h3 className="font-heading text-sm font-bold text-ink">No reports found</h3>
              <p className="text-xs text-body mt-1">Use the wizard to create draft report metrics.</p>
            </Card>
          ) : (
            <div className="overflow-hidden border border-border rounded-panel bg-white divide-y divide-border shadow-xs">
              {reports.map((report) => (
                <div key={report.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  <div>
                    <div className="flex gap-2 items-center">
                      <Badge className="bg-blue-pale text-blue border-transparent capitalize text-[9px]">
                        {report.persona.replace("_", " ")}
                      </Badge>
                      <Badge
                        className={`border-transparent text-[9px] ${
                          report.status === "published"
                            ? "bg-success/15 text-success"
                            : "bg-warning/15 text-warning"
                        }`}
                      >
                        {report.status}
                      </Badge>
                    </div>
                    <h3 className="font-heading text-base font-bold text-ink mt-2">
                      Report: {report.period.label}
                    </h3>
                    <p className="text-[10px] text-muted font-mono mt-1">
                      ID: {report.id} • Created: {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => togglePublish(report.id, report.status)}
                      disabled={actionId === report.id}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                        report.status === "published"
                          ? "border-warning text-warning hover:bg-warning/5"
                          : "border-success text-success hover:bg-success/5"
                      }`}
                    >
                      {actionId === report.id ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : report.status === "published" ? (
                        <>
                          <EyeOff className="size-3.5" /> Unpublish
                        </>
                      ) : (
                        <>
                          <Globe className="size-3.5" /> Publish
                        </>
                      )}
                    </button>
                    <a
                      href={`/api/reports/${report.id}/pdf`}
                      className="inline-flex min-h-9 items-center justify-center border border-border hover:border-blue hover:text-blue px-4 rounded-lg text-xs font-semibold transition-colors bg-white text-ink"
                    >
                      PDF
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
