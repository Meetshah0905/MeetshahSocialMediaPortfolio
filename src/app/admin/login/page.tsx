"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/login")
      .then((res) => res.json())
      .then((data: { configured?: boolean }) => {
        if (typeof data.configured === "boolean") {
          setIsConfigured(data.configured);
        }
      })
      .catch(() => {
        setIsConfigured(true);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      if (data.success) {
        router.replace(data.redirectTo || data.redirectUrl || from || "/admin");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl border border-border shadow-soft space-y-6 text-left">
      <div className="space-y-1">
        <span className="text-[10px] font-mono font-bold text-blue uppercase tracking-widest block">
          PROTECTED AREA
        </span>
        <h1 className="font-heading text-2xl font-bold text-ink">
          Admin Portal
        </h1>
        <p className="text-xs text-muted">
          Enter your credentials to manage channel counts and analytics reports.
        </p>
      </div>

      {/* Configuration warning shown ONLY when one or more variables are genuinely missing */}
      {isConfigured === false && (
        <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium space-y-1">
          <p className="font-bold text-amber-900">⚠️ Admin Authentication Not Configured</p>
          <p>
            Server environment variables (ADMIN_EMAIL, ADMIN_PASSWORD, or ANALYTICS_SESSION_SECRET) are missing from .env.local or production configuration.
          </p>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
            Admin Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@meetshah.com"
            className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-ink focus:outline-none focus:border-blue"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-ink focus:outline-none focus:border-blue"
          />
        </div>

        <Button
          type="submit"
          disabled={loading || isConfigured === false}
          className="w-full justify-center bg-blue text-white"
          size="md"
        >
          {loading ? "Authenticating..." : "Sign In to Dashboard"}
        </Button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-surface-soft flex items-center justify-center py-16 px-4">
      <Container className="max-w-md w-full">
        <Suspense fallback={<div className="bg-white p-8 rounded-2xl border border-border text-center text-xs text-muted">Loading Admin Portal...</div>}>
          <AdminLoginForm />
        </Suspense>
      </Container>
    </div>
  );
}
