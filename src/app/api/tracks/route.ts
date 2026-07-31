import { NextRequest, NextResponse } from "next/server";
import { getAllTracks, searchTracksAsync } from "@/lib/data/tracks";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  const tracks = q ? await searchTracksAsync(q) : await getAllTracks();
  return NextResponse.json({ tracks });
}
