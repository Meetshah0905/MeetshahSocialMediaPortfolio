import { NextRequest, NextResponse } from "next/server";
import {
  listYouTubeVideos,
  saveYouTubeVideo,
  getYouTubeVideoByVideoId,
  type YouTubeContent,
} from "@/lib/storage/db";
import {
  parseYouTubeVideoId,
  getYouTubeWatchUrl,
  getYouTubeThumbnailUrl,
} from "@/config/youtube";

export async function GET() {
  const list = await listYouTubeVideos();
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      urlInput,
      title,
      description,
      format,
      topic,
      thumbnailUrl,
      publishedAt,
      durationSeconds,
      isFeatured,
      isPublished,
      displayOrder,
    } = body;

    if (!urlInput || !title) {
      return NextResponse.json(
        { error: "YouTube video URL and Title are required." },
        { status: 400 }
      );
    }

    const videoId = parseYouTubeVideoId(urlInput);
    if (!videoId) {
      return NextResponse.json(
        { error: "Invalid YouTube URL or video ID. Please paste a valid YouTube video or Shorts link." },
        { status: 400 }
      );
    }

    // Check duplicate video ID (§6)
    const existing = await getYouTubeVideoByVideoId(videoId);
    if (existing && !body.id) {
      return NextResponse.json(
        { error: `Video ID "${videoId}" is already in the database catalog (${existing.title}).` },
        { status: 409 }
      );
    }

    const id = body.id || `yt-${videoId}`;
    const isShort = format === "short";
    const canonicalVideoUrl = getYouTubeWatchUrl(videoId, isShort);
    const finalThumbnailUrl = thumbnailUrl && thumbnailUrl.trim()
      ? thumbnailUrl.trim()
      : getYouTubeThumbnailUrl(videoId);

    const record: YouTubeContent = {
      id,
      videoId,
      title: title.trim(),
      description: description ? String(description).trim() : "",
      format: isShort ? "short" : "long-form",
      topic: topic || "other",
      videoUrl: canonicalVideoUrl,
      thumbnailUrl: finalThumbnailUrl,
      publishedAt: publishedAt || new Date().toISOString(),
      durationSeconds: durationSeconds ? Number(durationSeconds) : undefined,
      isFeatured: Boolean(isFeatured),
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : 10,
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = await saveYouTubeVideo(record);
    return NextResponse.json(saved);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save video record." },
      { status: 500 }
    );
  }
}
