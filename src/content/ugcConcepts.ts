export type UGCConcept = {
  id: "product-education" | "app-walkthrough" | "creator-testimonial";
  index: string;
  label: string;
  title: string;
  duration: string;
  objective: string;
  hook: string;
  structure: {
    step: string;
    label: string;
    time: string;
    description: string;
  }[];
  visualDirection: string;
  cta: string;
  videoId: string;
};

export const ugcConcepts: UGCConcept[] = [
  {
    id: "product-education",
    index: "01",
    label: "PRODUCT EDUCATION · 35–45 SEC",
    title: "Explain the product through a useful audience problem.",
    duration: "35–45 SEC",
    objective: "Introduce the product naturally by first addressing a real question or mistake faced by the target audience.",
    hook: "“Most people use this correctly—but at the wrong time.”",
    structure: [
      {
        step: "01",
        label: "Hook",
        time: "0:00 - 0:03",
        description: "Address the immediate misconception or daily habit mistake to earn retention.",
      },
      {
        step: "02",
        label: "Context",
        time: "0:03 - 0:10",
        description: "Explain why traditional approaches fail or cause unnecessary frustration.",
      },
      {
        step: "03",
        label: "Value",
        time: "0:10 - 0:22",
        description: "Demonstrate product formulation or design solution in action with clear text overlays.",
      },
      {
        step: "04",
        label: "Proof",
        time: "0:22 - 0:34",
        description: "Close-up visual evidence showing immediate usability and daily routine integration.",
      },
      {
        step: "05",
        label: "Action",
        time: "0:34 - 0:42",
        description: "CTA defined by the approved campaign brief.",
      },
    ],
    visualDirection: "Direct-to-camera explanation, close-up product details, practical demonstration and concise text overlays.",
    cta: "CTA defined by the approved campaign brief.",
    videoId: "gOInL4NHcbQ", // 5 Signs You Have a Severe Magnesium Deficiency 🧬
  },
  {
    id: "app-walkthrough",
    index: "02",
    label: "APP / SERVICE UGC · 40–55 SEC",
    title: "Demonstrate the experience instead of only describing it.",
    duration: "40–55 SEC",
    objective: "Show how the product works, where it fits into a routine and what problem it helps simplify.",
    hook: "“I tracked this for seven days. Here is what became easier.”",
    structure: [
      {
        step: "01",
        label: "Hook",
        time: "0:00 - 0:03",
        description: "Visual screen recording hook demonstrating immediate workflow speed.",
      },
      {
        step: "02",
        label: "Context",
        time: "0:03 - 0:12",
        description: "Establish the manual friction point before adopting the digital tool.",
      },
      {
        step: "03",
        label: "Value",
        time: "0:12 - 0:28",
        description: "Walk through core features, setup simplicity, and live screen navigation.",
      },
      {
        step: "04",
        label: "Proof",
        time: "0:28 - 0:42",
        description: "Real personal outcome summary and side-by-side time savings audit.",
      },
      {
        step: "05",
        label: "Action",
        time: "0:42 - 0:50",
        description: "CTA defined by the approved campaign brief.",
      },
    ],
    visualDirection: "Screen recording, creator voice-over, direct-to-camera context and interface-focused close-ups.",
    cta: "CTA defined by the approved campaign brief.",
    videoId: "gPYpzDbR2us", // I Replaced My Thumbnail Editor in 50 Seconds 🤯
  },
  {
    id: "creator-testimonial",
    index: "03",
    label: "CREATOR TESTIMONIAL · 25–40 SEC",
    title: "Build trust through a believable creator experience.",
    duration: "25–40 SEC",
    objective: "Connect the product to a relevant creator routine without making the content feel like an interruption.",
    hook: "“I kept seeing this everywhere, so I tested where it actually fits.”",
    structure: [
      {
        step: "01",
        label: "Hook",
        time: "0:00 - 0:03",
        description: "Honest curiosity hook addressing widespread online hype.",
      },
      {
        step: "02",
        label: "Context",
        time: "0:03 - 0:09",
        description: "Initial expectations vs real-world testing environment setup.",
      },
      {
        step: "03",
        label: "Value",
        time: "0:09 - 0:20",
        description: "Highlight one practical feature or unexpected benefit uncovered during use.",
      },
      {
        step: "04",
        label: "Proof",
        time: "0:20 - 0:30",
        description: "Balanced feedback demonstrating authentic creator alignment and reliability.",
      },
      {
        step: "05",
        label: "Action",
        time: "0:30 - 0:36",
        description: "CTA defined by the approved campaign brief.",
      },
    ],
    visualDirection: "Natural creator setting, product interaction, observational footage and concise first-person narration.",
    cta: "CTA defined by the approved campaign brief.",
    videoId: "sr5DOQ09Mw8", // The Dark Truth About Overtraining Nobody Talks About
  },
];
