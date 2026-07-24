import { describe, it, expect } from "vitest";
import { saveReport, listReports } from "@/lib/storage/db";
import { buildReportStoragePath } from "@/lib/storage/supabaseStorage";
import { logReportAudit, listAuditLogs } from "@/lib/storage/auditLog";
import { executeAssistantTool } from "@/ai/assistant-tools";
import type { AnalyticsReport } from "@/lib/storage/reportShared";

describe("YouTube Analytics Report Model & Filter", () => {
  it("saves and retrieves a YouTube Main report with YouTube metrics", async () => {
    const testReport: AnalyticsReport = {
      id: "report-yt-test90",
      slug: "meet-shah-youtube-90-days-test",
      channel: "youtube-main",
      reportWindow: "90",
      periodStart: "2026-05-01",
      periodEnd: "2026-07-29",
      title: "YouTube 90-Day Growth & Shorts Performance Snapshot",
      executiveSummary: "Verified 90-day performance report across YouTube Shorts and long-form videos.",
      highlights: ["Shorts reached 500K views", "Subscribers grew by 1,200"],
      metrics: {
        subscribersStart: 18500,
        subscribersEnd: 19700,
        subscribersGained: 12000,
        shortsViews: 450000,
        longFormViews: 120000,
        watchTimeMinutes: 25000,
      },
      pdfUrl: "/api/reports/report-yt-test90/pdf",
      pdfStorageKey: "youtube-main/2026/90-days/meet-shah-youtube-90-days-test.pdf",
      originalPdfFilename: "meet-shah-youtube-90-days-test.pdf",
      pdfSizeBytes: 1542000,
      status: "published",
      publishedAt: new Date().toISOString(),
      createdByAdminId: "admin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveReport(testReport);

    const list = await listReports({ channel: "youtube-main", publishedOnly: true });
    const found = list.find((r) => r.id === "report-yt-test90");

    expect(found).toBeDefined();
    expect(found?.channel).toBe("youtube-main");
    expect(found?.metrics?.subscribersEnd).toBe(19700);
    expect(found?.metrics?.shortsViews).toBe(450000);
  });
});

describe("Supabase Storage Path Construction", () => {
  it("builds recommended storage path structure", () => {
    const path30 = buildReportStoragePath("youtube-main", "2026-07-01", "30", "Meet Shah YouTube 30d.pdf");
    expect(path30).toBe("youtube-main/2026/30-days/meet-shah-youtube-30d.pdf");

    const path90 = buildReportStoragePath("youtube-main", "2026-05-01", "90", "Meet Shah YouTube 90d.pdf");
    expect(path90).toBe("youtube-main/2026/90-days/meet-shah-youtube-90d.pdf");

    const pathCustom = buildReportStoragePath("youtube-main", "2026-01-01", "custom", "Custom Q1 Report.pdf");
    expect(pathCustom).toBe("youtube-main/2026/custom/custom-q1-report.pdf");
  });
});

describe("Audit Logger", () => {
  it("logs audit entry and retrieves it", async () => {
    const entry = await logReportAudit("published", "report-yt-test90", "admin", {
      channel: "youtube-main",
    });

    expect(entry.action).toBe("published");
    expect(entry.reportId).toBe("report-yt-test90");

    const logs = await listAuditLogs("report-yt-test90");
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].reportId).toBe("report-yt-test90");
  });
});

describe("AI Assistant Report Tooling", () => {
  it("returns published YouTube reports from list_published_reports tool", async () => {
    const res = await executeAssistantTool("list_published_reports", { channel: "youtube-main" });
    const data = res.data as Array<{ channelSlug: string; title: string }>;
    expect(Array.isArray(data)).toBe(true);
    const ytReport = data.find((r) => r.channelSlug === "youtube-main");
    expect(ytReport).toBeDefined();
  });
});
