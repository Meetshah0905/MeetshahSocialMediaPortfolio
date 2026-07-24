import { NextRequest, NextResponse } from "next/server";
import { getYouTubeVideo, deleteYouTubeVideo } from "@/lib/storage/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = await getYouTubeVideo(id);
  if (!item) {
    return NextResponse.json({ error: "Video record not found" }, { status: 404 });
  }
  return NextResponse.json(item);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = await deleteYouTubeVideo(id);
  return NextResponse.json({ success: deleted });
}
