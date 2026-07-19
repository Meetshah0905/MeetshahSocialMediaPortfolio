"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loader2, ShieldCheck, History, Save, RefreshCw, LogOut, Lock } from "lucide-react";

type PlatformProfile = {
  id: "instagram_fitness" | "instagram_finance" | "youtube_main";
  platform: "instagram" | "youtube";
  displayName: string;
  handle: string | null;
  primaryMetric: "followers" | "subscribers";
  currentValue: number;
  updatedAt: string;
};

type MetricSnapshot = {
  id: string;
  value: number;
  effectiveAt: string;
  createdAt: string;
  source: string;
};

export default function AdminPlatformsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [profiles, setProfiles] = useState<PlatformProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Form states
  const [newValues, setNewValues] = useState<Record<string, string>>({});
  const [effectiveDates, setEffectiveDates] = useState<Record<string, string>>({});
  const [historyLogs, setHistoryLogs] = useState<Record<string, MetricSnapshot[]>>({});
  const [showHistoryFor, setShowHistoryFor] = useState<string | null>(null);

  // Check initial session
  useEffect(() => {
    fetch("/api/admin/platforms")
      .then((res) => {
        // Check if list returns or if we are not authenticated
        // To be safe, we check if user can read the lists. If not authenticated, we'll request a check
        return fetch("/api/admin/platforms");
      })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProfiles(data);
          setIsAuthenticated(true);
          setLoading(false);
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
        loadProfiles();
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
    setProfiles([]);
  };

  const loadProfiles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/platforms");
      const data = await res.json();
      if (Array.isArray(data)) {
        setProfiles(data);
      }
    } catch (err) {
      console.error("Failed to load profiles", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (profileId: string) => {
    const valStr = newValues[profileId];
    if (!valStr || isNaN(Number(valStr))) {
      alert("Please enter a valid positive number");
      return;
    }

    setUpdatingId(profileId);
    try {
      const res = await fetch(`/api/admin/platforms/${profileId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          value: Number(valStr),
          effectiveAt: effectiveDates[profileId] || new Date().toISOString(),
        }),
      });

      if (res.ok) {
        alert("Platform count successfully updated and snapshotted!");
        // Reset form
        setNewValues((prev) => ({ ...prev, [profileId]: "" }));
        loadProfiles();
        if (showHistoryFor === profileId) {
          loadHistory(profileId);
        }
      } else {
        const errData = await res.json();
        alert(`Update failed: ${errData.error}`);
      }
    } catch (err) {
      alert("Failed to update");
    } finally {
      setUpdatingId(null);
    }
  };

  const loadHistory = async (profileId: string) => {
    try {
      const res = await fetch(`/api/admin/platforms/${profileId}`);
      if (res.ok) {
        const data = await res.json();
        setHistoryLogs((prev) => ({ ...prev, [profileId]: data }));
      }
    } catch (err) {
      console.error("Failed to load history logs", err);
    }
  };

  const toggleHistory = (profileId: string) => {
    if (showHistoryFor === profileId) {
      setShowHistoryFor(null);
    } else {
      setShowHistoryFor(profileId);
      loadHistory(profileId);
    }
  };

  // Revert function
  const handleRevert = async (profileId: string, historyVal: number) => {
    if (!confirm(`Are you sure you want to revert value to ${historyVal.toLocaleString()}?`)) {
      return;
    }
    setUpdatingId(profileId);
    try {
      const res = await fetch(`/api/admin/platforms/${profileId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          value: historyVal,
          effectiveAt: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        alert("Reverted successfully!");
        loadProfiles();
        loadHistory(profileId);
      }
    } catch (err) {
      alert("Revert failed");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading && isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-blue" />
      </div>
    );
  }

  // 1. PASSCODE LOGIN FORM
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-surface-soft flex items-center justify-center px-6">
        <Card className="w-full max-w-md p-8 border border-border bg-white shadow-soft text-center flex flex-col items-center">
          <div className="size-12 rounded-full bg-blue/10 flex items-center justify-center text-blue border border-blue-pale mb-4">
            <Lock className="size-5" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-ink">Admin Passcode</h2>
          <p className="text-xs text-body mt-2">
            Enter the administrator passcode to manage follower and subscriber counts.
          </p>

          <form onSubmit={handleLogin} className="w-full mt-6 space-y-4">
            <div>
              <input
                type="password"
                placeholder="Passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full border border-border px-4 py-3 rounded-lg text-sm bg-surface-soft focus:outline-none focus:border-blue text-center font-mono"
                required
              />
            </div>
            {authError && <p className="text-xs font-bold text-danger">{authError}</p>}
            <Button
              type="submit"
              disabled={loggingIn}
              className="w-full bg-blue text-white hover:bg-blue-deep"
            >
              {loggingIn ? <Loader2 className="size-4 animate-spin" /> : "Access Dashboard"}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  // 2. LIVE ADMIN DASHBOARD
  return (
    <div className="bg-white text-ink min-h-screen py-24 border-t border-border">
      <Container>
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 border-b border-border pb-6">
          <div>
            <div className="flex gap-2 items-center">
              <Badge className="bg-blue/10 text-blue border-transparent">
                Platform Editor
              </Badge>
              <span className="text-[10px] text-success font-bold flex gap-1 items-center uppercase tracking-wider">
                <ShieldCheck className="size-3.5" />
                Secure Admin Mode
              </span>
            </div>
            <h1 className="font-heading text-3xl font-bold text-ink mt-2">
              Platform Metrics Editor
            </h1>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={loadProfiles}
              className="bg-transparent border-border text-ink hover:bg-surface-soft"
              size="sm"
            >
              <RefreshCw className="size-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={handleLogout}
              className="bg-danger hover:bg-danger/90 text-white border-transparent"
              size="sm"
            >
              <LogOut className="size-4 mr-2" />
              Logout Session
            </Button>
          </div>
        </div>

        {/* Rows listing */}
        <div className="space-y-6">
          {profiles.map((profile) => {
            const hist = historyLogs[profile.id] || [];
            const isHistOpen = showHistoryFor === profile.id;

            return (
              <Card key={profile.id} className="p-6 border border-border bg-white shadow-xs">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* Info details */}
                  <div className="lg:col-span-3">
                    <h3 className="font-heading text-lg font-bold text-ink">{profile.displayName}</h3>
                    <p className="text-xs text-muted font-mono mt-1">
                      {profile.handle || "No handle"}
                    </p>
                    <div className="mt-3">
                      <span className="text-[9px] uppercase font-bold text-muted block">Current Value</span>
                      <span className="font-heading text-2xl font-bold text-blue block mt-0.5">
                        {profile.currentValue.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Form inline controls */}
                  <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-bold text-muted uppercase tracking-wider block mb-1">
                        New Count ({profile.primaryMetric})
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 12100"
                        value={newValues[profile.id] || ""}
                        onChange={(e) => setNewValues((prev) => ({ ...prev, [profile.id]: e.target.value }))}
                        className="w-full border border-border px-3.5 py-2.5 rounded-lg text-xs bg-surface-soft focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-muted uppercase tracking-wider block mb-1">
                        Effective Date
                      </label>
                      <input
                        type="date"
                        value={effectiveDates[profile.id] || new Date().toISOString().split("T")[0]}
                        onChange={(e) => setEffectiveDates((prev) => ({ ...prev, [profile.id]: e.target.value }))}
                        className="w-full border border-border px-3.5 py-2.5 rounded-lg text-xs bg-surface-soft focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Save button actions */}
                  <div className="lg:col-span-3 flex gap-2 w-full justify-end">
                    <button
                      onClick={() => toggleHistory(profile.id)}
                      className="inline-flex items-center gap-2 border border-border hover:border-blue hover:text-blue px-4 py-2.5 rounded-lg text-xs font-semibold bg-white transition-colors"
                    >
                      <History className="size-4" />
                      History
                    </button>
                    <button
                      onClick={() => handleUpdate(profile.id)}
                      disabled={updatingId === profile.id}
                      className="inline-flex items-center gap-2 bg-blue hover:bg-blue-deep text-white px-4 py-2.5 rounded-lg text-xs font-semibold disabled:opacity-40 transition-colors"
                    >
                      {updatingId === profile.id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <>
                          <Save className="size-4" />
                          Save Count
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* History popup listing inside card */}
                {isHistOpen && (
                  <div className="mt-6 pt-6 border-t border-border space-y-3">
                    <h4 className="font-heading text-xs font-bold text-ink">Historical Snapshots</h4>
                    {hist.length === 0 ? (
                      <p className="text-[11px] text-body">No previous updates recorded.</p>
                    ) : (
                      <div className="overflow-hidden border border-border rounded-lg bg-surface-soft divide-y divide-border">
                        {hist.map((snap) => (
                          <div key={snap.id} className="p-3 flex justify-between items-center text-[11px] text-body">
                            <div>
                              <span className="font-bold text-ink">
                                {snap.value.toLocaleString()} {profile.primaryMetric}
                              </span>
                              <span className="mx-2 text-muted">|</span>
                              <span>Effective: {new Date(snap.effectiveAt).toLocaleDateString()}</span>
                              <span className="mx-2 text-muted">|</span>
                              <span className="text-muted text-[10px] uppercase font-bold">Source: {snap.source}</span>
                            </div>
                            {snap.value !== profile.currentValue && (
                              <button
                                onClick={() => handleRevert(profile.id, snap.value)}
                                className="text-blue hover:underline font-bold text-[10px] uppercase tracking-wider"
                              >
                                Revert to this
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
