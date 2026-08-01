export interface Track {
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
  energy: number; // 1–10
  danceability: number; // 0–100
  popularity: number; // 0–100
  mood: string;
  vocal: boolean;
  explicit: boolean;
  artworkColors: [string, string];
}

const CYAN = "#22D3EE";
const PURPLE = "#A855F7";

export const MOCK_TRACKS: Track[] = [
  { id: "t1", title: "Rebirth (Extended Mix)", artist: "Nova Reyes", label: "Afterglow Records", genre: "Melodic Techno", subgenre: "Progressive", releaseYear: 2025, durationSec: 372, bpm: 124, camelotKey: "8B", musicalKey: "C# Major", energy: 7, danceability: 74, popularity: 82, mood: "Uplifting", vocal: false, explicit: false, artworkColors: [CYAN, PURPLE] },
  { id: "t2", title: "Low Tide", artist: "Ferro & Kessel", label: "Deep Roots", genre: "Deep House", subgenre: "Organic", releaseYear: 2024, durationSec: 401, bpm: 122, camelotKey: "9B", musicalKey: "G# Major", energy: 5, danceability: 68, popularity: 64, mood: "Warm", vocal: true, explicit: false, artworkColors: [PURPLE, CYAN] },
  { id: "t3", title: "Solar Drift", artist: "Halcyon State", label: "Orbital Sound", genre: "Progressive House", subgenre: "Melodic", releaseYear: 2025, durationSec: 355, bpm: 124, camelotKey: "8A", musicalKey: "A Minor", energy: 6, danceability: 71, popularity: 77, mood: "Euphoric", vocal: false, explicit: false, artworkColors: [CYAN, PURPLE] },
  { id: "t4", title: "Concrete Bloom", artist: "Vessel & Kade", label: "Subgrid", genre: "Tech House", subgenre: "Groove", releaseYear: 2023, durationSec: 340, bpm: 126, camelotKey: "9A", musicalKey: "E Minor", energy: 8, danceability: 85, popularity: 71, mood: "Driving", vocal: false, explicit: false, artworkColors: [PURPLE, CYAN] },
  { id: "t5", title: "Night Frequencies", artist: "Marlowe", label: "Voltage Deep", genre: "Melodic Techno", subgenre: "Dark", releaseYear: 2025, durationSec: 388, bpm: 125, camelotKey: "7A", musicalKey: "D Minor", energy: 8, danceability: 76, popularity: 88, mood: "Hypnotic", vocal: false, explicit: false, artworkColors: [CYAN, PURPLE] },
  { id: "t6", title: "Golden Hour", artist: "Isla Winters", label: "Afterglow Records", genre: "Deep House", subgenre: "Vocal", releaseYear: 2024, durationSec: 322, bpm: 121, camelotKey: "8B", musicalKey: "C# Major", energy: 4, danceability: 65, popularity: 90, mood: "Warm", vocal: true, explicit: false, artworkColors: [PURPLE, CYAN] },
  { id: "t7", title: "Static Bloom", artist: "Rune Collective", label: "Subgrid", genre: "Techno", subgenre: "Peak Time", releaseYear: 2025, durationSec: 365, bpm: 132, camelotKey: "6A", musicalKey: "B Minor", energy: 9, danceability: 80, popularity: 69, mood: "Intense", vocal: false, explicit: false, artworkColors: [CYAN, PURPLE] },
  { id: "t8", title: "Afterimage", artist: "Nova Reyes", label: "Orbital Sound", genre: "Progressive House", subgenre: "Melodic", releaseYear: 2023, durationSec: 349, bpm: 123, camelotKey: "8A", musicalKey: "A Minor", energy: 6, danceability: 70, popularity: 58, mood: "Euphoric", vocal: false, explicit: false, artworkColors: [PURPLE, CYAN] },
  { id: "t9", title: "Velvet Static", artist: "Halcyon State", label: "Deep Roots", genre: "Deep House", subgenre: "Organic", releaseYear: 2025, durationSec: 410, bpm: 122, camelotKey: "9B", musicalKey: "G# Major", energy: 5, danceability: 69, popularity: 61, mood: "Warm", vocal: true, explicit: false, artworkColors: [CYAN, PURPLE] },
  { id: "t10", title: "Fracture Point", artist: "Vessel & Kade", label: "Voltage Deep", genre: "Techno", subgenre: "Driving", releaseYear: 2024, durationSec: 358, bpm: 128, camelotKey: "10A", musicalKey: "F# Minor", energy: 9, danceability: 82, popularity: 74, mood: "Intense", vocal: false, explicit: false, artworkColors: [PURPLE, CYAN] },
  { id: "t11", title: "Amber Light", artist: "Isla Winters", label: "Afterglow Records", genre: "Melodic House", subgenre: "Emotive", releaseYear: 2025, durationSec: 337, bpm: 120, camelotKey: "1B", musicalKey: "F Major", energy: 4, danceability: 62, popularity: 79, mood: "Reflective", vocal: true, explicit: false, artworkColors: [CYAN, PURPLE] },
  { id: "t12", title: "Basement Signal", artist: "Rune Collective", label: "Subgrid", genre: "Tech House", subgenre: "Groove", releaseYear: 2022, durationSec: 331, bpm: 126, camelotKey: "9A", musicalKey: "E Minor", energy: 7, danceability: 83, popularity: 66, mood: "Driving", vocal: false, explicit: true, artworkColors: [PURPLE, CYAN] },
  { id: "t13", title: "Northbound", artist: "Marlowe", label: "Orbital Sound", genre: "Melodic Techno", subgenre: "Progressive", releaseYear: 2025, durationSec: 376, bpm: 124, camelotKey: "8B", musicalKey: "C# Major", energy: 7, danceability: 73, popularity: 85, mood: "Uplifting", vocal: false, explicit: false, artworkColors: [CYAN, PURPLE] },
  { id: "t14", title: "Wax & Wire", artist: "Ferro & Kessel", label: "Voltage Deep", genre: "Techno", subgenre: "Peak Time", releaseYear: 2024, durationSec: 349, bpm: 130, camelotKey: "6A", musicalKey: "B Minor", energy: 9, danceability: 79, popularity: 60, mood: "Intense", vocal: false, explicit: false, artworkColors: [PURPLE, CYAN] },
  { id: "t15", title: "Coastline", artist: "Vessel & Kade", label: "Deep Roots", genre: "Deep House", subgenre: "Organic", releaseYear: 2023, durationSec: 395, bpm: 121, camelotKey: "9B", musicalKey: "G# Major", energy: 5, danceability: 67, popularity: 72, mood: "Warm", vocal: true, explicit: false, artworkColors: [CYAN, PURPLE] },
  { id: "t16", title: "Chrome Horizon", artist: "Halcyon State", label: "Subgrid", genre: "Progressive House", subgenre: "Melodic", releaseYear: 2025, durationSec: 361, bpm: 125, camelotKey: "7A", musicalKey: "D Minor", energy: 6, danceability: 72, popularity: 68, mood: "Euphoric", vocal: false, explicit: false, artworkColors: [PURPLE, CYAN] },
];

export const GENRES = Array.from(new Set(MOCK_TRACKS.map((t) => t.genre))).sort();
export const LABELS = Array.from(new Set(MOCK_TRACKS.map((t) => t.label))).sort();
export const CAMELOT_KEYS = [
  "1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B", "5A", "5B", "6A", "6B",
  "7A", "7B", "8A", "8B", "9A", "9B", "10A", "10B", "11A", "11B", "12A", "12B",
];

export const TRENDING_TRACKS = [MOCK_TRACKS[4], MOCK_TRACKS[12], MOCK_TRACKS[0], MOCK_TRACKS[9]];
export const POPULAR_SEARCHES = [
  "Melodic Techno", "124 BPM", "8B", "Deep House", "Peak Time", "Afterglow Records",
];

export function searchTracks(query: string): Track[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return MOCK_TRACKS.filter((t) =>
    [t.title, t.artist, t.genre, t.subgenre, t.label, t.camelotKey, t.musicalKey, String(t.bpm)]
      .join(" ")
      .toLowerCase()
      .includes(q),
  );
}

export function getTrackById(id: string): Track | undefined {
  return MOCK_TRACKS.find((t) => t.id === id);
}

export function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
