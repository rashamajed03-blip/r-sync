import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TrackRef } from "@/lib/track-ref";

interface SetPlannerStore {
  tracks: TrackRef[];
  addTrack: (track: TrackRef) => void;
  removeTrack: (trackId: string) => void;
  reorder: (tracks: TrackRef[]) => void;
  clear: () => void;
}

export const useSetPlannerStore = create<SetPlannerStore>()(
  persist(
    (set, get) => ({
      tracks: [],
      addTrack: (track) => {
        if (get().tracks.some((t) => t.id === track.id)) return;
        set({ tracks: [...get().tracks, track] });
      },
      removeTrack: (trackId) => set({ tracks: get().tracks.filter((t) => t.id !== trackId) }),
      reorder: (tracks) => set({ tracks }),
      clear: () => set({ tracks: [] }),
    }),
    { name: "rsync-set-planner" },
  ),
);
