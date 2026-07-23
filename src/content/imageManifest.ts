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
    src: "/images/meet/Meet_Shah_creator_poster_2K_202607190208 (1).jpeg",
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
    src: "/images/meet/Screenshot_230.jpg",
    width: 1000,
    height: 1000,
    aspectRatio: 1.0,
    orientation: "portrait",
    alt: "Meet Shah mirror selfie portrait in maroon shirt",
    page: "about",
    usage: "About page editorial story visual photo",
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
    src: "/images/meet/Meet_Shah_creator_banner_2K_202607190206.jpeg",
    width: 2752,
    height: 1536,
    aspectRatio: 1.79,
    orientation: "landscape",
    alt: "Meet Shah fitness creator portrait with athletic cap",
    page: "fitness",
    usage: "Fitness page horizontal landscape hero banner",
  },
  financeHero: {
    id: "financeHero",
    src: "/images/meet/Meet_Shah_services_poster_2K_202607190210.jpeg",
    width: 2752,
    height: 1536,
    aspectRatio: 1.79,
    orientation: "landscape",
    alt: "Meet Shah presenting Personal Finance and market educational insights",
    page: "finance",
    usage: "Finance page horizontal landscape hero banner",
  },
} as const;
