"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, GripVertical, Music2, Plus, Route, Trash2, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSetPlannerStore } from "@/store/set-planner-store";
import { getSetWarnings, suggestBridgeTrack } from "@/lib/set-planner-engine";
import type { TrackRef } from "@/lib/track-ref";

export default function SetPlannerPage() {
  const { tracks, removeTrack, reorder, addTrack, clear } = useSetPlannerStore();
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const warnings = useMemo(() => getSetWarnings(tracks), [tracks]);
  const totalDuration = tracks.length * 4; // rough placeholder: ~4 min avg per track for the timeline width

  function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) return;
    const next = [...tracks];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(targetIndex, 0, moved);
    reorder(next);
    setDragIndex(null);
  }

  function insertBridge(afterIndex: number, bridge: TrackRef) {
    const next = [...tracks];
    next.splice(afterIndex + 1, 0, bridge);
    reorder(next);
  }

  if (tracks.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="mx-auto max-w-sm text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface text-muted">
            <Route className="h-5 w-5" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold">No set yet</h1>
          <p className="mt-2 text-sm text-muted">
            Add tracks from search, recommendations, or a crate — use the "Add to set
            planner" option on any track.
          </p>
          <Link href="/search">
            <Button className="mt-6">Find tracks</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="eyebrow">Set planner</span>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
              {tracks.length} tracks · ~{totalDuration} min
            </h1>
          </div>
          <Button variant="ghost" size="sm" onClick={clear}>
            <Trash2 className="h-3.5 w-3.5" />
            Clear set
          </Button>
        </div>

        {/* Energy curve */}
        <Card className="mt-6 p-6">
          <h3 className="font-display text-sm font-semibold">Energy curve</h3>
          <EnergyCurve tracks={tracks} />
        </Card>

        {/* Camelot + BPM progression */}
        <Card className="mt-4 overflow-x-auto p-6">
          <h3 className="font-display text-sm font-semibold">Key & BPM progression</h3>
          <div className="mt-4 flex items-center gap-1">
            {tracks.map((t, i) => (
              <div key={t.id} className="flex items-center gap-1">
                <div className="flex flex-col items-center gap-1">
                  <Badge variant="cyan">{t.camelotKey ?? "?"}</Badge>
                  <span className="font-mono text-[10px] text-muted-2">{t.bpm ?? "—"}</span>
                </div>
                {i < tracks.length - 1 && (
                  <span
                    className={
                      warnings.some((w) => w.fromIndex === i) ? "text-amber-400" : "text-muted-2"
                    }
                  >
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="mt-4 space-y-2">
            {warnings.map((w) => {
              const bridge = suggestBridgeTrack(
                tracks[w.fromIndex],
                tracks[w.fromIndex + 1],
                tracks.map((t) => t.id),
              );
              return (
                <Card
                  key={w.fromIndex}
                  className="flex flex-wrap items-center justify-between gap-3 border-amber-500/25 bg-amber-500/5 p-4"
                >
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                    <div>
                      <p className="text-sm font-medium">
                        Track {w.fromIndex + 1} → {w.fromIndex + 2}
                      </p>
                      <ul className="mt-1 space-y-0.5">
                        {w.issues.map((issue) => (
                          <li key={issue} className="text-xs text-muted">
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {bridge && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => insertBridge(w.fromIndex, bridge)}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Insert "{bridge.title}" to fix it
                    </Button>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {/* Track list / timeline */}
        <div className="mt-6 space-y-2">
          {tracks.map((t, i) => (
            <SetRow
              key={t.id}
              track={t}
              position={i + 1}
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(i)}
              onRemove={() => removeTrack(t.id)}
              hasWarningAfter={warnings.some((w) => w.fromIndex === i)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

function EnergyCurve({ tracks }: { tracks: TrackRef[] }) {
  const width = 600;
  const height = 80;
  const step = tracks.length > 1 ? width / (tracks.length - 1) : 0;
  const points = tracks
    .map((t, i) => `${i * step},${height - (t.energy / 10) * height}`)
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="mt-4 h-20 w-full" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke="#22D3EE"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {tracks.map((t, i) => (
        <circle
          key={t.id}
          cx={i * step}
          cy={height - (t.energy / 10) * height}
          r="3"
          fill="#09090B"
          stroke="#22D3EE"
          strokeWidth="2"
        />
      ))}
    </svg>
  );
}

function SetRow({
  track,
  position,
  onDragStart,
  onDragOver,
  onDrop,
  onRemove,
  hasWarningAfter,
}: {
  track: TrackRef;
  position: number;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  onRemove: () => void;
  hasWarningAfter: boolean;
}) {
  const [c1, c2] = track.artworkColors;
  return (
    <>
      <Card
        draggable
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className="flex cursor-grab items-center gap-3 p-3 active:cursor-grabbing"
      >
        <span className="w-5 shrink-0 text-center font-mono text-xs text-muted-2">{position}</span>
        <GripVertical className="h-4 w-4 shrink-0 text-muted-2" />
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
          style={{ background: `linear-gradient(135deg, ${c1}33, ${c2}33)` }}
        >
          <Music2 className="h-4 w-4 text-foreground/40" />
        </div>
        <div className="min-w-0 flex-1">
          <Link href={`/track/${track.id}`} className="truncate text-sm font-medium hover:text-cyan">
            {track.title}
          </Link>
          <p className="truncate text-xs text-muted">{track.artist}</p>
        </div>
        <div className="hidden shrink-0 gap-1.5 sm:flex">
          {track.camelotKey && <Badge variant="cyan">{track.camelotKey}</Badge>}
          {track.bpm && <Badge variant="purple">{track.bpm}</Badge>}
          <Badge variant="outline">E{track.energy}</Badge>
        </div>
        <button
          onClick={onRemove}
          className="shrink-0 text-muted-2 hover:text-red-400"
          aria-label={`Remove ${track.title}`}
        >
          <X className="h-4 w-4" />
        </button>
      </Card>
      {hasWarningAfter && (
        <div className="flex items-center gap-2 pl-4 text-xs text-amber-400">
          <AlertTriangle className="h-3 w-3" />
          Rough transition below
        </div>
      )}
    </>
  );
}
