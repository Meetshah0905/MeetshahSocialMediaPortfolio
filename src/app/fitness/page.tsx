import type { Metadata } from "next";
import FitnessClientPage from "./FitnessClientPage";

export const metadata: Metadata = {
  title: "Fitness Portfolio & Channel Details",
  description: "Explore `@meetsofficial` statistics, fitness content pillars (Diet, Workout, Technique), and book 1:1 training sessions.",
};

export default function FitnessPage() {
  return <FitnessClientPage />;
}
