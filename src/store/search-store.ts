import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SearchStore {
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

export const useSearchStore = create<SearchStore>()(
  persist(
    (set, get) => ({
      recentSearches: [],
      addRecentSearch: (query) => {
        const trimmed = query.trim();
        if (!trimmed) return;
        const existing = get().recentSearches.filter(
          (q) => q.toLowerCase() !== trimmed.toLowerCase(),
        );
        set({ recentSearches: [trimmed, ...existing].slice(0, 6) });
      },
      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    { name: "rsync-recent-searches" },
  ),
);
