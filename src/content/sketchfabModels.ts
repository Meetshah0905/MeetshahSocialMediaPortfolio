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

export const sketchfabModels: SketchfabModelConfig[] = [
  {
    id: "finance-hakajer",
    label: "Finance",
    uid: "a061822aa1e842aa864e1ca3cb974a32",
    creator: "hakajer",
    category: "finance",
    enabled: true,
    preferred: false,
    embedUrl:
      "https://sketchfab.com/models/a061822aa1e842aa864e1ca3cb974a32/embed",
    sourceUrl:
      "https://sketchfab.com/3d-models/finance-a061822aa1e842aa864e1ca3cb974a32",
  },
  {
    id: "finance-busnabod",
    label: "Finance Model",
    uid: "21582ef26deb4cde9d6a5d9b4f678d8f",
    creator: "Busnabod",
    category: "finance",
    enabled: true,
    preferred: true,
    embedUrl:
      "https://sketchfab.com/models/21582ef26deb4cde9d6a5d9b4f678d8f/embed",
    sourceUrl:
      "https://sketchfab.com/3d-models/finance-21582ef26deb4cde9d6a5d9b4f678d8f",
  },
  {
    id: "fitness-equipment",
    label: "Fitness Equipment",
    uid: "b7bfb774ac3646fb9c37697b4e074945",
    creator: "AllenZ",
    category: "fitness",
    enabled: true,
    preferred: true,
    embedUrl:
      "https://sketchfab.com/models/b7bfb774ac3646fb9c37697b4e074945/embed",
    sourceUrl:
      "https://sketchfab.com/3d-models/fitness-equipment-b7bfb774ac3646fb9c37697b4e074945",
  },
  {
    id: "fitness-hall",
    label: "Fitness Hall",
    uid: "c06500a041584f7482c5c5325d3b2818",
    creator: "Mixall",
    category: "fitness",
    enabled: true,
    preferred: false,
    embedUrl:
      "https://sketchfab.com/models/c06500a041584f7482c5c5325d3b2818/embed",
    sourceUrl:
      "https://sketchfab.com/3d-models/fitness-hall-sports-equipment-c06500a041584f7482c5c5325d3b2818",
  },
  {
    id: "gym",
    label: "Gym Scene",
    uid: "fbd1baf5f56743e6bd4299ad91473b9a",
    creator: "Zeps3D",
    category: "fitness",
    enabled: true,
    preferred: false,
    embedUrl:
      "https://sketchfab.com/models/fbd1baf5f56743e6bd4299ad91473b9a/embed",
    sourceUrl:
      "https://sketchfab.com/3d-models/gym-fbd1baf5f56743e6bd4299ad91473b9a",
  },
  {
    id: "bitcoin",
    label: "Bitcoin Coin",
    uid: "d71eff74bd5c4e25890477a4d3ecea73",
    creator: "CryptoArt-Miki",
    category: "finance",
    enabled: true,
    preferred: false,
    embedUrl:
      "https://sketchfab.com/models/d71eff74bd5c4e25890477a4d3ecea73/embed",
    sourceUrl:
      "https://sketchfab.com/3d-models/realistic-3d-bitcoin-model-crypto-asset-d71eff74bd5c4e25890477a4d3ecea73",
  },
  {
    id: "piggybank",
    label: "Piggybank",
    uid: "40dd69fd5091499cb4c22dc84afcbe40",
    creator: "Issa",
    category: "finance",
    enabled: true,
    preferred: false,
    embedUrl:
      "https://sketchfab.com/models/40dd69fd5091499cb4c22dc84afcbe40/embed",
    sourceUrl:
      "https://sketchfab.com/3d-models/cute-and-clean-piggybank-optional-side-logo-40dd69fd5091499cb4c22dc84afcbe40",
  },
  {
    id: "dollar-bundles",
    label: "Dollar Bundles",
    uid: "1d5a39e535ba4199800be16d1b492333",
    creator: "HQ3DMOD",
    category: "finance",
    enabled: true,
    preferred: false,
    embedUrl:
      "https://sketchfab.com/models/1d5a39e535ba4199800be16d1b492333/embed",
    sourceUrl:
      "https://sketchfab.com/3d-models/american-dollar-bundles-large-set-1d5a39e535ba4199800be16d1b492333",
  },
  {
    id: "gold-card",
    label: "Gold Card",
    uid: "e1ea1d2096a143c0b064b3a09c61faad",
    creator: "FraxionFx",
    category: "finance",
    enabled: true,
    preferred: false,
    embedUrl:
      "https://sketchfab.com/models/e1ea1d2096a143c0b064b3a09c61faad/embed",
    sourceUrl:
      "https://sketchfab.com/3d-models/societe-generale-visa-gold-card-e1ea1d2096a143c0b064b3a09c61faad",
  },
];
