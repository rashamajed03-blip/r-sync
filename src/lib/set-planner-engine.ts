import type { TrackRef } from "./track-ref";
import { MOCK_TRACKS } from "./mock-data";
import { trackRefFromCatalog } from "./track-ref";
import { getCompatibleKeys } from "./utils";

export interface TransitionIssue {
  fromIndex: number;
  issues: string[];
}

function keyCompatible(a: string | null, b: string | null): boolean {
  if (!a || !b) return true; // can't judge missing data — don't warn on it
  return a === b || getCompatibleKeys(a).includes(b);
}

export function transitionIssues(a: TrackRef, b: TrackRef): string[] {
  const issues: string[] = [];

  if (!keyCompatible(a.camelotKey, b.camelotKey)) {
    issues.push(`Key clash: ${a.camelotKey ?? "?"} → ${b.camelotKey ?? "?"} isn't harmonically compatible`);
  }

  if (a.bpm && b.bpm) {
    const diff = Math.abs(a.bpm - b.bpm);
    if (diff > 8) issues.push(`Big BPM jump: ${a.bpm} → ${b.bpm} (${diff} BPM)`);
  }

  const energyDiff = Math.abs(a.energy - b.energy);
  if (energyDiff >= 4) {
    issues.push(`Sudden energy ${b.energy > a.energy ? "spike" : "drop"}: ${a.energy} → ${b.energy}`);
  }

  return issues;
}

export function getSetWarnings(tracks: TrackRef[]): TransitionIssue[] {
  const warnings: TransitionIssue[] = [];
  for (let i = 0; i < tracks.length - 1; i++) {
    const issues = transitionIssues(tracks[i], tracks[i + 1]);
    if (issues.length > 0) warnings.push({ fromIndex: i, issues });
  }
  return warnings;
}

/** Finds a catalog track (not already in the set) that smooths the transition between a and b. */
export function suggestBridgeTrack(a: TrackRef, b: TrackRef, excludeIds: string[]): TrackRef | null {
  let best: { track: TrackRef; issueCount: number } | null = null;

  for (const t of MOCK_TRACKS) {
    if (excludeIds.includes(t.id)) continue;
    const ref = trackRefFromCatalog(t);
    const issueCount = transitionIssues(a, ref).length + transitionIssues(ref, b).length;
    if (!best || issueCount < best.issueCount) {
      best = { track: ref, issueCount };
    }
  }

  // Only suggest if it's actually an improvement over the direct transition
  const directIssues = transitionIssues(a, b).length;
  if (!best || best.issueCount >= directIssues * 2) return null;
  return best.track;
}
