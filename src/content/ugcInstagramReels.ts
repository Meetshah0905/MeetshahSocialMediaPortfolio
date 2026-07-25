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
    fallbackTitle: "UGC Reel 01 — Fitness & Nutrition Strategy",
    thumbnail: "/images/ugc/ugc-reel-01.jpg",
    category: "UGC",
    platform: "Instagram",
    authoredAnalysis: {
      headline: "Dedicated Supplement & Fitness UGC Reel",
      hook: "High-energy workout opening with bold text overlay 'Stop making this protein mistake'.",
      context: "Meet Shah introduces daily workout fatigue and macro tracking pain-points.",
      value: "Product demonstration highlighting mixability, ingredients, and post-workout recovery.",
      proof: "On-screen nutrition breakdown and authentic taste feedback with macro comparison.",
      action: "Direct Call-to-Action with discount code sticker and Instagram link sticker.",
      duration: "0:45",
    },
  },
  {
    id: "ugc-reel-02",
    index: "02",
    shortcode: "DZ0ReN0Kzid",
    url: "https://www.instagram.com/p/DZ0ReN0Kzid/",
    fallbackTitle: "UGC Reel 02 — Personal Finance & Fintech Walkthrough",
    thumbnail: "/images/ugc/ugc-reel-02.jpg",
    category: "UGC",
    platform: "Instagram",
    authoredAnalysis: {
      headline: "Fintech App Walkthrough & Wealth Strategy",
      hook: "Screen recording hook showing portfolio growth with text overlay '3 Mutual Fund rules for 2026'.",
      context: "Addressing beginner anxiety around market volatility and index fund selection.",
      value: "Live app UI walk-through showing automated SIP setup and zero-commission investing.",
      proof: "Highlighting compliance disclaimers and verified historical CAGR comparison chart.",
      action: "Swipe-up link sticker to download app & claim exclusive welcome bonus.",
      duration: "0:50",
    },
  },
  {
    id: "ugc-reel-03",
    index: "03",
    shortcode: "DZSTFLaiWkv",
    url: "https://www.instagram.com/p/DZSTFLaiWkv/",
    fallbackTitle: "UGC Reel 03 — Creator Studio & Audio Gear Review",
    thumbnail: "/images/ugc/ugc-reel-03.jpg",
    category: "UGC",
    platform: "Instagram",
    authoredAnalysis: {
      headline: "Wireless Audio & Mobile Studio Setup",
      hook: "Audio comparison test contrasting noisy background vs crystal clear wireless mic audio.",
      context: "Showcasing the hassle of wired mics during active outdoor shoots in Ahmedabad.",
      value: "Hands-on unboxing, battery life stress test, and noise cancellation demonstration.",
      proof: "Outdoor wind noise test and dual-channel recording quality breakdown.",
      action: "Product purchase link in bio with exclusive community promo code.",
      duration: "0:45",
    },
  },
  {
    id: "ugc-reel-04",
    index: "04",
    shortcode: "DYp2RJRRf_R",
    url: "https://www.instagram.com/p/DYp2RJRRf_R/",
    fallbackTitle: "UGC Reel 04 — Vegetarian Meal Prep & Conditioning",
    thumbnail: "/images/ugc/ugc-reel-04.jpg",
    category: "UGC",
    platform: "Instagram",
    authoredAnalysis: {
      headline: "Vegetarian High-Protein Meal Prep",
      hook: "Sizzling meal prep action shot with 'How I hit 120g protein as a vegetarian'.",
      context: "Addressing common myth that vegetarian diets lack adequate protein sources.",
      value: "Step-by-step grocery breakdown, meal prep workflow, and cooking demonstration.",
      proof: "Exact calorie & macro split spreadsheet overlayed on screen.",
      action: "Save this reel for your next grocery run & check link for full meal plan.",
      duration: "0:50",
    },
  },
  {
    id: "ugc-reel-05",
    index: "05",
    shortcode: "DV8WtIXgiSf",
    url: "https://www.instagram.com/p/DV8WtIXgiSf/",
    fallbackTitle: "UGC Reel 05 — Productivity & Expense Tracking",
    thumbnail: "/images/ugc/ugc-reel-05.jpg",
    category: "UGC",
    platform: "Instagram",
    authoredAnalysis: {
      headline: "Budgeting & Expense Tracking Automation",
      hook: "Visual cash envelope vs digital budget app comparison with 'Where your salary actually goes'.",
      context: "Showing impulse spending traps and monthly expense leakage.",
      value: "Step-by-step 50/30/20 budget allocation demo inside finance management app.",
      proof: "3-month savings progress graph and user rating benchmarks.",
      action: "Click link to try the automated budget template for free.",
      duration: "0:45",
    },
  },
];
