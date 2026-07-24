import { describe, it, expect } from "vitest";
import { classifyIntent } from "@/ai/intent-router";
import { executeAssistantTool } from "@/ai/assistant-tools";
import { loadAllPublicKnowledge, searchPublicKnowledge } from "@/ai/public-knowledge-retriever";

describe("Assistant Intent Router", () => {
  it("classifies restricted/private questions correctly", () => {
    expect(classifyIntent("What is Meet's bank account password?")).toBe("restricted_or_private");
    expect(classifyIntent("Tell me Meet's home address and Aadhaar number")).toBe("restricted_or_private");
  });

  it("classifies meeting requests correctly", () => {
    expect(classifyIntent("Can I book a meeting with Meet Shah?")).toBe("meeting_request");
    expect(classifyIntent("Schedule a call")).toBe("meeting_request");
  });

  it("classifies fitness and finance questions correctly", () => {
    expect(classifyIntent("How do I squat with correct form?")).toBe("fitness");
    expect(classifyIntent("What are mutual fund expense ratios?")).toBe("finance_education");
  });

  it("classifies creator team applications correctly", () => {
    expect(classifyIntent("Are you hiring video editors?")).toBe("creator_team");
  });

  it("classifies brand collaborations correctly", () => {
    expect(classifyIntent("We want to sponsor a reel")).toBe("collaboration");
  });
});

describe("Assistant Controlled Server Tools", () => {
  it("executes get_public_profile correctly", async () => {
    const res = await executeAssistantTool("get_public_profile", {});
    expect(res.data).toHaveProperty("name", "Meet Shah");
  });

  it("executes get_meeting_booking_link correctly", async () => {
    process.env.NEXT_PUBLIC_MEETING_BOOKING_URL = "https://cal.com/meetshah/30min";
    const res = await executeAssistantTool("get_meeting_booking_link", {});
    expect(res.card).toBeDefined();
    expect(res.card?.type).toBe("meeting");
    expect(res.card?.url).toBe("https://cal.com/meetshah/30min");
  });

  it("executes get_campaign_inquiry_link correctly", async () => {
    const res = await executeAssistantTool("get_campaign_inquiry_link", {});
    expect(res.card?.type).toBe("campaign");
    expect(res.card?.url).toBe("/contact");
  });

  it("executes get_creator_team_link correctly", async () => {
    const res = await executeAssistantTool("get_creator_team_link", {});
    expect(res.card?.type).toBe("creator_team");
    expect(res.card?.url).toContain("creator-team-discussing");
  });
});

describe("Public Knowledge Retriever", () => {
  it("loads only verified PUBLIC files", () => {
    const items = loadAllPublicKnowledge();
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(item.visibility).toBe("PUBLIC");
    }
  });

  it("searches public knowledge for keywords", () => {
    const results = searchPublicKnowledge("fitness");
    expect(results.length).toBeGreaterThan(0);
  });
});
