export type AssistantIntent =
  | "about_meet"
  | "creator_journey"
  | "fitness"
  | "finance_education"
  | "ugc"
  | "services"
  | "collaboration"
  | "creator_team"
  | "analytics"
  | "content_search"
  | "meeting_request"
  | "human_handoff"
  | "current_external_information"
  | "restricted_or_private"
  | "general_conversation";

/**
 * Classifies visitor message into one of 15 intent categories (§6).
 */
export function classifyIntent(message: string): AssistantIntent {
  const text = message.toLowerCase().trim();

  // 1. Restricted / Private query detection (Privacy Firewall)
  const privateKeywords = [
    "password",
    "secret",
    "aadhaar",
    "pan card",
    "bank account",
    "phone number",
    "home address",
    "sponsorship cost",
    "sponsorship payment",
    "earnings",
    "income",
    "internal analytics",
    "private key",
    "api key",
    "applicant",
    "submission",
  ];
  if (privateKeywords.some((kw) => text.includes(kw))) {
    return "restricted_or_private";
  }

  // 2. Human handoff explicit request
  if (
    text.includes("human") ||
    text.includes("speak to a person") ||
    text.includes("real person") ||
    text.includes("contact meet directly") ||
    text.includes("escalate")
  ) {
    return "human_handoff";
  }

  // 3. Meeting request
  if (
    text.includes("book a meeting") ||
    text.includes("schedule a call") ||
    text.includes("meet meet") ||
    text.includes("speak with meet") ||
    text.includes("appointment") ||
    text.includes("booking")
  ) {
    return "meeting_request";
  }

  // 4. Creator team / hiring
  if (
    text.includes("editor") ||
    text.includes("videographer") ||
    text.includes("creator team") ||
    text.includes("join team") ||
    text.includes("hiring") ||
    text.includes("job")
  ) {
    return "creator_team";
  }

  // 5. Brand collaboration
  if (
    text.includes("collaborate") ||
    text.includes("brand deal") ||
    text.includes("sponsor") ||
    text.includes("partnership") ||
    text.includes("proposal")
  ) {
    return "collaboration";
  }

  // 6. Analytics, Subscribers & YouTube metrics
  if (
    text.includes("subscriber") ||
    text.includes("youtube subscribers") ||
    text.includes("how many subscribers") ||
    text.includes("youtube channel") ||
    text.includes("does meet have youtube") ||
    text.includes("youtube audience") ||
    text.includes("analytics") ||
    text.includes("report") ||
    text.includes("metrics") ||
    text.includes("reach") ||
    text.includes("followers") ||
    text.includes("views")
  ) {
    return "analytics";
  }

  // 7. UGC & Production
  if (
    text.includes("ugc") ||
    text.includes("ad creative") ||
    text.includes("hook pattern") ||
    text.includes("production")
  ) {
    return "ugc";
  }

  // 8. Fitness
  if (
    text.includes("fitness") ||
    text.includes("workout") ||
    text.includes("diet") ||
    text.includes("protein") ||
    text.includes("form") ||
    text.includes("squat")
  ) {
    return "fitness";
  }

  // 9. Finance Education
  if (
    text.includes("stock") ||
    text.includes("invest") ||
    text.includes("mutual fund") ||
    text.includes("finance") ||
    text.includes("sip") ||
    text.includes("budget")
  ) {
    return "finance_education";
  }

  // 10. Services
  if (text.includes("service") || text.includes("offering") || text.includes("coaching")) {
    return "services";
  }

  // 11. Content search
  if (
    text.includes("video") ||
    text.includes("reel") ||
    text.includes("catalogue") ||
    text.includes("watch")
  ) {
    return "content_search";
  }

  // 12. Creator journey
  if (
    text.includes("journey") ||
    text.includes("story") ||
    text.includes("background") ||
    text.includes("milestone")
  ) {
    return "creator_journey";
  }

  // 13. About Meet
  if (text.includes("who is meet") || text.includes("about meet") || text.includes("meet shah")) {
    return "about_meet";
  }

  // 14. Current external info
  if (
    text.includes("current price") ||
    text.includes("today stock") ||
    text.includes("gmp") ||
    text.includes("latest ipo") ||
    text.includes("news today")
  ) {
    return "current_external_information";
  }

  return "general_conversation";
}
