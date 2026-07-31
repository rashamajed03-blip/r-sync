"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Music2, Sparkles, X } from "lucide-react";
import { SearchBar } from "@/components/search/SearchBar";
import { TrackCard, type TrackCardData } from "@/components/track/TrackCard";
import { SortSelect } from "@/components/shared/SortSelect";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Track } from "@/lib/mock-data";
import { getRecommendations } from "@/lib/recommendation-engine";
import { useLibraryStore, ownedTrackKey } from "@/store/library-store";

type SortKey = "match" | "energy" | "popularity" | "newest" | "oldest" | "bpm";

const SORT_LABELS: Record<SortKey, string> = {
  match: "Best Match",
  energy: "Energy",
  popularity: "Popularity",
  newest: "Newest",
  oldest: "Oldest",
  bpm: "BPM",
};

export default function RecommendationsPage() {
  return (
    <Suspense fallback={null}>
      <RecommendationsInner />
    </Suspense>
  );
}

function RecommendationsInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromId = searchParams.get("from");
  const [sort, setSort] = useState<SortKey>("match");
  const libraryTracks = useLibraryStore((s) => s.tracks);

  const { data: pool, isLoading: poolLoading } = useQuery({
    queryKey: ["tracks", "all"],
    queryFn: async () => {
      const res = await fetch("/api/tracks");
      const { tracks } = (await res.json()) as { tracks: Track[] };
      return tracks;
    },
  });

  const { data: reference, isLoading: referenceLoading } = useQuery({
    queryKey: ["track", fromId],
    queryFn: async () => {
      const res = await fetch(`/api/tracks/${fromId}`);
      if (!res.ok) return null;
      const { track } = (await res.json()) as { track: Track };
      return track;
    },
    enabled: Boolean(fromId),
  });

  const ownedKeys = useMemo(
    () => new Set(libraryTracks.map((t) => ownedTrackKey(t.title, t.artist))),
    [libraryTracks],
  );

  const matches = useMemo(() => {
    if (!reference || !pool) return [];
    const results = getRecommendations(reference, pool, ownedKeys);
    const sorted = [...results].sort((a, b) => {
      switch (sort) {
        case "energy":
          return b.track.energy - a.track.energy;
        case "popularity":
          return b.track.popularity - a.track.popularity;
        case "newest":
          return b.track.releaseYear - a.track.releaseYear;
        case "oldest":
          return a.track.releaseYear - b.track.releaseYear;
        case "bpm":
          return a.track.bpm - b.track.bpm;
        default:
          return b.score - a.score;
      }
    });
    return sorted;
  }, [reference, pool, sort, ownedKeys]);

  const cards: TrackCardData[] = matches.map((m) => ({
    id: m.track.id,
    title: m.track.title,
    artist: m.track.artist,
    genre: m.track.genre,
    subgenre: m.track.subgenre,
    bpm: m.track.bpm,
    camelotKey: m.track.camelotKey,
    energy: m.track.energy,
    popularity: m.track.popularity,
    matchScore: m.score,
    reasons: m.reasons,
    artworkColor: m.track.artworkColors,
  }));

  return (
    <main className="min-h-screen pb-24 pt-10">
      <div className="container mx-auto max-w-5xl">
        <div className="mx-auto max-w-xl text-center">
          <span className="eyebrow flex items-center justify-center gap-2">
            <Sparkles className="h-3 w-3" />
            Recommendation engine
          </span>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {fromId ? "Find your perfect next transition." : "Pick a track to start."}
          </h1>
        </div>

        {fromId && referenceLoading ? (
          <div className="mx-auto mt-10 max-w-2xl space-y-4">
            <Skeleton className="h-20 rounded-2xl" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-2xl" />
              ))}
            </div>
          </div>
        ) : !reference ? (
          <div className="mx-auto mt-10 max-w-xl">
            <SearchBar onSearch={(q) => router.push(`/search?q=${encodeURIComponent(q)}`)} />
            <p className="mt-4 text-center text-sm text-muted">
              Search for a track, open its detail page, and hit{" "}
              <span className="text-foreground">Find transitions</span> — or jump straight in
              below. Prefer describing a vibe instead?{" "}
              <Link href="/assistant" className="text-cyan hover:underline">
                Try the AI Assistant
              </Link>
              .
            </p>
            <div className="mt-8 space-y-3">
              {poolLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 rounded-xl" />
                  ))
                : pool?.slice(0, 4).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => router.push(`/recommendations?from=${t.id}`)}
                      className="flex w-full items-center gap-3 rounded-xl border border-border bg-surface p-3 text-left transition-colors hover:border-cyan/30"
                    >
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                        style={{
                          background: `linear-gradient(135deg, ${t.artworkColors[0]}33, ${t.artworkColors[1]}33)`,
                        }}
                      >
                        <Music2 className="h-4 w-4 text-foreground/40" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{t.title}</p>
                        <p className="truncate text-xs text-muted">{t.artist}</p>
                      </div>
                      <Badge variant="cyan">{t.camelotKey}</Badge>
                    </button>
                  ))}
            </div>
          </div>
        ) : (
          <>
            {/* Reference track banner */}
            <Card className="mx-auto mt-10 flex max-w-2xl items-center gap-4 p-4">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
                style={{
                  background: `linear-gradient(135deg, ${reference.artworkColors[0]}33, ${reference.artworkColors[1]}33)`,
                }}
              >
                <Music2 className="h-5 w-5 text-foreground/40" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-2">Finding transitions for</p>
                <p className="truncate font-display font-semibold">{reference.title}</p>
                <p className="truncate text-sm text-muted">{reference.artist}</p>
              </div>
              <div className="hidden shrink-0 gap-1.5 sm:flex">
                <Badge variant="cyan">{reference.camelotKey}</Badge>
                <Badge variant="purple">{reference.bpm} BPM</Badge>
              </div>
              <Link href={`/track/${reference.id}`}>
                <Button variant="ghost" size="icon" aria-label="Change track">
                  <X className="h-4 w-4" />
                </Button>
              </Link>
            </Card>

            <div className="mt-10 flex items-center justify-between">
              <p className="text-sm text-muted">{matches.length} tracks ranked</p>
              <SortSelect value={sort} onChange={setSort} labels={SORT_LABELS} />
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {poolLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-40 rounded-2xl" />
                  ))
                : cards.map((c) => <TrackCard key={c.id} track={c} />)}
            </motion.div>
          </>
        )}
      </div>
    </main>
  );
}
