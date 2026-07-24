import { describe, it, expect } from "vitest";
import { executeAssistantTool } from "@/ai/assistant-tools";
import { CalEmbed } from "@/components/ui/CalEmbed";

describe("Dual Cal.com Meeting Booking Integration", () => {
  it("returns 60min social media meeting booking link", async () => {
    const res = await executeAssistantTool("get_meeting_booking_link", {});
    const data = res.data as { available: boolean; bookingUrl: string };
    expect(data.available).toBe(true);
    expect(data.bookingUrl).toContain("meet-shah-0905/60min");
    expect(res.card?.type).toBe("meeting");
    expect(res.card?.buttonText).toBe("View Available Times");
  });

  it("returns creator-team-discussing booking link for creator team tool", async () => {
    const res = await executeAssistantTool("get_creator_team_link", {});
    const data = res.data as { url: string; bookingUrl: string };
    expect(data.bookingUrl).toContain("meet-shah-0905/creator-team-discussing");
    expect(res.card?.type).toBe("creator_team");
    expect(res.card?.buttonText).toBe("Schedule Team Discussion");
  });

  it("exports CalEmbed component function", () => {
    expect(typeof CalEmbed).toBe("function");
  });
});
