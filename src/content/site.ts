import type { CreatorChannel, PersonaId, SocialLink } from "@/types/content";

/**
 * Global site identity (§7 of the content strategy).
 * Every value here is editable copy — nothing is derived or computed.
 */

export const site = {
  name: "Meet Shah",
  /** Kept conservative — no unearned titles or credentials (§16). */
  role: "Fitness & Finance Creator",
  location: "Ahmedabad, India",
  email: "editsbymks@gmail.com",
  /** Empty string hides the phone entirely (§26). */
  phone: "",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** Where the "contact me" CTA should send people by default. */
  primaryContactPreference: "email" as "email" | "instagram",
} as const;

export const seo = {
  defaultTitle: "Meet Shah — Fitness & Finance Creator",
  defaultDescription:
    "Creator-led fitness and finance content for brands. Media kit, audience insights, UGC portfolio and collaboration details.",
  keywords: [
    "content creator",
    "UGC creator",
    "fitness creator",
    "finance creator",
    "brand collaboration",
    "Instagram reels",
    "Ahmedabad",
  ],
} as const;

/**
 * The two creator verticals. Meet Shah is the umbrella brand; these are
 * distinct positions beneath it and must never be described as one audience.
 */
export const channels: Record<PersonaId, CreatorChannel> = {
  fitness: {
    id: "fitness",
    name: "Fitness",
    handle: "@meetsofficial",
    profileUrl: "https://www.instagram.com/meetsofficial/",
    followerDisplay: "11.9K",
    positioning: "Helping you improve your body the right way.",
    description: "Practical fitness content focusing on training technique, nutrition guidelines, and sustainable workout plans.",
    contentPillars: [
      "Diet & Nutrition",
      "Workout Routines",
      "Form & Technique",
      "Fitness Lifestyle",
      "1:1 Weekend Fitness Sessions",
    ],
    heroImage: "/images/meet/meet-fitness-poster.jpg",
    accent: "blue",
  },
  finance: {
    id: "finance",
    name: "Finance",
    handle: "@meet.fitfix",
    profileUrl: "https://www.instagram.com/meet.fitfix/",
    followerDisplay: "15.1K",
    positioning: "Helping you invest with clarity.",
    description: "Relatable finance insights designed to simplify investing, personal finance, and market trends.",
    contentPillars: [
      "Stocks & Investing",
      "Personal Finance",
      "Market Updates",
      "1:1 Investment Sessions",
      "Financial Literacy",
    ],
    heroImage: "/images/meet/meet-finance-poster.jpg",
    accent: "ink",
  },
};

export const channelList: CreatorChannel[] = [channels.fitness, channels.finance];

import { socials as centralSocials } from "./socials";

export const socialUrls = {
  instagramFitness: centralSocials.instagramFitness.url,
  instagramFinance: centralSocials.instagramFinance.url,
  linkedin: centralSocials.linkedin.url,
  twitter: centralSocials.twitter.url,
  email: centralSocials.email.address,
} as const;

export const socials: SocialLink[] = [
  {
    label: "Fitness Instagram",
    handle: centralSocials.instagramFitness.handle,
    href: centralSocials.instagramFitness.url,
  },
  {
    label: "Finance Instagram",
    handle: centralSocials.instagramFinance.handle,
    href: centralSocials.instagramFinance.url,
  },
  {
    label: "LinkedIn",
    handle: centralSocials.linkedin.label,
    href: centralSocials.linkedin.url,
  },
  {
    label: "X",
    handle: centralSocials.twitter.label,
    href: centralSocials.twitter.url,
  },
];

/**
 * Informational-content disclaimer for the finance surfaces (§16).
 * Meet is not presented as a licensed adviser.
 */
export const financeDisclaimer =
  "Finance content is educational and informational only. It is not financial advice, and it is not a recommendation to buy or sell any product.";
