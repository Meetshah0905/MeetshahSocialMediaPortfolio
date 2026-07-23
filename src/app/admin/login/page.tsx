"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        throw new Error(data.error || "Authentication failed");
      }

      router.push("/admin/channels");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-soft flex items-center justify-center py-16 px-4">
      <Container className="max-w-md w-full">
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
              disabled={loading}
              className="w-full justify-center bg-blue text-white"
              size="md"
            >
              {loading ? "Authenticating..." : "Sign In to Dashboard"}
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}
