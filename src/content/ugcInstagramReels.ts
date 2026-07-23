export type UGCInstagramReel = {
  id: string;
  index: string;
  shortcode: string;
  url: string;
  fallbackTitle: string;
  /** Real reel frame in /public/images/ugc/ — null falls back to the dark stage. */
  thumbnail: string | null;
  category: "UGC";
  platform: "Instagram";
  authoredAnalysis?: {
    headline?: string;
    hook?: string;
    context?: string;
    value?: string;
    proof?: string;
    action?: string;
    duration?: string;
  };
};

export const ugcInstagramReels: UGCInstagramReel[] = [
  {
    id: "ugc-reel-01",
    index: "01",
    shortcode: "DaDLVmzCuug",
    url: "https://www.instagram.com/p/DaDLVmzCuug/",
    fallbackTitle: "UGC Reel 01",
    thumbnail: "/images/ugc/ugc-reel-01.jpg",
    category: "UGC",
    platform: "Instagram",
  },
  {
    id: "ugc-reel-02",
    index: "02",
    shortcode: "DZ0ReN0Kzid",
    url: "https://www.instagram.com/p/DZ0ReN0Kzid/",
    fallbackTitle: "UGC Reel 02",
    thumbnail: "/images/ugc/ugc-reel-02.jpg",
    category: "UGC",
    platform: "Instagram",
  },
  {
    id: "ugc-reel-03",
    index: "03",
    shortcode: "DZSTFLaiWkv",
    url: "https://www.instagram.com/p/DZSTFLaiWkv/",
    fallbackTitle: "UGC Reel 03",
    thumbnail: "/images/ugc/ugc-reel-03.jpg",
    category: "UGC",
    platform: "Instagram",
  },
  {
    id: "ugc-reel-04",
    index: "04",
    shortcode: "DYp2RJRRf_R",
    url: "https://www.instagram.com/p/DYp2RJRRf_R/",
    fallbackTitle: "UGC Reel 04",
    thumbnail: "/images/ugc/ugc-reel-04.jpg",
    category: "UGC",
    platform: "Instagram",
  },
  {
    id: "ugc-reel-05",
    index: "05",
    shortcode: "DV8WtIXgiSf",
    url: "https://www.instagram.com/p/DV8WtIXgiSf/",
    fallbackTitle: "UGC Reel 05",
    thumbnail: "/images/ugc/ugc-reel-05.jpg",
    category: "UGC",
    platform: "Instagram",
  },
];
