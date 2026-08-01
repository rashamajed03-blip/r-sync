import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProfileStore {
  bio: string;
  setBio: (bio: string) => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      bio: "",
      setBio: (bio) => set({ bio }),
    }),
    { name: "rsync-profile" },
  ),
);
