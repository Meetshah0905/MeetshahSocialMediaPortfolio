import { YOUTUBE_CHANNEL, getYouTubeWatchUrl, getYouTubeThumbnailUrl } from "@/config/youtube";
import { type YouTubeContent, listYouTubeVideos, saveYouTubeVideo } from "@/lib/storage/db";

export interface SyncResult {
  success: boolean;
  importedCount: number;
  skippedCount: number;
  error?: string;
}

export function isYouTubeApiConfigured(): boolean {
  return Boolean(process.env.YOUTUBE_DATA_API_KEY && process.env.YOUTUBE_DATA_API_KEY.trim());
}

/**
 * Server-side optional YouTube Data API sync (§4 Level 2).
 */
export async function syncYouTubeChannelVideos(): Promise<SyncResult> {
  const apiKey = process.env.YOUTUBE_DATA_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    return {
      success: false,
      importedCount: 0,
      skippedCount: 0,
      error: "YOUTUBE_DATA_API_KEY is not configured in server environment.",
    };
  }

  try {
    // 1. Get uploads playlist ID for channel UCrsC6r5AQ9AvWvKTgexD54w
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,statistics&id=${YOUTUBE_CHANNEL.id}&key=${apiKey}`
    );

    if (!channelRes.ok) {
      return { success: false, importedCount: 0, skippedCount: 0, error: `YouTube API request failed: ${channelRes.statusText}` };
    }

    const channelData = await channelRes.json();
    const uploadsPlaylistId = channelData?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylistId) {
      return { success: false, importedCount: 0, skippedCount: 0, error: "Uploads playlist not found for channel." };
    }

    // 2. Retrieve recent uploaded items (up to 50)
    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=50&key=${apiKey}`
    );

    if (!playlistRes.ok) {
      return { success: false, importedCount: 0, skippedCount: 0, error: `Playlist request failed: ${playlistRes.statusText}` };
    }

    const playlistData = await playlistRes.json();
    const items = playlistData?.items || [];

    const existingVideos = await listYouTubeVideos();
    const existingMap = new Map(existingVideos.map((v) => [v.videoId, v]));

    let importedCount = 0;
    let skippedCount = 0;

    for (const item of items) {
      const snippet = item.snippet;
      const videoId = snippet?.resourceId?.videoId || item.contentDetails?.videoId;
      if (!videoId) continue;

      const title = snippet?.title || "Untitled YouTube Video";
      const description = snippet?.description || "";
      const publishedAt = snippet?.publishedAt || new Date().toISOString();
      const thumbnails = snippet?.thumbnails;
      const thumbnailUrl = thumbnails?.maxres?.url || thumbnails?.high?.url || thumbnails?.medium?.url || getYouTubeThumbnailUrl(videoId);

      // Determine if short (heuristic: title/description contains #shorts or #short)
      const isShort = title.toLowerCase().includes("#short") || description.toLowerCase().includes("#short");
      const format = isShort ? "short" : "long-form";

      // Detect initial topic heuristic
      let topic: YouTubeContent["topic"] = "other";
      const combinedText = `${title} ${description}`.toLowerCase();
      if (combinedText.includes("fitness") || combinedText.includes("workout") || combinedText.includes("squat") || combinedText.includes("gym")) {
        topic = "fitness";
      } else if (combinedText.includes("finance") || combinedText.includes("money") || combinedText.includes("invest") || combinedText.includes("stock")) {
        topic = "finance";
      } else if (combinedText.includes("ugc") || combinedText.includes("ad") || combinedText.includes("editing")) {
        topic = "ugc";
      } else if (combinedText.includes("ai")) {
        topic = "ai";
      } else if (combinedText.includes("business") || combinedText.includes("startup")) {
        topic = "business";
      } else if (combinedText.includes("creator")) {
        topic = "creator";
      }

      const existing = existingMap.get(videoId);

      if (existing) {
        // Update metadata without overwriting admin-customized titles/topics
        existing.thumbnailUrl = existing.thumbnailUrl || thumbnailUrl;
        existing.publishedAt = existing.publishedAt || publishedAt;
        existing.updatedAt = new Date().toISOString();
        await saveYouTubeVideo(existing);
        skippedCount++;
      } else {
        const newRecord: YouTubeContent = {
          id: `yt-${videoId}`,
          videoId,
          title,
          description,
          format,
          topic,
          videoUrl: getYouTubeWatchUrl(videoId, isShort),
          thumbnailUrl,
          publishedAt,
          isFeatured: false,
          isPublished: true,
          displayOrder: 10,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await saveYouTubeVideo(newRecord);
        importedCount++;
      }
    }

    return { success: true, importedCount, skippedCount };
  } catch (err) {
    return {
      success: false,
      importedCount: 0,
      skippedCount: 0,
      error: err instanceof Error ? err.message : "Unknown error during sync.",
    };
  }
}
