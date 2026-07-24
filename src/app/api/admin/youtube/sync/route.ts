import { NextResponse } from "next/server";
import { syncYouTubeChannelVideos, isYouTubeApiConfigured } from "@/lib/youtube/api";

export async function POST() {
  if (!isYouTubeApiConfigured()) {
    return NextResponse.json(
      {
        success: false,
        error: "YOUTUBE_DATA_API_KEY environment variable is not configured. Admin catalogue mode is active.",
      },
      { status: 400 }
    );
  }

  const result = await syncYouTubeChannelVideos();
  return NextResponse.json(result);
}
