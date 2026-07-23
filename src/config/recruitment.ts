/**
 * Recruitment configuration.
 *
 * Single source of truth for the /join-creator-team feature (§4 of the
 * recruitment prompt). Form IDs are PUBLIC Tally embed identifiers — safe to
 * ship to the browser via NEXT_PUBLIC_* — not private API secrets.
 *
 * Where to find these IDs: from the form URL, e.g.
 *   https://tally.so/r/Np9L9B  →  Np9L9B
 */

export type RoleSlug = "video-editor" | "videographer";

export type RecruitmentRole = {
  slug: RoleSlug;
  /** Uppercase eyebrow label. */
  label: string;
  /** Card title. */
  title: string;
  /** Short pitch. */
  description: string;
  /** Six skill chips shown on the card. */
  skills: readonly string[];
  /** Card CTA text. */
  cta: string;
  /** Heading shown above the loaded form. */
  panelHeading: string;
  /** Public Tally form ID (from NEXT_PUBLIC_TALLY_* env vars). */
  formId: string;
  /** Whether this role is accepting applications. */
  open: boolean;
  /** Iframe accessible title (§15). */
  iframeTitle: string;
};

/**
 * Independent open/closed flags. One role paused should never take the other
 * down. Add NEXT_PUBLIC_TALLY_VIDEO_EDITOR_OPEN=false to close a role without
 * a redeploy of application code.
 */
function isOpen(envValue: string | undefined, defaultOpen = true): boolean {
  if (envValue === undefined || envValue === "") return defaultOpen;
  return !/^(false|0|no|off|closed|paused)$/i.test(envValue);
}

export const roles: Record<RoleSlug, RecruitmentRole> = {
  "video-editor": {
    slug: "video-editor",
    label: "VIDEO EDITOR",
    title: "Turn raw footage into content that holds attention.",
    description:
      "For editors who understand short-form pacing, hooks, captions, sound, visual rhythm and clear storytelling.",
    skills: ["Reels", "YouTube", "UGC", "Captions", "Motion graphics", "Sound design"],
    cta: "Apply as Video Editor",
    panelHeading: "Video Editor Application",
    formId: process.env.NEXT_PUBLIC_TALLY_VIDEO_EDITOR_FORM_ID ?? "",
    open: isOpen(process.env.NEXT_PUBLIC_TALLY_VIDEO_EDITOR_OPEN),
    iframeTitle: "Video Editor Application Form",
  },
  videographer: {
    slug: "videographer",
    label: "VIDEOGRAPHER",
    title: "Capture creator-led stories with clarity and movement.",
    description:
      "For shooters who understand vertical content, clean audio, lighting, B-roll and fast-moving creator environments.",
    skills: ["Camera", "Lighting", "Audio", "Gimbal", "Vertical video", "B-roll"],
    cta: "Apply as Videographer",
    panelHeading: "Videographer Application",
    formId: process.env.NEXT_PUBLIC_TALLY_VIDEOGRAPHER_FORM_ID ?? "",
    open: isOpen(process.env.NEXT_PUBLIC_TALLY_VIDEOGRAPHER_OPEN),
    iframeTitle: "Videographer Application Form",
  },
} as const;

export const roleList: RecruitmentRole[] = [
  roles["video-editor"],
  roles.videographer,
];

/** Copy the page uses. All editable in one place — no strings in components. */
export const recruitmentCopy = {
  routeHref: "/join-creator-team",

  metaTitle: "Join Meet Shah's Creator Team",
  metaDescription:
    "Apply to collaborate with Meet Shah as a freelance video editor or videographer for fitness, finance and creator-led content.",

  eyebrow: "CREATOR NETWORK",
  headline: "Help build content people remember.",
  supporting:
    "I'm building a trusted network of editors and videographers for fitness, finance, UGC and creator-led projects. Apply for freelance, project-based or longer-term opportunities.",
  status: "Ahmedabad-based shoots · Remote editing opportunities · Paid trials",
  reviewNote:
    "Applications are reviewed according to current and upcoming project requirements.",

  rolesHeading: "Choose how you create.",

  panelSupporting:
    "Complete the application carefully. Portfolio relevance and communication matter more than expensive equipment or exaggerated claims.",
  panelDuration: "Approximately 5–8 minutes",
  changeRole: "Change role",

  processHeading: "How the process works.",
  processSteps: [
    { num: "01", label: "APPLY", body: "Share your experience, availability and relevant work." },
    { num: "02", label: "REVIEW", body: "Your portfolio and answers are reviewed against current requirements." },
    { num: "03", label: "PAID TRIAL", body: "Shortlisted applicants may receive a clearly scoped paid trial." },
    { num: "04", label: "COLLABORATE", body: "Successful applicants may be hired per project, per shoot or through a monthly arrangement." },
  ],

  privacyNote:
    "Your information will be used only to evaluate potential creator-production collaborations. Do not submit passwords, identity documents, banking information or confidential client files.",

  closedTitle: "Applications Paused",
  closedBody:
    "Applications for this role are currently paused. Please check again when the next production requirement is announced.",

  // Nav / footer entry point
  footerLinkLabel: "Join the Creator Team",
} as const;

/**
 * Hidden fields passed to Tally via URL params. Tally maps them to hidden
 * fields defined inside the form builder with matching names.
 */
export function tallyHiddenFields(role: RoleSlug): Record<string, string> {
  return {
    role,
    source: "meet-shah-portfolio",
    sourcePage: recruitmentCopy.routeHref,
    applicationVersion: "1",
  };
}

/** True when at least one role has both a form ID and is open. */
export function anyRoleAvailable(): boolean {
  return roleList.some((r) => r.open && r.formId.length > 0);
}
