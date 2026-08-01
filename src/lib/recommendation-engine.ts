import type { Track } from "./mock-data";
import { getCompatibleKeys } from "./utils";

export interface MatchResult {
  track: Track;
  score: number;
  reasons: string[];
}

/**
 * Scores a candidate track against a reference track for transition quality.
 * Weights (out of 100, before the owned-library boost): key 35, BPM 30,
 * genre 15, energy 15, popularity signal 5. Transparent by design — every
 * point maps to a reason a DJ can read.
 *
 * `ownedKeys` is an optional set of "title|artist" (lowercase) strings from
 * the user's imported Rekordbox library — matching tracks get a score boost
 * and a called-out reason, per the brief's "prioritize tracks the user
 * already owns" requirement.
 */
export function scoreMatch(
  reference: Track,
  candidate: Track,
  ownedKeys?: Set<string>,
): MatchResult {
  let score = 0;
  const reasons: string[] = [];

  // Harmonic key — same key beats compatible beats nothing
  if (candidate.camelotKey === reference.camelotKey) {
    score += 35;
    reasons.push("Same Camelot key — seamless harmonic match");
  } else if (getCompatibleKeys(reference.camelotKey).includes(candidate.camelotKey)) {
    score += 25;
    reasons.push(`Compatible key (${reference.camelotKey} → ${candidate.camelotKey})`);
  }

  // BPM proximity
  const bpmDiff = Math.abs(candidate.bpm - reference.bpm);
  if (bpmDiff === 0) {
    score += 30;
    reasons.push("Identical BPM — no tempo adjustment needed");
  } else if (bpmDiff <= 1) {
    score += 24;
    reasons.push(`BPM within 1 (${candidate.bpm} vs ${reference.bpm})`);
  } else if (bpmDiff <= 3) {
    score += 15;
    reasons.push(`BPM within ${bpmDiff}`);
  } else if (bpmDiff <= 6) {
    score += 6;
  }

  // Genre / subgenre
  if (candidate.genre === reference.genre) {
    score += 10;
    reasons.push("Same genre");
    if (candidate.subgenre === reference.subgenre) {
      score += 5;
      reasons.push("Same subgenre");
    }
  }

  // Energy similarity
  const energyDiff = Math.abs(candidate.energy - reference.energy);
  if (energyDiff === 0) {
    score += 15;
    reasons.push("Matching energy level");
  } else if (energyDiff === 1) {
    score += 10;
    reasons.push("Similar energy");
  } else if (energyDiff === 2) {
    score += 5;
  }

  // Popularity as a "frequently mixed together" proxy
  if (candidate.popularity >= 75 && score > 30) {
    score += 5;
    reasons.push("Frequently mixed together");
  }

  // Owned-library boost — prioritizing what the DJ can actually play tonight
  if (ownedKeys?.has(`${candidate.title.toLowerCase()}|${candidate.artist.toLowerCase()}`)) {
    score += 12;
    reasons.unshift("Already in your library");
  }

  return { track: candidate, score: Math.min(100, score), reasons };
}

export function getRecommendations(
  reference: Track,
  pool: Track[],
  ownedKeys?: Set<string>,
): MatchResult[] {
  return pool
    .filter((t) => t.id !== reference.id)
    .map((t) => scoreMatch(reference, t, ownedKeys))
    .sort((a, b) => b.score - a.score);
}
