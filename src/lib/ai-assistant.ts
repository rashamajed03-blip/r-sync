import type { Track } from "./mock-data";

export interface VibeProfile {
  label: string;
  energyRange: [number, number];
  moods: string[];
  genreLean: string[];
}

export interface AIMatch {
  track: Track;
  reasons: string[];
}

export interface AIResponse {
  interpretation: string;
  matches: AIMatch[];
}

/**
 * Keyword → vibe profile mapping. This is the part that gets replaced by a
 * real LLM call — see `getAIRecommendations` below for the integration seam.
 * Order matters: first matching pattern wins.
 */
const VIBE_PATTERNS: { pattern: RegExp; profile: VibeProfile }[] = [
  {
    pattern: /sunset|golden hour|opening/i,
    profile: {
      label: "a warm, opening-set energy",
      energyRange: [3, 6],
      moods: ["Warm", "Reflective", "Euphoric"],
      genreLean: ["Deep House", "Melodic House"],
    },
  },
  {
    pattern: /dark|darker|underground|late night/i,
    profile: {
      label: "a darker, hypnotic energy",
      energyRange: [7, 10],
      moods: ["Hypnotic", "Intense"],
      genreLean: ["Melodic Techno", "Techno"],
    },
  },
  {
    pattern: /festival|main stage|peak time|big room/i,
    profile: {
      label: "a big, festival-ready energy",
      energyRange: [8, 10],
      moods: ["Euphoric", "Intense"],
      genreLean: ["Progressive House", "Techno"],
    },
  },
  {
    pattern: /clos(e|ing)|last track|wind down|end of the night/i,
    profile: {
      label: "a reflective, closing-set energy",
      energyRange: [2, 5],
      moods: ["Reflective", "Warm"],
      genreLean: ["Deep House", "Melodic House"],
    },
  },
];

const FALLBACK_PROFILE: VibeProfile = {
  label: "a balanced, versatile energy",
  energyRange: [4, 8],
  moods: [],
  genreLean: [],
};

function interpretPrompt(prompt: string, pool: Track[]): VibeProfile {
  if (/surprise/i.test(prompt) && pool.length > 0) {
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const seed = shuffled[0];
    return {
      label: `something unexpected — starting from ${seed.mood.toLowerCase()} ${seed.genre.toLowerCase()}`,
      energyRange: [Math.max(1, seed.energy - 2), Math.min(10, seed.energy + 2)],
      moods: [seed.mood],
      genreLean: [seed.genre],
    };
  }
  for (const { pattern, profile } of VIBE_PATTERNS) {
    if (pattern.test(prompt)) return profile;
  }
  return FALLBACK_PROFILE;
}

function scoreAgainstVibe(track: Track, profile: VibeProfile): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  const [lo, hi] = profile.energyRange;
  if (track.energy >= lo && track.energy <= hi) {
    score += 40;
    reasons.push(`Energy ${track.energy}/10 fits the ${profile.label}`);
  } else {
    const dist = track.energy < lo ? lo - track.energy : track.energy - hi;
    score += Math.max(0, 20 - dist * 8);
  }

  if (profile.moods.length && profile.moods.includes(track.mood)) {
    score += 30;
    reasons.push(`${track.mood} mood matches what you're going for`);
  }

  if (profile.genreLean.length && profile.genreLean.includes(track.genre)) {
    score += 20;
    reasons.push(`${track.genre} leans into that direction`);
  }

  score += Math.min(10, track.popularity / 10);
  if (track.popularity >= 80) reasons.push("Tested and popular with other DJs");

  return { score, reasons };
}

/**
 * Production integration point: replace the body of this function with a
 * server action / API route that calls the Anthropic Messages API — pass the
 * prompt plus a compact JSON summary of the user's library, ask for a ranked
 * track ID list plus reasons in structured JSON, then hydrate against the
 * `pool` passed in below (already DB-backed via /api/tracks as of Milestone
 * 9). Keep the return shape (`AIResponse`) the same so this page doesn't
 * need to change.
 */
export async function getAIRecommendations(prompt: string, pool: Track[]): Promise<AIResponse> {
  // Simulated "thinking" latency — remove once wired to a real API call.
  await new Promise((r) => setTimeout(r, 900));

  const profile = interpretPrompt(prompt, pool);
  const scored = pool
    .map((t) => ({ track: t, ...scoreAgainstVibe(t, profile) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  return {
    interpretation: `Reading that as a request for ${profile.label}${
      profile.genreLean.length ? `, with a ${profile.genreLean.join(" or ")} lean` : ""
    }. Here's what fits:`,
    matches: scored.map(({ track, reasons }) => ({
      track,
      reasons: reasons.length ? reasons : ["Solid all-around fit for this prompt"],
    })),
  };
}
