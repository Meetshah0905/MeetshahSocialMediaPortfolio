import { redirect } from "next/navigation";

export default function FitnessArchiveRedirect() {
  redirect("/analytics?channel=instagram-fitness#archive");
}
