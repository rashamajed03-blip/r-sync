import { convertKeyToCamelot } from "./key-conversion";
import { getCompatibleKeys } from "./utils";

export interface ImportedTrack {
  id: string;
  title: string;
  artist: string;
  genre: string;
  label: string;
  year: number | null;
  bpm: number | null;
  camelotKey: string | null;
  durationSec: number | null;
  /**
   * Heuristic 1–10 energy estimate derived from this track's BPM position
   * relative to the rest of the imported library. Rekordbox doesn't export a
   * real energy value — this is a placeholder until real audio analysis (or
   * an AI energy model) lands in a later milestone.
   */
  energy: number;
}

export class RekordboxParseError extends Error {}

/** Parses a Rekordbox XML export string into a flat track list. Runs client-side (DOMParser). */
export function parseRekordboxXML(xmlText: string): Omit<ImportedTrack, "energy">[] {
  const doc = new DOMParser().parseFromString(xmlText, "application/xml");

  if (doc.querySelector("parsererror")) {
    throw new RekordboxParseError("That file doesn't look like valid XML.");
  }

  const trackNodes = doc.querySelectorAll("COLLECTION > TRACK");
  if (trackNodes.length === 0) {
    throw new RekordboxParseError(
      "No tracks found. Make sure this is a Rekordbox library export (File → Export Collection in XML format).",
    );
  }

  const tracks: Omit<ImportedTrack, "energy">[] = [];
  trackNodes.forEach((node, i) => {
    const name = node.getAttribute("Name");
    if (!name) return; // skip malformed entries rather than failing the whole import

    const bpmRaw = node.getAttribute("AverageBpm");
    const totalTimeRaw = node.getAttribute("TotalTime");
    const yearRaw = node.getAttribute("Year");

    tracks.push({
      id: node.getAttribute("TrackID") ?? `import-${i}`,
      title: name,
      artist: node.getAttribute("Artist") || "Unknown Artist",
      genre: node.getAttribute("Genre") || "Unknown",
      label: node.getAttribute("Label") || "—",
      year: yearRaw ? parseInt(yearRaw, 10) || null : null,
      bpm: bpmRaw ? Math.round(parseFloat(bpmRaw)) || null : null,
      camelotKey: convertKeyToCamelot(node.getAttribute("Tonality")),
      durationSec: totalTimeRaw ? parseInt(totalTimeRaw, 10) || null : null,
    });
  });

  if (tracks.length === 0) {
    throw new RekordboxParseError("Tracks were found, but none had readable names.");
  }

  return tracks;
}

/** Assigns each track a heuristic 1–10 energy value based on its BPM percentile within the library. */
export function estimateEnergy(
  tracks: Omit<ImportedTrack, "energy">[],
): ImportedTrack[] {
  const bpms = tracks.map((t) => t.bpm).filter((b): b is number => b !== null);
  const min = bpms.length ? Math.min(...bpms) : 0;
  const max = bpms.length ? Math.max(...bpms) : 1;
  const range = Math.max(1, max - min);

  return tracks.map((t) => {
    const energy = t.bpm ? Math.round(1 + ((t.bpm - min) / range) * 9) : 5;
    return { ...t, energy: Math.min(10, Math.max(1, energy)) };
  });
}

export interface LibraryStats {
  trackCount: number;
  genreCounts: { genre: string; count: number }[];
  keyCounts: { key: string; count: number }[];
  bpmBuckets: { range: string; count: number }[];
  energyBuckets: { level: number; count: number }[];
  keysCovered: number;
  compatibleTransitionPairs: number;
  bpmRange: [number, number] | null;
}

export function computeLibraryStats(tracks: ImportedTrack[]): LibraryStats {
  const genreCounts = new Map<string, number>();
  const keyCounts = new Map<string, number>();
  const energyCounts = new Map<number, number>();
  const bpms: number[] = [];

  for (const t of tracks) {
    genreCounts.set(t.genre, (genreCounts.get(t.genre) ?? 0) + 1);
    if (t.camelotKey) keyCounts.set(t.camelotKey, (keyCounts.get(t.camelotKey) ?? 0) + 1);
    energyCounts.set(t.energy, (energyCounts.get(t.energy) ?? 0) + 1);
    if (t.bpm) bpms.push(t.bpm);
  }

  // BPM histogram in buckets of 5
  const bpmBucketMap = new Map<number, number>();
  for (const bpm of bpms) {
    const bucket = Math.floor(bpm / 5) * 5;
    bpmBucketMap.set(bucket, (bpmBucketMap.get(bucket) ?? 0) + 1);
  }
  const bpmBuckets = Array.from(bpmBucketMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([start, count]) => ({ range: `${start}–${start + 4}`, count }));

  // Compatible transition pairs: for every track with a key, count how many
  // other tracks in the library share a harmonically compatible key.
  let compatibleTransitionPairs = 0;
  const keyed = tracks.filter((t) => t.camelotKey);
  for (let i = 0; i < keyed.length; i++) {
    const compatible = new Set(getCompatibleKeys(keyed[i].camelotKey!));
    for (let j = i + 1; j < keyed.length; j++) {
      if (compatible.has(keyed[j].camelotKey!)) compatibleTransitionPairs++;
    }
  }

  return {
    trackCount: tracks.length,
    genreCounts: Array.from(genreCounts.entries())
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count),
    keyCounts: Array.from(keyCounts.entries())
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => b.count - a.count),
    bpmBuckets,
    energyBuckets: Array.from({ length: 10 }, (_, i) => ({
      level: i + 1,
      count: energyCounts.get(i + 1) ?? 0,
    })),
    keysCovered: keyCounts.size,
    compatibleTransitionPairs,
    bpmRange: bpms.length ? [Math.min(...bpms), Math.max(...bpms)] : null,
  };
}
