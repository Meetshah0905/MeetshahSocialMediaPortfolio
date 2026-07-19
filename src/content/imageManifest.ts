export type MeetImageAsset = {
  id: string;
  src: string;
  width: number;
  height: number;
  aspectRatio: number;
  orientation: "landscape" | "portrait" | "square";
  alt: string;
  page:
    | "home"
    | "fitness"
    | "finance"
    | "ugc"
    | "about"
    | "work-with-me";
  usage: string;
};

export const imageManifest: Record<string, MeetImageAsset> = {
  homeHero: {
    id: "homeHero",
    src: "/images/meet/meet-creator-banner.jpg",
    width: 2752,
    height: 1536,
    aspectRatio: 1.79,
    orientation: "landscape",
    alt: "Meet Shah Creator Cinematic Portrait Banner",
    page: "home",
    usage: "Homepage cinematic landscape hero image banner",
  },
  homePhilosophy: {
    id: "homePhilosophy",
    src: "/images/meet/meet-creativity-poster.jpg",
    width: 2752,
    height: 1536,
    aspectRatio: 1.79,
    orientation: "landscape",
    alt: "Meet Shah Creativity & Editorial Visual Poster",
    page: "home",
    usage: "Homepage pinned split-screen creativity section visual",
  },
  aboutPoster: {
    id: "aboutPoster",
    src: "/images/meet/meet-about-poster.jpg",
    width: 2752,
    height: 1536,
    aspectRatio: 1.79,
    orientation: "landscape",
    alt: "Meet Shah About Editorial Narrative Poster",
    page: "about",
    usage: "About page editorial story visual poster",
  },
  aboutLake: {
    id: "aboutLake",
    src: "/images/meet/about-lake.png",
    width: 691,
    height: 921,
    aspectRatio: 0.75,
    orientation: "portrait",
    alt: "Meet Shah standing by a lake during sunset",
    page: "about",
    usage: "About page lifestyle portrait photo beside narrative text",
  },
  ugcHero: {
    id: "ugcHero",
    src: "/images/meet/meet-studio-poster.jpg",
    width: 2752,
    height: 1536,
    aspectRatio: 1.79,
    orientation: "landscape",
    alt: "Meet Shah Creator Studio Gear and Setup Poster",
    page: "ugc",
    usage: "UGC page opening header visual representation",
  },
  ugcConcepts: {
    id: "ugcConcepts",
    src: "/images/meet/meet-content-poster.jpg",
    width: 2752,
    height: 1536,
    aspectRatio: 1.79,
    orientation: "landscape",
    alt: "White newspaper print graphic spelling CONTENT with creative hooks",
    page: "ugc",
    usage: "UGC page concepts grid display header poster",
  },
  collaborateHero: {
    id: "collaborateHero",
    src: "/images/meet/meet-collaborate-poster.jpg",
    width: 2752,
    height: 1536,
    aspectRatio: 1.79,
    orientation: "landscape",
    alt: "Meet Shah brand partnerships collaboration cover poster",
    page: "work-with-me",
    usage: "Work With Me page full-width landscape hero image",
  },
  servicesPoster: {
    id: "servicesPoster",
    src: "/images/meet/meet-services-poster.jpg",
    width: 2752,
    height: 1536,
    aspectRatio: 1.79,
    orientation: "landscape",
    alt: "Meet Shah creative deliverables and organic services breakdown",
    page: "work-with-me",
    usage: "Work With Me services list hover mask preview poster",
  },
  fitnessHero: {
    id: "fitnessHero",
    src: "/images/meet/meet-fitness-poster.jpg",
    width: 2752,
    height: 1536,
    aspectRatio: 1.79,
    orientation: "landscape",
    alt: "Meet Shah standing in a gym representing Fitness vertical",
    page: "fitness",
    usage: "Fitness page horizontal landscape hero banner",
  },
  financeHero: {
    id: "financeHero",
    src: "/images/meet/meet-finance-poster.jpg",
    width: 2752,
    height: 1536,
    aspectRatio: 1.79,
    orientation: "landscape",
    alt: "Meet Shah representing Finance vertical insights",
    page: "finance",
    usage: "Finance page horizontal landscape hero banner",
  },
} as const;
