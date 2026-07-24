import { describe, it, expect } from "vitest";
import { listYouTubeVideos } from "@/lib/storage/db";
import { YOUTUBE_CHANNEL, parseYouTubeVideoId } from "@/config/youtube";

describe("YouTube Verified Content Records", () => {
  it("returns 5 verified real video records with valid YouTube URLs", async () => {
    const videos = await listYouTubeVideos({ publishedOnly: true });

    expect(videos.length).toBeGreaterThanOrEqual(5);

    const videoIds = videos.map((v) => v.videoId);
    expect(videoIds).toContain("Obo2j5snVrY");
    expect(videoIds).toContain("8LomKcahZQg");
    expect(videoIds).toContain("1Fu634fOdMw");
    expect(videoIds).toContain("DXSXkxet1sY");
    expect(videoIds).toContain("Sp95GO1FK7E");
  });

  it("does not contain any fake test video titles or sample descriptions", async () => {
    const videos = await listYouTubeVideos();

    for (const v of videos) {
      expect(v.title.toLowerCase()).not.toContain("test verified fitness guide");
      expect(v.title.toLowerCase()).not.toContain("placeholder video");
      expect(v.title.toLowerCase()).not.toContain("demo youtube video");
    }
  });

  it("verifies canonical video URLs for all 5 owner videos", async () => {
    const featured = await listYouTubeVideos();
    const obo = featured.find((v) => v.videoId === "Obo2j5snVrY");

    expect(obo).toBeDefined();
    expect(obo?.videoUrl).toBe("https://www.youtube.com/watch?v=Obo2j5snVrY");
    expect(obo?.format).toBe("long-form");
    expect(obo?.isFeatured).toBe(true);

    const parsedId = parseYouTubeVideoId(obo?.videoUrl || "");
    expect(parsedId).toBe("Obo2j5snVrY");
  });

  it("verifies YOUTUBE_CHANNEL configuration", () => {
    expect(YOUTUBE_CHANNEL.id).toBe("UCrsC6r5AQ9AvWvKTgexD54w");
    expect(YOUTUBE_CHANNEL.name).toBe("meetsofficial");
    expect(YOUTUBE_CHANNEL.handle).toBe("@im_meetshah");
    expect(YOUTUBE_CHANNEL.channelUrl).toContain("UCrsC6r5AQ9AvWvKTgexD54w");
  });
});
