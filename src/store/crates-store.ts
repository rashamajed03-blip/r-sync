import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TrackRef } from "@/lib/track-ref";

export interface Crate {
  id: string;
  name: string;
  createdAt: string;
  tracks: TrackRef[];
}

interface CratesStore {
  crates: Crate[];
  createCrate: (name: string) => Crate;
  deleteCrate: (id: string) => void;
  renameCrate: (id: string, name: string) => void;
  addTrackToCrate: (crateId: string, track: TrackRef) => void;
  removeTrackFromCrate: (crateId: string, trackId: string) => void;
  reorderCrateTracks: (crateId: string, tracks: TrackRef[]) => void;
}

export const useCratesStore = create<CratesStore>()(
  persist(
    (set, get) => ({
      crates: [],
      createCrate: (name) => {
        const crate: Crate = {
          id: crypto.randomUUID(),
          name: name.trim() || "Untitled crate",
          createdAt: new Date().toISOString(),
          tracks: [],
        };
        set({ crates: [crate, ...get().crates] });
        return crate;
      },
      deleteCrate: (id) => set({ crates: get().crates.filter((c) => c.id !== id) }),
      renameCrate: (id, name) =>
        set({
          crates: get().crates.map((c) => (c.id === id ? { ...c, name } : c)),
        }),
      addTrackToCrate: (crateId, track) =>
        set({
          crates: get().crates.map((c) =>
            c.id === crateId && !c.tracks.some((t) => t.id === track.id)
              ? { ...c, tracks: [...c.tracks, track] }
              : c,
          ),
        }),
      removeTrackFromCrate: (crateId, trackId) =>
        set({
          crates: get().crates.map((c) =>
            c.id === crateId ? { ...c, tracks: c.tracks.filter((t) => t.id !== trackId) } : c,
          ),
        }),
      reorderCrateTracks: (crateId, tracks) =>
        set({
          crates: get().crates.map((c) => (c.id === crateId ? { ...c, tracks } : c)),
        }),
    }),
    { name: "rsync-crates" },
  ),
);
