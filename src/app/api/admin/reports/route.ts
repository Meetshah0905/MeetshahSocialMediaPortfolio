import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth/session";
import { saveReport, AnalyticsReport } from "@/lib/storage/db";

export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: "Unauthorized admin session" }, { status: 401 });
    }

    const body = await request.json();
    const timestamp = new Date().toISOString();

    const reportId = `${body.persona}-${body.period.type}-${Date.now()}`;
    const report: AnalyticsReport = {
      ...body,
      id: reportId,
      schemaVersion: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
      publishedAt: body.status === "published" ? timestamp : null,
    };

    await saveReport(report);

    return NextResponse.json({ success: true, reportId: report.id, report });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to create draft report" }, { status: 500 });
  }
}
