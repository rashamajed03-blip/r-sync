"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, GripVertical, Music2, X, Route } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCratesStore } from "@/store/crates-store";
import { useSetPlannerStore } from "@/store/set-planner-store";
import type { TrackRef } from "@/lib/track-ref";

export default function CrateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { crates, renameCrate, removeTrackFromCrate, reorderCrateTracks } = useCratesStore();
  const addToSet = useSetPlannerStore((s) => s.addTrack);
  const crate = crates.find((c) => c.id === id);

  const [dragIndex, setDragIndex] = useState<number | null>(null);

  if (!crate) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <p className="text-muted">This crate doesn't exist — it may have been deleted.</p>
          <Link href="/crates">
            <Button variant="secondary" className="mt-4">
              Back to crates
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) return;
    const next = [...crate!.tracks];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(targetIndex, 0, moved);
    reorderCrateTracks(crate!.id, next);
    setDragIndex(null);
  }

  return (
    <main className="min-h-screen px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <Link href="/crates" className="flex items-center gap-2 text-sm text-muted hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          All crates
        </Link>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <Input
            defaultValue={crate.name}
            onBlur={(e) => renameCrate(crate.id, e.target.value)}
            className="max-w-xs border-none bg-transparent px-0 font-display text-2xl font-semibold focus-visible:ring-0"
          />
          <Button
            variant="outline"
            size="sm"
            disabled={crate.tracks.length === 0}
            onClick={() => {
              crate.tracks.forEach((t) => addToSet(t));
              router.push("/planner");
            }}
          >
            <Route className="h-3.5 w-3.5" />
            Send to set planner
          </Button>
        </div>
        <p className="mt-1 text-sm text-muted">
          {crate.tracks.length} {crate.tracks.length === 1 ? "track" : "tracks"} — drag to
          reorder
        </p>

        <div className="mt-6 space-y-2">
          {crate.tracks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center">
              <p className="text-sm text-muted">
                No tracks yet — add some from{" "}
                <Link href="/search" className="text-cyan hover:underline">
                  search
                </Link>{" "}
                or{" "}
                <Link href="/recommendations" className="text-cyan hover:underline">
                  recommendations
                </Link>
                .
              </p>
            </div>
          ) : (
            crate.tracks.map((t, i) => (
              <CrateRow
                key={t.id}
                track={t}
                index={i}
                onDragStart={() => setDragIndex(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(i)}
                onRemove={() => removeTrackFromCrate(crate.id, t.id)}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}

function CrateRow({
  track,
  onDragStart,
  onDragOver,
  onDrop,
  onRemove,
}: {
  track: TrackRef;
  index: number;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  onRemove: () => void;
}) {
  const [c1, c2] = track.artworkColors;
  return (
    <Card
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="flex cursor-grab items-center gap-3 p-3 active:cursor-grabbing"
    >
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
      </div>
      <button
        onClick={onRemove}
        className="shrink-0 text-muted-2 hover:text-red-400"
        aria-label={`Remove ${track.title}`}
      >
        <X className="h-4 w-4" />
      </button>
    </Card>
  );
}
