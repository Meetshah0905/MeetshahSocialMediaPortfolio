export type VerifiedYouTubeVideo = {
  videoId: string;
  canonicalUrl: string;
  format: "short" | "long-form";
  title: string;
  thumbnailUrl: string;
  topic?: string;
  featured?: boolean;
};

export function getYouTubeThumbnail(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
}

export function getYouTubeFallbackThumbnail(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export const VERIFIED_YOUTUBE_VIDEOS: readonly VerifiedYouTubeVideo[] = [
  {
    videoId: "Obo2j5snVrY",
    canonicalUrl: "https://www.youtube.com/watch?v=Obo2j5snVrY",
    format: "long-form",
    title: "Inside Meet Shah's Creator Content Strategy & Editing Workflow",
    thumbnailUrl: "https://i.ytimg.com/vi/Obo2j5snVrY/maxresdefault.jpg",
    topic: "creator",
    featured: true,
  },
  {
    videoId: "8LomKcahZQg",
    canonicalUrl: "https://www.youtube.com/shorts/8LomKcahZQg",
    format: "short",
    title: "Desk Worker Mobility & Ergonomics Breakdown 💻",
    thumbnailUrl: "https://i.ytimg.com/vi/8LomKcahZQg/maxresdefault.jpg",
    topic: "fitness",
  },
  {
    videoId: "1Fu634fOdMw",
    canonicalUrl: "https://www.youtube.com/shorts/1Fu634fOdMw",
    format: "short",
    title: "Why Rich People Invest in Asset Cash Flow Over Savings 💡",
    thumbnailUrl: "https://i.ytimg.com/vi/1Fu634fOdMw/maxresdefault.jpg",
    topic: "finance",
  },
  {
    videoId: "DXSXkxet1sY",
    canonicalUrl: "https://www.youtube.com/shorts/DXSXkxet1sY",
    format: "short",
    title: "The Dark Reality of CNS Recovery & Workout Pacing 🧬",
    thumbnailUrl: "https://i.ytimg.com/vi/DXSXkxet1sY/maxresdefault.jpg",
    topic: "fitness",
  },
  {
    videoId: "Sp95GO1FK7E",
    canonicalUrl: "https://www.youtube.com/shorts/Sp95GO1FK7E",
    format: "short",
    title: "5 AI Editing Hacks to Compress Prompts & Scale Output 🤯",
    thumbnailUrl: "https://i.ytimg.com/vi/Sp95GO1FK7E/maxresdefault.jpg",
    topic: "creator",
  },
] as const;
