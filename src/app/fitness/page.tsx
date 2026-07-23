import type { Metadata } from "next";
import FitnessClientPage from "./FitnessClientPage";
import { getPlatformProfile } from "@/lib/storage/db";

export const metadata: Metadata = {
  title: "Fitness Portfolio & Channel Details",
  description: "Explore `@meetsofficial` statistics, fitness content pillars (Diet, Workout, Technique), and book 1:1 training sessions.",
};

export default async function FitnessPage() {
  const profile = await getPlatformProfile("instagram_fitness");
  // 0 = no published value; the client renders an unavailable state, not a
  // hardcoded stand-in (§2).
  const followerCount = profile?.currentValue ?? 0;
  return <FitnessClientPage initialFollowers={followerCount} />;
}
