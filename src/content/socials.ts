export const socials = {
  instagramFitness: {
    handle: "@meetsofficial",
    url: "https://www.instagram.com/meetsofficial/",
    followers: "11.9K",
    label: "Fitness Instagram",
  },
  instagramFinance: {
    handle: "@meet.fitfix",
    url: "https://www.instagram.com/meet.fitfix/",
    followers: "15.1K",
    label: "Finance Instagram",
  },
  email: {
    address: "editsbymks@gmail.com",
    url: "mailto:editsbymks@gmail.com",
    label: "Email",
  },
  linkedin: {
    url: "https://www.linkedin.com/in/meet-shah-527440372/",
    label: "LinkedIn",
  },
  twitter: {
    url: "https://x.com/meet_s_official",
    label: "X",
  },
  location: {
    city: "Ahmedabad",
    country: "India",
    display: "Ahmedabad, India",
  },
  combinedCommunity: "27K+",
} as const;

export type SocialConfig = typeof socials;
