"use client";

import { Music2, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ImportedTrack } from "@/lib/rekordbox-import";

function formatDuration(sec: number | null): string {
  if (!sec) return "—";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function LibraryTrackRow({ track }: { track: ImportedTrack }) {
  return (
    <Card className="flex items-center gap-4 p-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-surface-raised">
        <Music2 className="h-4 w-4 text-foreground/40" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{track.title}</p>
        <p className="truncate text-xs text-muted">
          {track.artist} · {track.label}
        </p>
      </div>

      <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
        {track.camelotKey ? (
          <Badge variant="cyan">{track.camelotKey}</Badge>
        ) : (
          <Badge variant="outline">No key</Badge>
        )}
        {track.bpm && <Badge variant="purple">{track.bpm} BPM</Badge>}
        <Badge>{track.genre}</Badge>
      </div>

      <div className="hidden shrink-0 items-center gap-1 text-xs text-muted-2 md:flex">
        <Clock className="h-3.5 w-3.5" />
        {formatDuration(track.durationSec)}
      </div>
    </Card>
  );
}
