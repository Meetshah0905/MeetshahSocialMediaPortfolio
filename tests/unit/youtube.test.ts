import { describe, it, expect } from "vitest";
import { getPublishedCreatorMetrics } from "@/lib/storage/db";
import { executeAssistantTool } from "@/ai/assistant-tools";
import { classifyIntent } from "@/ai/intent-router";

describe("YouTube Central Metrics Loader", () => {
  it("returns YouTube Main with 19,700 exact subscribers and 19.7K compact display", async () => {
    const metrics = await getPublishedCreatorMetrics();
    expect(metrics.youtubeMain).toBeDefined();
    expect(metrics.youtubeMain.exact).toBe(19700);
    expect(metrics.youtubeMain.compact).toBe("19.7K");
  });

  it("calculates combined community dynamically", async () => {
    const metrics = await getPublishedCreatorMetrics();
    const expectedTotal = metrics.instagramFitness.exact + metrics.instagramFinance.exact + metrics.youtubeMain.exact;
    expect(metrics.combinedCommunity.exact).toBe(expectedTotal);
    expect(metrics.combinedCommunity.compact).toBeDefined();
  });
});

describe("YouTube AI Assistant Tooling & Routing", () => {
  it("returns YouTube Subscribers in get_current_channel_metrics tool", async () => {
    const res = await executeAssistantTool("get_current_channel_metrics", {});
    const data = res.data as Array<{ channel: string; audienceLabel: string; exact: number; compact: string }>;
    const yt = data.find((d) => d.channel === "YouTube Main");
    expect(yt).toBeDefined();
    expect(yt?.audienceLabel).toBe("Subscribers");
    expect(yt?.exact).toBe(19700);
    expect(yt?.compact).toBe("19.7K");
  });

  it("routes YouTube subscriber queries correctly", () => {
    expect(classifyIntent("How many subscribers does Meet Shah have on YouTube?")).toBe("analytics");
    expect(classifyIntent("Does Meet have a YouTube channel?")).toBe("analytics");
    expect(classifyIntent("Show me YouTube subscriber count")).toBe("analytics");
  });
});
