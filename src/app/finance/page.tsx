import type { Metadata } from "next";
import FinanceClientPage from "./FinanceClientPage";
import { getPlatformProfile } from "@/lib/storage/db";

export const metadata: Metadata = {
  title: "Finance Portfolio & Channel Details",
  description: "Explore `@meet.fitfix` statistics, personal finance content pillars, and book 1:1 money strategy sessions.",
};

export default async function FinancePage() {
  const profile = await getPlatformProfile("instagram_finance");
  // 0 = no published value; the client renders an unavailable state, not a
  // hardcoded stand-in (§2).
  const followerCount = profile?.currentValue ?? 0;
  return <FinanceClientPage initialFollowers={followerCount} />;
}
