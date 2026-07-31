"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  ListMusic,
  Route,
  Library,
  Search,
  Sparkles,
  ArrowRight,
  Clock,
  Upload,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCratesStore } from "@/store/crates-store";
import { useSetPlannerStore } from "@/store/set-planner-store";
import { useLibraryStore } from "@/store/library-store";
import { useSearchStore } from "@/store/search-store";
import { computeLibraryStats } from "@/lib/rekordbox-import";
import { useMemo } from "react";

export default function DashboardPage() {
  const { user } = useUser();
  const crates = useCratesStore((s) => s.crates);
  const setTracks = useSetPlannerStore((s) => s.tracks);
  const libraryTracks = useLibraryStore((s) => s.tracks);
  const recentSearches = useSearchStore((s) => s.recentSearches);

  const stats = useMemo(() => computeLibraryStats(libraryTracks), [libraryTracks]);
  const hasLibrary = libraryTracks.length > 0;

  return (
    <main className="min-h-screen px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Welcome back{user?.firstName ? `, ${user.firstName}` : ""}.
        </h1>
        <p className="mt-1 text-sm text-muted">Here's where things stand tonight.</p>

        {/* Top stat row */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard icon={Library} label="Library tracks" value={libraryTracks.length} href="/library" />
          <StatCard icon={ListMusic} label="Crates" value={crates.length} href="/crates" />
          <StatCard icon={Route} label="Set planner" value={setTracks.length} href="/planner" />
          <StatCard icon={Clock} label="Recent searches" value={recentSearches.length} href="/search" />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Favorite genres / keys / BPM */}
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-semibold">Your sound</h3>
              {!hasLibrary && (
                <Link href="/import">
                  <Button variant="ghost" size="sm">
                    <Upload className="h-3.5 w-3.5" />
                    Import library
                  </Button>
                </Link>
              )}
            </div>

            {hasLibrary ? (
              <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-wide text-muted-2">
                    Favorite genre
                  </p>
                  <p className="mt-1 font-display text-lg font-semibold">
                    {stats.genreCounts[0]?.genre ?? "—"}
                  </p>
                  <p className="text-xs text-muted">
                    {stats.genreCounts[0]?.count ?? 0} tracks
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-wide text-muted-2">
                    Favorite key
                  </p>
                  <p className="mt-1 font-display text-lg font-semibold text-cyan">
                    {stats.keyCounts[0]?.key ?? "—"}
                  </p>
                  <p className="text-xs text-muted">{stats.keyCounts[0]?.count ?? 0} tracks</p>
                </div>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-wide text-muted-2">
                    BPM range
                  </p>
                  <p className="mt-1 font-display text-lg font-semibold text-purple">
                    {stats.bpmRange ? `${stats.bpmRange[0]}–${stats.bpmRange[1]}` : "—"}
                  </p>
                  <p className="text-xs text-muted">{stats.trackCount} tracks analyzed</p>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-border p-8 text-center">
                <p className="text-sm text-muted">
                  Import your Rekordbox library to see your favorite genres, keys, and BPM
                  range here.
                </p>
              </div>
            )}
          </Card>

          {/* Quick actions */}
          <Card className="p-6">
            <h3 className="font-display text-base font-semibold">Quick actions</h3>
            <div className="mt-4 space-y-2">
              <QuickAction href="/search" icon={Search} label="Search for a track" />
              <QuickAction href="/assistant" icon={Sparkles} label="Ask the AI Assistant" />
              <QuickAction href="/planner" icon={Route} label="Open set planner" />
            </div>
          </Card>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Recent searches */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-semibold">Recent searches</h3>
              <Link href="/search" className="text-xs text-cyan hover:underline">
                Search again
              </Link>
            </div>
            {recentSearches.length > 0 ? (
              <ul className="mt-4 space-y-1">
                {recentSearches.map((q) => (
                  <li key={q}>
                    <Link
                      href={`/search?q=${encodeURIComponent(q)}`}
                      className="block truncate rounded-lg px-2 py-1.5 text-sm text-foreground/90 hover:bg-white/5"
                    >
                      {q}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted-2">No searches yet.</p>
            )}
          </Card>

          {/* Saved crates */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-semibold">Saved crates</h3>
              <Link href="/crates" className="text-xs text-cyan hover:underline">
                View all
              </Link>
            </div>
            {crates.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {crates.slice(0, 5).map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/crates/${c.id}`}
                      className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-white/5"
                    >
                      <span className="truncate text-sm">{c.name}</span>
                      <Badge>{c.tracks.length}</Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted-2">
                No crates yet —{" "}
                <Link href="/crates" className="text-cyan hover:underline">
                  create your first one
                </Link>
                .
              </p>
            )}
          </Card>
        </div>

        {/* Recommendations CTA */}
        <Card className="mt-5 flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <p className="font-display text-base font-semibold">Ready to find your next transition?</p>
            <p className="mt-1 text-sm text-muted">
              Search a track and hit Find transitions, or describe a vibe to the AI Assistant.
            </p>
          </div>
          <Link href="/search">
            <Button>
              Start searching
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </Card>
      </div>
    </main>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="p-4 transition-colors hover:border-white/15">
        <Icon className="h-4 w-4 text-cyan" />
        <p className="mt-3 font-display text-2xl font-semibold">{value}</p>
        <p className="text-xs text-muted">{label}</p>
      </Card>
    </Link>
  );
}

function QuickAction({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-2.5 text-sm transition-colors hover:border-cyan/30"
    >
      <Icon className="h-4 w-4 text-cyan" />
      {label}
    </Link>
  );
}
