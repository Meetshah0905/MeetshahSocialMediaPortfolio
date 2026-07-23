import { redirect } from "next/navigation";

export default function FinanceArchiveRedirect() {
  redirect("/analytics?channel=instagram-finance#archive");
}
