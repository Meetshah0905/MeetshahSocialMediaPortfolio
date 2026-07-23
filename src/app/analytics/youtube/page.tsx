import { redirect } from "next/navigation";

export default function YouTubeArchiveRedirect() {
  redirect("/analytics?channel=youtube-main#archive");
}
