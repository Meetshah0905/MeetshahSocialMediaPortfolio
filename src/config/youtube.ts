export const YOUTUBE_CHANNEL = {
  id: "UCrsC6r5AQ9AvWvKTgexD54w",
  name: "meetsofficial",
  handle: "@im_meetshah",

  channelUrl:
    "https://www.youtube.com/channel/UCrsC6r5AQ9AvWvKTgexD54w",

  videosUrl:
    "https://www.youtube.com/channel/UCrsC6r5AQ9AvWvKTgexD54w/videos",

  shortsUrl:
    "https://www.youtube.com/channel/UCrsC6r5AQ9AvWvKTgexD54w/shorts",

  playlistsUrl:
    "https://www.youtube.com/channel/UCrsC6r5AQ9AvWvKTgexD54w/playlists",
} as const;

/**
 * Extracts a YouTube video ID from various URL formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 */
export function parseYouTubeVideoId(urlInput: string): string | null {
  if (!urlInput || typeof urlInput !== "string") return null;
  const trimmed = urlInput.trim();

  // If user pasted raw 11-char video ID (e.g. dQw4w9WgXcQ)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);

    if (url.hostname.includes("youtu.be")) {
      const pathname = url.pathname.slice(1);
      const videoId = pathname.split("/")[0];
      return /^[a-zA-Z0-9_-]{11}$/.test(videoId) ? videoId : null;
    }

    if (url.hostname.includes("youtube.com")) {
      if (url.pathname.startsWith("/watch")) {
        const v = url.searchParams.get("v");
        return v && /^[a-zA-Z0-9_-]{11}$/.test(v) ? v : null;
      }
      if (url.pathname.startsWith("/shorts/")) {
        const videoId = url.pathname.split("/shorts/")[1]?.split("/")[0]?.split("?")[0];
        return videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId) ? videoId : null;
      }
      if (url.pathname.startsWith("/embed/")) {
        const videoId = url.pathname.split("/embed/")[1]?.split("/")[0]?.split("?")[0];
        return videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId) ? videoId : null;
      }
    }
  } catch {
    return null;
  }

  return null;
}

/** Returns standard YouTube video watch URL */
export function getYouTubeWatchUrl(videoId: string, isShort = false): string {
  return isShort
    ? `https://www.youtube.com/shorts/${videoId}`
    : `https://www.youtube.com/watch?v=${videoId}`;
}

/** Returns standard high-quality YouTube thumbnail URL */
export function getYouTubeThumbnailUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}
