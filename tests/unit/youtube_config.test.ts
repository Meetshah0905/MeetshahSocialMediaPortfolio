import { describe, it, expect } from "vitest";
import { YOUTUBE_CHANNEL, parseYouTubeVideoId, getYouTubeWatchUrl, getYouTubeThumbnailUrl } from "@/config/youtube";
import { listYouTubeVideos, saveYouTubeVideo, getYouTubeVideoByVideoId, deleteYouTubeVideo } from "@/lib/storage/db";
import { executeAssistantTool } from "@/ai/assistant-tools";

describe("YouTube Central Configuration", () => {
  it("has correct channel ID, handle, name and canonical URLs", () => {
    expect(YOUTUBE_CHANNEL.id).toBe("UCrsC6r5AQ9AvWvKTgexD54w");
    expect(YOUTUBE_CHANNEL.name).toBe("meetsofficial");
    expect(YOUTUBE_CHANNEL.handle).toBe("@im_meetshah");
    expect(YOUTUBE_CHANNEL.channelUrl).toBe("https://www.youtube.com/channel/UCrsC6r5AQ9AvWvKTgexD54w");
    expect(YOUTUBE_CHANNEL.videosUrl).toBe("https://www.youtube.com/channel/UCrsC6r5AQ9AvWvKTgexD54w/videos");
    expect(YOUTUBE_CHANNEL.shortsUrl).toBe("https://www.youtube.com/channel/UCrsC6r5AQ9AvWvKTgexD54w/shorts");
    expect(YOUTUBE_CHANNEL.playlistsUrl).toBe("https://www.youtube.com/channel/UCrsC6r5AQ9AvWvKTgexD54w/playlists");
  });
});

describe("YouTube URL & ID Parser Utility", () => {
  it("parses standard watch URL", () => {
    expect(parseYouTubeVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("parses short URL (youtu.be)", () => {
    expect(parseYouTubeVideoId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("parses Shorts URL", () => {
    expect(parseYouTubeVideoId("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("parses raw 11-character video ID", () => {
    expect(parseYouTubeVideoId("dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("returns null for malformed or non-YouTube URLs", () => {
    expect(parseYouTubeVideoId("https://example.com/video")).toBeNull();
    expect(parseYouTubeVideoId("invalid_id")).toBeNull();
  });

  it("generates correct watch and thumbnail URLs", () => {
    expect(getYouTubeWatchUrl("dQw4w9WgXcQ", false)).toBe("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    expect(getYouTubeWatchUrl("dQw4w9WgXcQ", true)).toBe("https://www.youtube.com/shorts/dQw4w9WgXcQ");
    expect(getYouTubeThumbnailUrl("dQw4w9WgXcQ")).toBe("https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg");
  });
});

describe("YouTube Database Catalogue Store", () => {
  it("saves and retrieves a verified video record", async () => {
    const testVideo = {
      id: "yt-mockunit123",
      videoId: "mockunit123",
      title: "Mock Integration Video Record",
      description: "Sample description",
      format: "long-form" as const,
      topic: "fitness" as const,
      videoUrl: "https://www.youtube.com/watch?v=mockunit123",
      thumbnailUrl: "https://i.ytimg.com/vi/mockunit123/hqdefault.jpg",
      isFeatured: false,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveYouTubeVideo(testVideo);

    const found = await getYouTubeVideoByVideoId("mockunit123");
    expect(found).toBeDefined();
    expect(found?.title).toBe("Mock Integration Video Record");

    // Clean up test record so it doesn't pollute database file (§3)
    await deleteYouTubeVideo(testVideo.id);
  });
});

describe("Assistant Tools Official YouTube Links", () => {
  it("returns official channel links from get_official_links tool", async () => {
    const res = await executeAssistantTool("get_official_links", {});
    const data = res.data as Record<string, string>;
    expect(data.youtubeChannel).toBe("https://www.youtube.com/channel/UCrsC6r5AQ9AvWvKTgexD54w");
    expect(data.youtubeShorts).toBe("https://www.youtube.com/channel/UCrsC6r5AQ9AvWvKTgexD54w/shorts");
    expect(data.youtubeVideos).toBe("https://www.youtube.com/channel/UCrsC6r5AQ9AvWvKTgexD54w/videos");
    expect(data.youtubePlaylists).toBe("https://www.youtube.com/channel/UCrsC6r5AQ9AvWvKTgexD54w/playlists");
  });
});
