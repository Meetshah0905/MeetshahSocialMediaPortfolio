import type { Metadata } from "next";
import FinanceClientPage from "./FinanceClientPage";

export const metadata: Metadata = {
  title: "Finance Portfolio & Channel Details",
  description: "Explore `@meet.fitfix` statistics, personal finance content pillars, and book 1:1 money strategy sessions.",
};

export default function FinancePage() {
  return <FinanceClientPage />;
}
