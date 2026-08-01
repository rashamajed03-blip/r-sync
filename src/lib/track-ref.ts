import type { Track } from "./mock-data";
import type { ImportedTrack } from "./rekordbox-import";

export interface TrackRef {
  id: string;
  title: string;
  artist: string;
  genre: string;
  bpm: number | null;
  camelotKey: string | null;
  energy: number;
  artworkColors: [string, string];
}

export function trackRefFromCatalog(t: Track): TrackRef {
  return {
    id: t.id,
    title: t.title,
    artist: t.artist,
    genre: t.genre,
    bpm: t.bpm,
    camelotKey: t.camelotKey,
    energy: t.energy,
    artworkColors: t.artworkColors,
  };
}

export function trackRefFromImported(t: ImportedTrack): TrackRef {
  return {
    id: t.id,
    title: t.title,
    artist: t.artist,
    genre: t.genre,
    bpm: t.bpm,
    camelotKey: t.camelotKey,
    energy: t.energy,
    artworkColors: ["#22D3EE", "#A855F7"],
  };
}
