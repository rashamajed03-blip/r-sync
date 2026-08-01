import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ImportedTrack } from "@/lib/rekordbox-import";

interface LibraryStore {
  tracks: ImportedTrack[];
  fileName: string | null;
  importedAt: string | null;
  setLibrary: (tracks: ImportedTrack[], fileName: string) => void;
  clearLibrary: () => void;
}

export const useLibraryStore = create<LibraryStore>()(
  persist(
    (set) => ({
      tracks: [],
      fileName: null,
      importedAt: null,
      setLibrary: (tracks, fileName) =>
        set({ tracks, fileName, importedAt: new Date().toISOString() }),
      clearLibrary: () => set({ tracks: [], fileName: null, importedAt: null }),
    }),
    { name: "rsync-library" },
  ),
);

/** Set of "title|artist" keys (lowercase) for fast "does the user own this?" lookups. */
export function ownedTrackKey(title: string, artist: string): string {
  return `${title.toLowerCase()}|${artist.toLowerCase()}`;
}
