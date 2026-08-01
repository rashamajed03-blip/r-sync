import { prisma } from "@/lib/db";
import {
  MOCK_TRACKS,
  searchTracks as searchMockTracks,
  getTrackById as getMockTrackById,
  type Track,
} from "@/lib/mock-data";

function rowToTrack(row: {
  id: string;
  title: string;
  artist: string;
  label: string;
  genre: string;
  subgenre: string;
  releaseYear: number;
  durationSec: number;
  bpm: number;
  camelotKey: string;
  musicalKey: string;
  energy: number;
  danceability: number;
  popularity: number;
  mood: string;
  vocal: boolean;
  explicit: boolean;
  artworkColor1: string;
  artworkColor2: string;
}): Track {
  return {
    id: row.id,
    title: row.title,
    artist: row.artist,
    label: row.label,
    genre: row.genre,
    subgenre: row.subgenre,
    releaseYear: row.releaseYear,
    durationSec: row.durationSec,
    bpm: row.bpm,
    camelotKey: row.camelotKey,
    musicalKey: row.musicalKey,
    energy: row.energy,
    danceability: row.danceability,
    popularity: row.popularity,
    mood: row.mood,
    vocal: row.vocal,
    explicit: row.explicit,
    artworkColors: [row.artworkColor1, row.artworkColor2],
  };
}

export async function getAllTracks(): Promise<Track[]> {
  if (!prisma) return MOCK_TRACKS;
  const rows = await prisma.track.findMany({ orderBy: { popularity: "desc" } });
  return rows.map(rowToTrack);
}

export async function getTrackByIdAsync(id: string): Promise<Track | undefined> {
  if (!prisma) return getMockTrackById(id);
  const row = await prisma.track.findUnique({ where: { id } });
  return row ? rowToTrack(row) : undefined;
}

export async function searchTracksAsync(query: string): Promise<Track[]> {
  const q = query.trim();
  if (!q) return getAllTracks();
  if (!prisma) return searchMockTracks(q);

  const rows = await prisma.track.findMany({
    where: {
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { artist: { contains: q, mode: "insensitive" } },
        { genre: { contains: q, mode: "insensitive" } },
        { subgenre: { contains: q, mode: "insensitive" } },
        { label: { contains: q, mode: "insensitive" } },
        { camelotKey: { equals: q.toUpperCase() } },
        { musicalKey: { contains: q, mode: "insensitive" } },
      ],
    },
    orderBy: { popularity: "desc" },
    take: 50,
  });
  return rows.map(rowToTrack);
}

/** True when the app is reading from Postgres rather than the bundled mock dataset. */
export const isLiveDatabase = Boolean(prisma);
