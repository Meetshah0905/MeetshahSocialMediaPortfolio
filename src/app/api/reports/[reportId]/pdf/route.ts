import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { isAuthenticated } from "@/lib/auth/session";
import {
  getReport,
  getLatestPublishedReport,
  isChannelSlug,
} from "@/lib/storage/db";

/**
 * Public PDF download.
 *
 * Serves the reviewed PDF of a PUBLISHED report only. Drafts and archived
 * records 404 to the public so their existence isn't leaked.
 *
 * When Vercel Blob is used, the file already sits at a public URL — we 302
 * to it with a clean Content-Disposition. When the local dev fallback is
 * used, we stream the file from public/uploads with the right headers.
 *
 * The `latest-fitness` / `latest-finance` / `latest-youtube` aliases return
 * the newest published report for each channel — used by the /analytics
 * archive-card download shortcuts.
 */

const LATEST_ALIASES: Record<string, "instagram-fitness" | "instagram-finance" | "youtube-main"> = {
  "latest-fitness": "instagram-fitness",
  "latest-finance": "instagram-finance",
  "latest-youtube": "youtube-main",
};

function friendlyDownloadName(input: {
  channel: string;
  reportWindow: string;
  periodStart: string;
  periodEnd: string;
}): string {
  const win = input.reportWindow === "custom" ? "custom" : `${input.reportWindow}-days`;
  return `meet-shah-${input.channel}-${win}-${input.periodStart}-to-${input.periodEnd}.pdf`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ reportId: string }> },
) {
  const { reportId } = await params;

  let report = null;
  if (LATEST_ALIASES[reportId]) {
    report = await getLatestPublishedReport(LATEST_ALIASES[reportId]);
  } else {
    report = await getReport(reportId);
  }

  if (!report || !report.pdfUrl) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  const isAdmin = await isAuthenticated(request);
  if (report.status !== "published" && !isAdmin) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  const disposition = request.nextUrl.searchParams.get("download") === "1"
    ? "attachment"
    : "inline";
  const filename = friendlyDownloadName(report);

  // Local dev fallback: file exists under public/uploads/
  if (report.pdfStorageKey) {
    const cleanKey = report.pdfStorageKey.replace(/^\/+/, "");
    const localPath = path.join(process.cwd(), "public", "uploads", cleanKey);
    if (fs.existsSync(localPath)) {
      const data = fs.readFileSync(localPath);
      return new NextResponse(data, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `${disposition}; filename="${filename}"`,
          "Cache-Control": "public, max-age=300",
        },
      });
    }
  }

  if (report.pdfUrl.startsWith("/uploads/")) {
    return NextResponse.json({ error: "PDF missing from storage" }, { status: 410 });
  }

  // Vercel Blob: the URL is already public — redirect with the friendly name.
  try {
    const url = new URL(report.pdfUrl);
    const response = NextResponse.redirect(url, 302);
    response.headers.set(
      "Content-Disposition",
      `${disposition}; filename="${filename}"`,
    );
    return response;
  } catch {
    return NextResponse.json({ error: "Invalid PDF storage URL" }, { status: 500 });
  }
}
