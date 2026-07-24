"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { AdminBackButton } from "@/components/admin/AdminBackButton";
import type { ProposalInquiry, ProposalStatus } from "@/lib/storage/proposals";

type Filter = "all" | ProposalStatus;

export default function AdminProposalsPage() {
  const [proposals, setProposals] = useState<ProposalInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const loadProposals = async () => {
    try {
      const res = await fetch("/api/admin/proposals");
      if (!res.ok) {
        throw new Error("Failed to load proposals");
      }
      const data = await res.json();
      setProposals(Array.isArray(data) ? data : []);
      setError(null);
    } catch {
      setError("Could not load campaign proposals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(loadProposals);
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: ProposalStatus) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/proposals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to update status");
      }
      await loadProposals();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this proposal inquiry?")) {
      return;
    }
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/proposals/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to delete proposal");
      }
      await loadProposals();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  const filtered = proposals.filter((p) => {
    const matchesFilter = filter === "all" ? true : p.status === filter;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.vertical.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const countByStatus = {
    all: proposals.length,
    new: proposals.filter((p) => p.status === "new").length,
    reviewed: proposals.filter((p) => p.status === "reviewed").length,
    contacted: proposals.filter((p) => p.status === "contacted").length,
    archived: proposals.filter((p) => p.status === "archived").length,
  };

  return (
    <div className="min-h-screen bg-surface-soft py-12 text-ink">
      <Container className="max-w-[1280px] px-6 space-y-8 text-left">
        <AdminBackButton href="/admin/channels" label="Back to Channel Metrics" />

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <span className="text-[10px] font-mono font-bold text-blue uppercase tracking-widest block">
              CAMPAIGN INQUIRIES MANAGEMENT
            </span>
            <h1 className="font-heading text-3xl font-bold text-ink">
              Proposal Submissions ({proposals.length})
            </h1>
            <p className="mt-1 text-xs text-muted">
              Review and manage incoming campaign proposal inquiries submitted via the contact page.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/admin/channels"
              className="rounded-lg border border-border bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink hover:border-blue/30"
            >
              Channel Metrics
            </Link>
            <Link
              href="/admin/reports"
              className="rounded-lg border border-border bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink hover:border-blue/30"
            >
              View Reports
            </Link>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter proposals">
            {(["all", "new", "reviewed", "contacted", "archived"] as const).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={filter === key}
                onClick={() => setFilter(key)}
                className={`rounded-full border px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                  filter === key
                    ? "border-blue bg-blue text-white"
                    : "border-border bg-white text-ink hover:border-blue/30"
                }`}
              >
                {key} ({countByStatus[key]})
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search proposals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 px-3.5 py-1.5 rounded-lg border border-border text-xs font-mono text-ink focus:outline-none focus:border-blue bg-white"
          />
        </div>

        {error && (
          <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 font-semibold">
            {error}
          </div>
        )}

        {/* Proposals List */}
        {loading ? (
          <div className="p-12 text-center font-mono text-xs text-muted" role="status">
            Loading proposal inquiries...
          </div>
        ) : filtered.length === 0 ? (
          <div className="space-y-2 rounded-2xl border border-border bg-white p-12 text-center">
            <p className="font-heading text-sm font-bold text-ink">No proposal inquiries found.</p>
            <p className="text-xs text-muted">
              {searchQuery || filter !== "all"
                ? "Try adjusting your filter or search criteria."
                : "New submissions from the contact form will appear here."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((item) => (
              <ProposalCard
                key={item.id}
                proposal={item}
                busy={busyId === item.id}
                onUpdateStatus={handleUpdateStatus}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

function ProposalCard({
  proposal,
  busy,
  onUpdateStatus,
  onDelete,
}: {
  proposal: ProposalInquiry;
  busy: boolean;
  onUpdateStatus: (id: string, status: ProposalStatus) => void;
  onDelete: (id: string) => void;
}) {
  const statusStyles: Record<ProposalStatus, string> = {
    new: "bg-blue-50 border-blue-200 text-blue-700 font-bold",
    reviewed: "bg-purple-50 border-purple-200 text-purple-700",
    contacted: "bg-emerald-50 border-emerald-200 text-emerald-700",
    archived: "bg-slate-50 border-slate-200 text-slate-600",
  };

  const formattedDate = new Date(proposal.createdAt).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-soft flex flex-col gap-5 text-left transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider ${statusStyles[proposal.status]}`}>
              {proposal.status}
            </span>
            <span className="font-mono text-xs text-muted">
              Submitted: {formattedDate}
            </span>
          </div>
          <h3 className="font-heading text-xl font-bold text-ink">
            {proposal.name} <span className="text-muted font-normal">from</span> {proposal.brand}
          </h3>
        </div>

        <a
          href={`mailto:${proposal.email}?subject=Re: Campaign Proposal - ${encodeURIComponent(proposal.brand)}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue hover:underline bg-blue/5 px-3 py-1.5 rounded-lg border border-blue/20 self-start sm:self-auto"
        >
          ✉ {proposal.email}
        </a>
      </div>

      {/* Campaign Metadata Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-surface-soft p-4 rounded-xl border border-border/60 text-xs">
        <div>
          <span className="text-[10px] font-mono text-muted uppercase font-bold tracking-wider block mb-0.5">
            Collaboration Type
          </span>
          <span className="font-semibold text-ink">{proposal.vertical}</span>
        </div>
        <div>
          <span className="text-[10px] font-mono text-muted uppercase font-bold tracking-wider block mb-0.5">
            Budget Range
          </span>
          <span className="font-semibold text-ink">{proposal.budget}</span>
        </div>
        <div>
          <span className="text-[10px] font-mono text-muted uppercase font-bold tracking-wider block mb-0.5">
            Timeline
          </span>
          <span className="font-semibold text-ink">{proposal.timeline}</span>
        </div>
      </div>

      {/* Proposal Message */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono text-muted uppercase font-bold tracking-wider block">
          Campaign Details / Message
        </span>
        <div className="p-4 rounded-xl bg-white border border-border/80 text-xs leading-relaxed text-ink whitespace-pre-wrap">
          {proposal.message}
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono text-muted uppercase font-bold">Set Status:</span>
          {proposal.status !== "reviewed" && (
            <button
              type="button"
              disabled={busy}
              onClick={() => onUpdateStatus(proposal.id, "reviewed")}
              className="rounded-lg border border-border bg-surface-soft px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-ink hover:border-purple-300 hover:bg-purple-50 disabled:opacity-50"
            >
              Mark Reviewed
            </button>
          )}
          {proposal.status !== "contacted" && (
            <button
              type="button"
              disabled={busy}
              onClick={() => onUpdateStatus(proposal.id, "contacted")}
              className="rounded-lg border border-border bg-surface-soft px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-ink hover:border-emerald-300 hover:bg-emerald-50 disabled:opacity-50"
            >
              Mark Contacted
            </button>
          )}
          {proposal.status !== "archived" && (
            <button
              type="button"
              disabled={busy}
              onClick={() => onUpdateStatus(proposal.id, "archived")}
              className="rounded-lg border border-border bg-surface-soft px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-ink hover:border-slate-300 hover:bg-slate-100 disabled:opacity-50"
            >
              Archive
            </button>
          )}
          {proposal.status !== "new" && (
            <button
              type="button"
              disabled={busy}
              onClick={() => onUpdateStatus(proposal.id, "new")}
              className="rounded-lg border border-border bg-surface-soft px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-ink hover:border-blue-300 hover:bg-blue-50 disabled:opacity-50"
            >
              Mark New
            </button>
          )}
        </div>

        <button
          type="button"
          disabled={busy}
          onClick={() => onDelete(proposal.id)}
          className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-red-700 hover:bg-red-50 disabled:opacity-50"
        >
          Delete Proposal
        </button>
      </div>
    </div>
  );
}
