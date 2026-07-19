import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth/session";
import { getReport, saveReport } from "@/lib/storage/db";

type Params = {
  params: Promise<{
    reportId: string;
  }>;
};

export async function POST(request: NextRequest, { params }: Params) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reportId } = await params;
    const existing = await getReport(reportId);
    if (!existing) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const updated = {
      ...existing,
      status: "published" as const,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveReport(updated);

    return NextResponse.json({ success: true, report: updated });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to publish report" }, { status: 500 });
  }
}
