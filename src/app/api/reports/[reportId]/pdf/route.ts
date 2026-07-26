import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { isAuthenticated } from "@/lib/auth/session";
import {
  getReport,
  getLatestPublishedReport,
} from "@/lib/storage/db";
import { getReportSignedUrl } from "@/lib/storage/supabaseStorage";

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

  // Handle Data URL (Base64 PDF fallback for serverless environments)
  if (report.pdfUrl && report.pdfUrl.startsWith("data:application/pdf;base64,")) {
    const base64Data = report.pdfUrl.replace(/^data:application\/pdf;base64,/, "");
    const pdfBuffer = Buffer.from(base64Data, "base64");
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${disposition}; filename="${filename}"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  // Check Supabase Storage or Local Filesystem
  if (report.pdfStorageKey) {
    try {
      const signedUrl = await getReportSignedUrl(report.pdfStorageKey, 3600);
      if (signedUrl && signedUrl.startsWith("http")) {
        const response = NextResponse.redirect(signedUrl, 302);
        response.headers.set(
          "Content-Disposition",
          `${disposition}; filename="${filename}"`
        );
        return response;
      }
    } catch {
      // Fallback to local streaming
    }

    const cleanKey = report.pdfStorageKey.replace(/^\/+/, "");
    const normalizedSubPath = cleanKey.startsWith("reports/")
      ? cleanKey.slice("reports/".length)
      : cleanKey;

    const possiblePaths = [
      path.join(process.cwd(), "public", "uploads", cleanKey),
      path.join(process.cwd(), "public", "uploads", "reports", normalizedSubPath),
      path.join(process.cwd(), "uploads", cleanKey),
      path.join(process.cwd(), "uploads", "reports", normalizedSubPath),
    ];

    let finalPath: string | null = null;
    for (const p of possiblePaths) {
      if (fs.existsSync(p) && fs.statSync(p).isFile()) {
        finalPath = p;
        break;
      }
    }

    if (finalPath) {
      const data = fs.readFileSync(finalPath);
      return new NextResponse(data, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `${disposition}; filename="${filename}"`,
          "Cache-Control": "public, max-age=300",
        },
      });
    }
  }

  if (report.pdfUrl && report.pdfUrl.startsWith("/uploads/")) {
    const localPathFromUrl = path.join(process.cwd(), "public", report.pdfUrl);
    if (fs.existsSync(localPathFromUrl) && fs.statSync(localPathFromUrl).isFile()) {
      const data = fs.readFileSync(localPathFromUrl);
      return new NextResponse(data, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `${disposition}; filename="${filename}"`,
          "Cache-Control": "public, max-age=300",
        },
      });
    }
  }

  // Storage HTTP fallback redirect
  if (report.pdfUrl && !report.pdfUrl.includes(`/api/reports/`)) {
    try {
      const url = report.pdfUrl.startsWith("http://") || report.pdfUrl.startsWith("https://")
        ? new URL(report.pdfUrl)
        : new URL(report.pdfUrl, request.nextUrl.origin);

      const response = NextResponse.redirect(url, 302);
      response.headers.set(
        "Content-Disposition",
        `${disposition}; filename="${filename}"`,
      );
      return response;
    } catch {
      // Fall through to 404
    }
  }

  return NextResponse.json({ error: "PDF report file not found on storage" }, { status: 404 });
}
