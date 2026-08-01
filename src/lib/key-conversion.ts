/**
 * Rekordbox exports the musical key in the <TRACK Tonality="..."> attribute.
 * Depending on the user's Rekordbox preferences this can already be Camelot
 * ("8B"), or standard musical notation ("Cmaj", "F#m", "Abmin", "A Minor").
 * This table covers the standard notation case; Camelot values pass through.
 */
const FLAT_TO_SHARP: Record<string, string> = {
  Db: "C#",
  Eb: "D#",
  Gb: "F#",
  Ab: "G#",
  Bb: "A#",
};

// Major key (outer wheel, "B") root note -> Camelot number
const MAJOR_TO_CAMELOT: Record<string, number> = {
  B: 1,
  "F#": 2,
  "C#": 3,
  "G#": 4,
  "D#": 5,
  "A#": 6,
  F: 7,
  C: 8,
  G: 9,
  D: 10,
  A: 11,
  E: 12,
};

// Minor key (inner wheel, "A") root note -> Camelot number
const MINOR_TO_CAMELOT: Record<string, number> = {
  "G#": 1,
  "D#": 2,
  "A#": 3,
  F: 4,
  C: 5,
  G: 6,
  D: 7,
  A: 8,
  E: 9,
  B: 10,
  "F#": 11,
  "C#": 12,
};

export function convertKeyToCamelot(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // Already Camelot notation, e.g. "8B", "12a"
  if (/^\d{1,2}[ab]$/i.test(trimmed)) {
    return trimmed.toUpperCase();
  }

  // Normalize "A Minor" / "Amin" / "Am" / "A minor" / "Amaj" / "A Major" / "A"
  const match = trimmed.match(/^([A-Ga-g])([#b]?)\s*(maj(or)?|min(or)?|m)?$/i);
  if (!match) return null;

  let note = match[1].toUpperCase();
  const accidental = match[2];
  const modeRaw = (match[3] ?? "").toLowerCase();
  const isMinor = modeRaw.startsWith("min") || modeRaw === "m";

  if (accidental === "#") note = `${note}#`;
  if (accidental === "b") note = FLAT_TO_SHARP[`${note}b`] ?? note;

  const table = isMinor ? MINOR_TO_CAMELOT : MAJOR_TO_CAMELOT;
  const num = table[note];
  if (!num) return null;

  return `${num}${isMinor ? "A" : "B"}`;
}
