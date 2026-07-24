import { NextRequest, NextResponse } from "next/server";
import { listYouTubeVideos } from "@/lib/storage/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format") as "short" | "long-form" | null;
  const topic = searchParams.get("topic");

  const list = await listYouTubeVideos({
    publishedOnly: true,
    format: format || undefined,
    topic: topic || undefined,
  });

  return NextResponse.json(list);
}
