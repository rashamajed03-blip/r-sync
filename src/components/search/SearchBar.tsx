"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Clock, TrendingUp, X, Music2 } from "lucide-react";
import { useSearchStore } from "@/store/search-store";
import { searchTracks, TRENDING_TRACKS, POPULAR_SEARCHES, formatDuration } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

export function SearchBar({
  initialQuery = "",
  onSearch,
  autoFocus = false,
}: {
  initialQuery?: string;
  onSearch: (query: string) => void;
  autoFocus?: boolean;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { recentSearches, addRecentSearch, clearRecentSearches } = useSearchStore();

  const suggestions = query.trim() ? searchTracks(query).slice(0, 5) : [];

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function submit(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    addRecentSearch(trimmed);
    setQuery(trimmed);
    setOpen(false);
    onSearch(trimmed);
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="glass flex items-center gap-3 rounded-2xl p-2 pl-5 shadow-glow">
        <Search className="h-5 w-5 shrink-0 text-muted" />
        <input
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => e.key === "Enter" && submit(query)}
          type="text"
          placeholder="Search by track, artist, genre, BPM, or Camelot key..."
          className="h-11 w-full bg-transparent text-sm text-foreground placeholder:text-muted-2 focus:outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="text-muted hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <button onClick={() => submit(query)} className="btn-primary h-11 shrink-0 px-5 text-sm">
          Search
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="glass absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-surface-raised/95 p-2 shadow-glow"
          >
            {suggestions.length > 0 ? (
              <div className="p-2">
                <p className="mb-1 px-2 font-mono text-[11px] uppercase tracking-wide text-muted-2">
                  Matching tracks
                </p>
                {suggestions.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => router.push(`/track/${t.id}`)}
                    className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-white/5"
                  >
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md"
                      style={{
                        background: `linear-gradient(135deg, ${t.artworkColors[0]}33, ${t.artworkColors[1]}33)`,
                      }}
                    >
                      <Music2 className="h-4 w-4 text-foreground/40" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{t.title}</p>
                      <p className="truncate text-xs text-muted">{t.artist}</p>
                    </div>
                    <Badge variant="cyan">{t.camelotKey}</Badge>
                    <Badge variant="purple">{t.bpm}</Badge>
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 p-3 sm:grid-cols-2">
                <div>
                  <div className="mb-2 flex items-center justify-between px-1">
                    <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-muted-2">
                      <Clock className="h-3 w-3" /> Recent
                    </p>
                    {recentSearches.length > 0 && (
                      <button
                        onClick={clearRecentSearches}
                        className="text-[11px] text-muted hover:text-foreground"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  {recentSearches.length > 0 ? (
                    <div className="space-y-0.5">
                      {recentSearches.map((q) => (
                        <button
                          key={q}
                          onClick={() => submit(q)}
                          className="block w-full truncate rounded-lg px-2 py-1.5 text-left text-sm text-foreground/90 hover:bg-white/5"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="px-2 text-xs text-muted-2">No recent searches yet</p>
                  )}
                </div>

                <div>
                  <p className="mb-2 flex items-center gap-1.5 px-1 font-mono text-[11px] uppercase tracking-wide text-muted-2">
                    <TrendingUp className="h-3 w-3" /> Trending
                  </p>
                  <div className="space-y-0.5">
                    {TRENDING_TRACKS.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => router.push(`/track/${t.id}`)}
                        className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-white/5"
                      >
                        <span className="truncate text-sm">{t.title}</span>
                        <span className="shrink-0 font-mono text-[11px] text-muted">
                          {formatDuration(t.durationSec)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <p className="mb-2 px-1 font-mono text-[11px] uppercase tracking-wide text-muted-2">
                    Popular searches
                  </p>
                  <div className="flex flex-wrap gap-2 px-1">
                    {POPULAR_SEARCHES.map((s) => (
                      <button
                        key={s}
                        onClick={() => submit(s)}
                        className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted transition-colors hover:border-cyan/30 hover:text-foreground"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
