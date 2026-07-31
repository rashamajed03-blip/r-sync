"use client";

import { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { SlidersHorizontal, SearchX } from "lucide-react";
import { SearchBar } from "@/components/search/SearchBar";
import { FiltersSidebar, DEFAULT_FILTERS, type Filters } from "@/components/search/FiltersSidebar";
import { TrackResultCard } from "@/components/search/TrackResultCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { type Track } from "@/lib/mock-data";
import { getCompatibleKeys } from "@/lib/utils";

type SortKey = "relevance" | "energy" | "popularity" | "newest" | "oldest" | "bpm";

const SORT_LABELS: Record<SortKey, string> = {
  relevance: "Best Match",
  energy: "Energy",
  popularity: "Popularity",
  newest: "Newest",
  oldest: "Oldest",
  bpm: "BPM",
};

function applyFiltersAndSort(
  base: Track[],
  filters: Filters,
  sort: SortKey,
): Track[] {
  let results = base.filter((t) => {
    if (t.bpm < filters.bpmRange[0] || t.bpm > filters.bpmRange[1]) return false;
    if (t.energy < filters.energyRange[0] || t.energy > filters.energyRange[1]) return false;
    if (t.popularity < filters.minPopularity) return false;
    if (t.releaseYear < filters.yearFrom) return false;
    if (filters.genres.length > 0 && !filters.genres.includes(t.genre)) return false;
    if (filters.vocal && !t.vocal) return false;
    if (filters.instrumental && t.vocal) return false;
    if (filters.hideExplicit && t.explicit) return false;
    if (filters.keyMode === "same" && t.camelotKey !== filters.referenceKey) return false;
    if (
      filters.keyMode === "compatible" &&
      !getCompatibleKeys(filters.referenceKey).includes(t.camelotKey)
    )
      return false;
    return true;
  });

  results = [...results].sort((a, b) => {
    switch (sort) {
      case "energy":
        return b.energy - a.energy;
      case "popularity":
        return b.popularity - a.popularity;
      case "newest":
        return b.releaseYear - a.releaseYear;
      case "oldest":
        return a.releaseYear - b.releaseYear;
      case "bpm":
        return a.bpm - b.bpm;
      default:
        return b.popularity - a.popularity;
    }
  });

  return results;
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchPageInner />
    </Suspense>
  );
}

function SearchPageInner() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortKey>("relevance");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { data: rawResults, isFetching } = useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      const res = await fetch(`/api/tracks${query ? `?q=${encodeURIComponent(query)}` : ""}`);
      if (!res.ok) throw new Error("Search failed");
      const { tracks } = (await res.json()) as { tracks: Track[] };
      return tracks;
    },
  });

  const results = useMemo(
    () => applyFiltersAndSort(rawResults ?? [], filters, sort),
    [rawResults, filters, sort],
  );

  return (
    <main className="min-h-screen pb-24 pt-10">
      <div className="container mx-auto">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Search</span>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Find any track, instantly.
          </h1>
        </div>

        <div className="mx-auto mt-8 max-w-2xl">
          <SearchBar onSearch={setQuery} autoFocus initialQuery={initialQuery} />
        </div>

        <div className="mt-10 flex items-center justify-between lg:hidden">
          <Button variant="secondary" size="sm" onClick={() => setMobileFiltersOpen((v) => !v)}>
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
          </Button>
          <SortSelect value={sort} onChange={setSort} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:mt-10 lg:grid-cols-[280px_1fr]">
          <div className={mobileFiltersOpen ? "block" : "hidden lg:block"}>
            <FiltersSidebar filters={filters} onChange={setFilters} />
          </div>

          <div>
            <div className="mb-4 hidden items-center justify-between lg:flex">
              <p className="text-sm text-muted">
                {isFetching ? "Searching…" : `${results.length} tracks`}
              </p>
              <SortSelect value={sort} onChange={setSort} />
            </div>

            {isFetching ? (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4">
                    <Skeleton className="h-14 w-14 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                    <Skeleton className="hidden h-6 w-32 sm:block" />
                  </div>
                ))}
              </div>
            ) : results.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                {results.map((t) => (
                  <TrackResultCard key={t.id} track={t} />
                ))}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-24 text-center">
                <SearchX className="h-8 w-8 text-muted-2" />
                <p className="mt-4 font-display text-lg font-semibold">No tracks match yet</p>
                <p className="mt-1 max-w-xs text-sm text-muted">
                  Try a different search, or loosen a filter — BPM range and genre are the
                  most common culprits.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function SortSelect({ value, onChange }: { value: SortKey; onChange: (v: SortKey) => void }) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as SortKey)}>
      <SelectTrigger className="w-44">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
          <SelectItem key={key} value={key}>
            {SORT_LABELS[key]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
