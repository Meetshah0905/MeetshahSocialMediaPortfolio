/**
 * Contact page + footer copy (§26).
 *
 * The form is only rendered when NEXT_PUBLIC_FORMSPREE_ENDPOINT is configured;
 * otherwise the page falls back to direct links rather than posting to a
 * broken endpoint.
 */

export const contact = {
  eyebrow: "Contact",
  heading: "Tell me about your campaign.",
  intro: "Reach out to discuss brand integrations, UGC creation, or custom campaigns. Let's build something people remember.",
  /** What happens after someone gets in touch. Sets expectations honestly. */
  nextStep: "I'll review your proposal and get back to you with rates and availability within 24-48 hours.",

  form: {
    endpoint: process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ?? "",
    collaborationTypes: [
      "UGC content",
      "Dedicated reel",
      "Integrated reel",
      "Story sequence",
      "In-feed post",
      "Long-term partnership",
      "Something else",
    ],
    budgetRanges: [
      "Not sure yet",
      "Under ₹25,000",
      "₹25,000 – ₹50,000",
      "₹50,000 – ₹1,00,000",
      "Over ₹1,00,000",
    ],
    timelines: ["As soon as possible", "This month", "Next month", "Flexible"],
    successMessage:
      "Thanks — your message is in. I'll come back to you shortly.",
    errorMessage:
      "That didn't send. Please try again, or email me directly using the link above.",
  },
} as const;

/** True when the form can actually submit somewhere. */
export const isContactFormEnabled = contact.form.endpoint.length > 0;

export const footerContent = {
  positioning: "Fitness & Finance Creator helping brands turn ideas into engaging content that earns attention.",
  copyright: (year: number) => `© ${year} Meet Shah. All rights reserved.`,
  /** Subtle, not prominent (§27). */
  adminLinkLabel: "Creator access",
} as const;
