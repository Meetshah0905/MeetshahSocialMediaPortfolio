export type PortfolioShort = {
  id: string;
  title: string;
  category: "Fitness" | "Finance" | "Lifestyle" | "Creator";
  description?: string;
  thumbnailOverride?: string;
  featured?: boolean;
};

export const portfolioShorts: readonly PortfolioShort[] = [
  {
    id: "ygiTdLCJx6g",
    title: "The Ultimate Desk Worker Stretching Routine 💻",
    category: "Fitness",
    description: "Quick posture resets and mobility drills engineered for desk workers to eliminate tight hips and neck strain.",
    featured: true,
  },
  {
    id: "kZ54yBsqXS4",
    title: "If My Muscles Could Text Me",
    category: "Fitness",
    description: "Relatable gym comedy highlighting recovery, muscle soreness, and realistic training expectations.",
    featured: true,
  },
  {
    id: "gPYpzDbR2us",
    title: "I Replaced My Thumbnail Editor in 50 Seconds 🤯",
    category: "Creator",
    description: "Fast-paced creator workflow breakdown showcasing automated thumbnail generation and visual hook design.",
    featured: true,
  },
  {
    id: "VRgRlHftKJ8",
    title: "Why Iran is Targeting Corporate Offices (Not Military) 🤯",
    category: "Finance",
    description: "Geopolitical economic insights explaining market disruptions, corporate vulnerability, and risk distribution.",
    featured: true,
  },
  {
    id: "sGJNHXaem4k",
    title: "Stop wasting your Claude AI limits, I found the secret codes to compress your prompts",
    category: "Creator",
    description: "Practical AI prompt engineering hacks to optimize token limits and maximize productivity.",
  },
  {
    id: "Yvcvux50Y_U",
    title: "The Dark Reality of Employees in India 🤡",
    category: "Lifestyle",
    description: "Honest career critique exploring corporate culture, work-life balance, and modern workplace dynamics.",
  },
  {
    id: "LCJmCg53tH0",
    title: "Why Rich People Never Save Money (Mind-Blowing Secret)",
    category: "Finance",
    description: "Personal finance principles contrasting traditional savings with asset-backed cash flow generation.",
  },
  {
    id: "sr5DOQ09Mw8",
    title: "The Dark Truth About Overtraining Nobody Talks About",
    category: "Fitness",
    description: "Science-based breakdown of central nervous system fatigue, recovery signals, and workout pacing.",
  },
  {
    id: "GhtGghOBRv0",
    title: "Why Elon Musk is Sending Optimus Robots to Space 🤖",
    category: "Creator",
    description: "High-retention tech explainer on robotics, autonomous space missions, and futuristic engineering.",
  },
  {
    id: "gOInL4NHcbQ",
    title: "5 Signs You Have a Severe Magnesium Deficiency 🧬",
    category: "Fitness",
    description: "Actionable health breakdown identifying subtle micronutrient deficiencies and dietary fixes.",
  },
  {
    id: "KWr3G4Kvwg0",
    title: "Stop Cooking Rice Until You Watch This! (Food Safety)",
    category: "Lifestyle",
    description: "Consumer awareness reel explaining food prep safety, arsenic removal, and healthy cooking habits.",
  },
  {
    id: "4W4_ufV4h3g",
    title: "Desk Worker Mobility & Ergonomics Breakdown 💻",
    category: "Fitness",
    description: "Targeted ergonomic exercises designed for posture correction during long office hours.",
  },
] as const;

export function getYouTubeThumbnail(id: string) {
  return `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
}

export function getYouTubeFallbackThumbnail(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}
