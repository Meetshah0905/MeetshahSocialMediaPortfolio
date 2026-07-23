export type MeetAssetCategory =
  | "home"
  | "fitness"
  | "finance"
  | "youtube"
  | "ugc"
  | "analytics"
  | "collaboration"
  | "portrait"
  | "portfolio";

export type MeetAsset = {
  id: string;
  src: string;
  width: number;
  height: number;
  aspectRatio: number;
  orientation: "landscape" | "portrait" | "square";
  category: MeetAssetCategory;
  intendedUsage: string;
  alt: string;
};

export const meetAssets: MeetAsset[] = [
  {
    id: "meet-creator-banner",
    src: "/images/meet/Meet_Shah_creator_poster_2K_202607190208 (1).jpeg",
    width: 2752,
    height: 1536,
    aspectRatio: 1.79,
    orientation: "landscape",
    category: "home",
    intendedUsage: "Homepage cinematic background hero image",
    alt: "Meet Shah Cinematic Creator Portrait Banner"
  },
  {
    id: "meet-fitness-poster",
    src: "/images/meet/meet-fitness-poster.jpg",
    width: 2752,
    height: 1536,
    aspectRatio: 1.79,
    orientation: "landscape",
    category: "fitness",
    intendedUsage: "Dedicated fitness page hero visual artwork",
    alt: "Meet Shah standing in a gym representing his fitness vertical"
  },
  {
    id: "meet-finance-poster",
    src: "/images/meet/meet-finance-poster.jpg",
    width: 2752,
    height: 1536,
    aspectRatio: 1.79,
    orientation: "landscape",
    category: "finance",
    intendedUsage: "Dedicated finance page hero visual artwork",
    alt: "Meet Shah representing personal finance and investing guidelines"
  },
  {
    id: "meet-studio-poster",
    src: "/images/meet/meet-studio-poster.jpg",
    width: 2752,
    height: 1536,
    aspectRatio: 1.79,
    orientation: "landscape",
    category: "youtube",
    intendedUsage: "YouTube page hero visual background or cover",
    alt: "Meet Shah in front of creator studio gear and lighting setup"
  },
  {
    id: "meet-content-poster",
    src: "/images/meet/meet-content-poster.jpg",
    width: 2752,
    height: 1536,
    aspectRatio: 1.79,
    orientation: "landscape",
    category: "ugc",
    intendedUsage: "UGC page creative concepts illustration",
    alt: "Typographic print poster spelling CONTENT with creative writing hooks"
  },
  {
    id: "meet-creativity-poster",
    src: "/images/meet/meet-creativity-poster.jpg",
    width: 2752,
    height: 1536,
    aspectRatio: 1.79,
    orientation: "landscape",
    category: "home",
    intendedUsage: "Creative story split-scroll active slide visual",
    alt: "Meet Shah Creativity & Editorial layout sheet graphic"
  },
  {
    id: "meet-presentation-banners",
    src: "/images/meet/meet-presentation-banners.jpg",
    width: 2752,
    height: 1536,
    aspectRatio: 1.79,
    orientation: "landscape",
    category: "analytics",
    intendedUsage: "Analytics page showcase and report list background",
    alt: "Three presentation sheets illustrating creator workflows"
  },
  {
    id: "meet-services-poster",
    src: "/images/meet/meet-services-poster.jpg",
    width: 2752,
    height: 1536,
    aspectRatio: 1.79,
    orientation: "landscape",
    category: "collaboration",
    intendedUsage: "Services list hover mask image preview",
    alt: "Detailed listing of creator services and video deliverables"
  },
  {
    id: "meet-collaborate-poster",
    src: "/images/meet/meet-collaborate-poster.jpg",
    width: 2752,
    height: 1536,
    aspectRatio: 1.79,
    orientation: "landscape",
    category: "collaboration",
    intendedUsage: "Work With Me brand collaboration page hero cover",
    alt: "Meet Shah brand partnerships promotional cover layout"
  },
  {
    id: "meet-about-poster",
    src: "/images/meet/meet-about-poster.jpg",
    width: 2752,
    height: 1536,
    aspectRatio: 1.79,
    orientation: "landscape",
    category: "home",
    intendedUsage: "About page editorial banner",
    alt: "Meet Shah editorial narrative layout sheet"
  },
  {
    id: "about-lake",
    src: "/images/meet/about-lake.png",
    width: 691,
    height: 921,
    aspectRatio: 0.75,
    orientation: "portrait",
    category: "portrait",
    intendedUsage: "About page biography section portrait image",
    alt: "Meet Shah standing by a lake during sunset"
  },
  {
    id: "hero-bw",
    src: "/images/meet/hero-bw.png",
    width: 921,
    height: 921,
    aspectRatio: 1.0,
    orientation: "square",
    category: "portrait",
    intendedUsage: "Homepage black & white artistic portrait illustration",
    alt: "Meet Shah artistic black & white portrait photo"
  },
  {
    id: "mirror-selfie",
    src: "/images/fitness/mirror-selfie.png",
    width: 518,
    height: 921,
    aspectRatio: 0.56,
    orientation: "portrait",
    category: "fitness",
    intendedUsage: "Fitness vertical secondary body progress shot",
    alt: "Meet Shah mirror selfie demonstrating athletic conditioning"
  }
];

export function getAsset(id: string): MeetAsset | undefined {
  return meetAssets.find(a => a.id === id);
}

export function getAssetsByCategory(category: MeetAssetCategory): MeetAsset[] {
  return meetAssets.filter(a => a.category === category);
}
