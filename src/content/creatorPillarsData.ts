export type CreatorPillar = {
  id: "fitness" | "finance" | "ugc" | "youtube";
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  metricKey?: "instagram_fitness" | "instagram_finance" | "youtube_main";
  metricLabel?: string;
  metricFallback?: string;
  href: string;
  cta: string;
};

export const creatorPillarsData: CreatorPillar[] = [
  {
    id: "fitness",
    eyebrow: "FITNESS",
    title: "Train with clarity. Build sustainable strength.",
    description:
      "Practical training, nutrition and technique-focused content designed around long-term progress.",
    image: "/images/meet/Meet_Shah_creator_banner_2K_202607190206.jpeg",
    imageAlt: "Meet Shah fitness creator portrait with athletic cap",
    metricKey: "instagram_fitness",
    metricLabel: "Instagram followers",
    href: "/fitness",
    cta: "Explore Fitness",
  },
  {
    id: "finance",
    eyebrow: "FINANCE",
    title: "Understand money. Invest with clarity.",
    description:
      "Relatable personal-finance and investing content that makes complex topics easier to understand.",
    image: "/images/meet/Meet_Shah_services_poster_2K_202607190210.jpeg",
    imageAlt: "Meet Shah presenting personal finance and market insights",
    metricKey: "instagram_finance",
    metricLabel: "Instagram followers",
    href: "/finance",
    cta: "Explore Finance",
  },
  {
    id: "ugc",
    eyebrow: "UGC",
    title: "Create useful content. Build audience trust.",
    description:
      "Creator-led scripting, filming and editing designed for natural short-form brand communication.",
    image: "/images/meet/meet-content-poster.jpg",
    imageAlt: "Meet Shah producing high-retention vertical video content",
    metricFallback: "Creator-led brand content",
    href: "/ugc",
    cta: "Explore UGC",
  },
  {
    id: "youtube",
    eyebrow: "YOUTUBE",
    title: "Short-form attention. Long-form depth.",
    description:
      "YouTube Shorts and long-form videos explaining fitness, finance, and creator topics.",
    image: "/images/meet/meet-studio-poster.jpg",
    imageAlt: "Meet Shah YouTube content creator",
    metricKey: "youtube_main",
    metricLabel: "Subscribers",
    metricFallback: "19.7K Subscribers",
    href: "/youtube",
    cta: "Explore YouTube",
  },
];
