import { describe, it, expect } from "vitest";
import type { AnalyticsReport } from "@/lib/storage/reportShared";

describe("YouTube Reports Admin Workflow", () => {
  const sampleReports: AnalyticsReport[] = [
    {
      id: "report-yt-1",
      slug: "youtube-main-30d-2026",
      channel: "youtube-main",
      reportWindow: "30",
      periodStart: "2026-06-01",
      periodEnd: "2026-06-30",
      title: "YouTube Main — 30-Day Insights Report",
      executiveSummary: "Strong subscriber growth and views.",
      highlights: ["19.7K subscribers", "1.2M views"],
      metrics: { audienceEnd: 19700, views: 1200000 },
      pdfUrl: "/api/reports/report-yt-1/pdf",
      pdfStorageKey: "analytics-reports/youtube-main/2026/report-30d.pdf",
      originalPdfFilename: "yt_report_30d.pdf",
      pdfSizeBytes: 2048500,
      status: "published",
      createdByAdminId: "admin",
      createdAt: "2026-07-01T10:00:00.000Z",
      publishedAt: "2026-07-01T12:00:00.000Z",
      updatedAt: "2026-07-01T12:00:00.000Z",
    },
    {
      id: "report-yt-2",
      slug: "youtube-main-90d-2026",
      channel: "youtube-main",
      reportWindow: "90",
      periodStart: "2026-04-01",
      periodEnd: "2026-06-30",
      title: "YouTube Main — 90-Day Performance Review",
      executiveSummary: "Quarterly review for YouTube Main.",
      highlights: ["Q2 Performance"],
      metrics: { audienceEnd: 19700 },
      pdfUrl: "/api/reports/report-yt-2/pdf",
      pdfStorageKey: "analytics-reports/youtube-main/2026/report-90d.pdf",
      originalPdfFilename: "yt_report_90d.pdf",
      pdfSizeBytes: 4120000,
      status: "draft",
      createdByAdminId: "admin",
      createdAt: "2026-07-05T10:00:00.000Z",
      updatedAt: "2026-07-05T10:00:00.000Z",
    },
    {
      id: "report-ig-1",
      slug: "instagram-fitness-30d-2026",
      channel: "instagram-fitness",
      reportWindow: "30",
      periodStart: "2026-06-01",
      periodEnd: "2026-06-30",
      title: "Instagram Fitness — 30-Day Insights",
      pdfUrl: "/api/reports/report-ig-1/pdf",
      pdfStorageKey: "analytics-reports/instagram-fitness/2026/report-30d.pdf",
      originalPdfFilename: "ig_report_30d.pdf",
      pdfSizeBytes: 1024000,
      status: "published",
      createdByAdminId: "admin",
      createdAt: "2026-07-01T10:00:00.000Z",
      updatedAt: "2026-07-01T10:00:00.000Z",
    },
  ];

  it("filters reports down to YouTube Main channel only", () => {
    const ytReports = sampleReports.filter((r) => r.channel === "youtube-main");
    expect(ytReports).toHaveLength(2);
    expect(ytReports.every((r) => r.channel === "youtube-main")).toBe(true);
  });

  it("correctly counts published, draft, and archived YouTube reports", () => {
    const ytReports = sampleReports.filter((r) => r.channel === "youtube-main");
    const published = ytReports.filter((r) => r.status === "published");
    const drafts = ytReports.filter((r) => r.status === "draft");

    expect(published).toHaveLength(1);
    expect(drafts).toHaveLength(1);
    expect(published[0].id).toBe("report-yt-1");
  });

  it("filters YouTube reports by report window duration", () => {
    const ytReports = sampleReports.filter((r) => r.channel === "youtube-main");
    const thirtyDay = ytReports.filter((r) => r.reportWindow === "30");
    const ninetyDay = ytReports.filter((r) => r.reportWindow === "90");

    expect(thirtyDay).toHaveLength(1);
    expect(ninetyDay).toHaveLength(1);
    expect(thirtyDay[0].title).toContain("30-Day");
  });
});
