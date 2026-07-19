import { NextRequest, NextResponse } from "next/server";
import { getReport, getLatestReport } from "@/lib/storage/db";
import { generatePDFReport } from "@/lib/utils/pdf";

type Params = {
  params: Promise<{
    reportId: string;
  }>;
};

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { reportId } = await params;
    let report = null;

    if (reportId === "latest-fitness") {
      report = await getLatestReport("instagram_fitness");
    } else if (reportId === "latest-finance") {
      report = await getLatestReport("instagram_finance");
    } else if (reportId === "latest-youtube") {
      report = await getLatestReport("youtube_main");
    } else {
      report = await getReport(reportId);
    }

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const pdfBuffer = generatePDFReport(report);
    const filename = `meet-shah-${report.persona}-insights-${report.period.startDate}-to-${report.period.endDate}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (err: any) {
    console.error("PDF generation route failed", err);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
