export type SketchfabModelConfig = {
  id: string;
  label: string;
  uid: string;
  creator: string;
  category: "fitness" | "finance" | "ugc";
  enabled: boolean;
  preferred: boolean;
  embedUrl: string;
  sourceUrl: string;
};

export const sketchfabModels: SketchfabModelConfig[] = [];
