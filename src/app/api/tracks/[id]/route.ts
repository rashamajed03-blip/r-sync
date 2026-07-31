import { NextResponse } from "next/server";
import { getTrackByIdAsync } from "@/lib/data/tracks";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const track = await getTrackByIdAsync(id);
  if (!track) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ track });
}
