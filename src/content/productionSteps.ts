export type ProductionStep = {
  id: "concept" | "script" | "shoot" | "edit" | "deliver";
  index: string;
  title: string;
  description: string;
  marker: string;
  imageOffset: {
    x: number;
    y: number;
    scale: number;
  };
};

export const productionSteps: ProductionStep[] = [
  {
    id: "concept",
    index: "01",
    title: "Concept",
    description:
      "Define the campaign angle, audience problem and reason the viewer should continue watching.",
    marker: "Campaign angle",
    imageOffset: { x: 0, y: 0, scale: 1 },
  },
  {
    id: "script",
    index: "02",
    title: "Script",
    description:
      "Structure the hook, core message, demonstration and approved campaign action.",
    marker: "Hook structure",
    imageOffset: { x: -6, y: 0, scale: 1.008 },
  },
  {
    id: "shoot",
    index: "03",
    title: "Shoot",
    description:
      "Capture creator-led footage, product details and natural supporting visuals.",
    marker: "Creator footage",
    imageOffset: { x: 6, y: 0, scale: 1.012 },
  },
  {
    id: "edit",
    index: "04",
    title: "Edit",
    description:
      "Build pacing, captions, visual hierarchy and platform-safe compositions.",
    marker: "Captions and pacing",
    imageOffset: { x: 0, y: -4, scale: 1.015 },
  },
  {
    id: "deliver",
    index: "05",
    title: "Deliver",
    description:
      "Prepare the approved final assets for the required formats and usage.",
    marker: "Final assets",
    imageOffset: { x: 0, y: 0, scale: 1 },
  },
];
