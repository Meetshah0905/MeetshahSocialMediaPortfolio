import type { CreatorChannel, PersonaId, SocialLink } from "@/types/content";
import { socials as centralSocials } from "./socials";
import { YOUTUBE_CHANNEL } from "@/config/youtube";

export const site = {
  name: "Meet Shah",
  role: "Fitness & Finance Creator",
  location: "Ahmedabad, India",
  email: "editsbymks@gmail.com",
  phone: "",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
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

export const channels: Record<PersonaId, CreatorChannel> = {
  fitness: {
    id: "fitness",
    name: "Fitness",
    handle: "@meetsofficial",
    profileUrl: "https://www.instagram.com/meetsofficial/",
    // Deprecated: audience counts live in the metrics store (data/profiles.json
    // via src/lib/storage/db.ts), never in content files (§2). Kept "" so no
    // component can quietly render a stale hardcoded number.
    followerDisplay: "",
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
    followerDisplay: "",
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

export const socialUrls = {
  instagramFitness: centralSocials.instagramFitness.url,
  instagramFinance: centralSocials.instagramFinance.url,
  youtube: process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_URL || YOUTUBE_CHANNEL.channelUrl,
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

export const financeDisclaimer =
  "Finance content is educational and informational only. It is not financial advice, and it is not a recommendation to buy or sell any product.";
