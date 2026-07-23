import { NextRequest, NextResponse } from "next/server";
import {
  listReports,
  getLatestPublishedReport,
  isChannelSlug,
  isReportWindow,
} from "@/lib/storage/db";

/**
 * PUBLIC report reads. Published-only, always sorted newest first.
 *
 * ?channel=<slug> and ?window=<30|60|90|custom> narrow the list.
 * ?latest=true with a channel returns just that channel's newest published
 * report (or null when none exist yet).
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const channelParam = searchParams.get("channel");
    const windowParam = searchParams.get("window");
    const latest = searchParams.get("latest") === "true";

    const channel = channelParam && isChannelSlug(channelParam) ? channelParam : undefined;
    const reportWindow =
      windowParam && isReportWindow(windowParam) ? windowParam : undefined;

    if (latest) {
      const report = await getLatestPublishedReport(channel);
      return NextResponse.json(report);
    }

    const list = await listReports({ channel, reportWindow, publishedOnly: true });
    return NextResponse.json(list);
  } catch (err) {
    console.error("GET reports failed", err);
    return NextResponse.json({ error: "Failed to list reports" }, { status: 500 });
  }
}
