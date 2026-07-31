"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Library, Upload, Trash2, ArrowRight } from "lucide-react";
import { useLibraryStore } from "@/store/library-store";
import { computeLibraryStats } from "@/lib/rekordbox-import";
import { LibraryTrackRow } from "@/components/import/LibraryTrackRow";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LibraryPage() {
  const { tracks, fileName, importedAt, clearLibrary } = useLibraryStore();
  const stats = useMemo(() => computeLibraryStats(tracks), [tracks]);

  if (tracks.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center pt-20">
        <div className="mx-auto max-w-sm text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface text-muted">
            <Library className="h-5 w-5" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold">No library yet</h1>
          <p className="mt-2 text-sm text-muted">
            Import your Rekordbox collection to see your genre, key, and BPM breakdown —
            and get recommendations prioritized from tracks you already own.
          </p>
          <Link href="/import">
            <Button className="mt-6">
              <Upload className="h-4 w-4" />
              Import Rekordbox XML
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const maxGenreCount = stats.genreCounts[0]?.count ?? 1;
  const maxBpmCount = Math.max(...stats.bpmBuckets.map((b) => b.count), 1);
  const maxKeyCount = Math.max(...stats.keyCounts.map((k) => k.count), 1);

  return (
    <main className="min-h-screen pb-24 pt-10">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">My library</span>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
              {stats.trackCount} tracks
            </h1>
            <p className="mt-1 text-sm text-muted">
              {fileName ? `Imported from ${fileName}` : "Imported"}
              {importedAt ? ` · ${new Date(importedAt).toLocaleDateString()}` : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/import">
              <Button variant="secondary" size="sm">
                <Upload className="h-3.5 w-3.5" />
                Re-import
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={clearLibrary}>
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </Button>
          </div>
        </div>

        {/* Summary stats */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Genres" value={stats.genreCounts.length} />
          <StatCard label="Camelot keys covered" value={`${stats.keysCovered}/24`} />
          <StatCard label="Compatible pairs" value={stats.compatibleTransitionPairs} />
          <StatCard
            label="BPM range"
            value={stats.bpmRange ? `${stats.bpmRange[0]}–${stats.bpmRange[1]}` : "—"}
          />
        </div>

        {/* Distributions */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="p-6">
            <h3 className="font-display text-sm font-semibold">Genres</h3>
            <div className="mt-4 space-y-2.5">
              {stats.genreCounts.slice(0, 6).map((g) => (
                <BarRow
                  key={g.genre}
                  label={g.genre}
                  count={g.count}
                  max={maxGenreCount}
                  accent="cyan"
                />
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-display text-sm font-semibold">Camelot key coverage</h3>
            <div className="mt-4 space-y-2.5">
              {stats.keyCounts.slice(0, 6).map((k) => (
                <BarRow key={k.key} label={k.key} count={k.count} max={maxKeyCount} accent="purple" />
              ))}
              {stats.keyCounts.length === 0 && (
                <p className="text-sm text-muted-2">
                  No key data found in this export — enable Tonality in Rekordbox's export
                  settings to see this.
                </p>
              )}
            </div>
          </Card>

          <Card className="p-6 lg:col-span-2">
            <h3 className="font-display text-sm font-semibold">BPM distribution</h3>
            <div className="mt-4 flex h-28 items-end gap-1.5">
              {stats.bpmBuckets.map((b) => (
                <div key={b.range} className="flex flex-1 flex-col items-center gap-1.5">
                  <div
                    className="w-full rounded-t-sm bg-cyan-purple"
                    style={{ height: `${Math.max(4, (b.count / maxBpmCount) * 96)}px` }}
                  />
                  <span className="font-mono text-[9px] text-muted-2">{b.range}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* CTA into recommendations */}
        <Card className="mt-6 flex items-center justify-between gap-4 p-5">
          <div>
            <p className="font-display text-sm font-semibold">
              Ready to find your next transition?
            </p>
            <p className="text-sm text-muted">
              Recommendations now prioritize tracks from your imported library.
            </p>
          </div>
          <Link href="/recommendations">
            <Button variant="outline" className="shrink-0">
              Get recommendations
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </Card>

        {/* Track list */}
        <div className="mt-10">
          <h2 className="font-display text-lg font-semibold">All tracks</h2>
          <div className="mt-4 space-y-2.5">
            {tracks.slice(0, 50).map((t) => (
              <LibraryTrackRow key={t.id} track={t} />
            ))}
          </div>
          {tracks.length > 50 && (
            <p className="mt-4 text-center text-sm text-muted-2">
              Showing 50 of {tracks.length} tracks.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="font-mono text-[11px] uppercase tracking-wide text-muted-2">{label}</p>
      <p className="mt-1 truncate font-display text-xl font-semibold">{value}</p>
    </div>
  );
}

function BarRow({
  label,
  count,
  max,
  accent,
}: {
  label: string;
  count: number;
  max: number;
  accent: "cyan" | "purple";
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 truncate text-xs text-muted">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
        <div
          className={`h-full rounded-full ${accent === "cyan" ? "bg-cyan" : "bg-purple"}`}
          style={{ width: `${(count / max) * 100}%` }}
        />
      </div>
      <span className="w-6 shrink-0 text-right font-mono text-xs text-muted-2">{count}</span>
    </div>
  );
}
