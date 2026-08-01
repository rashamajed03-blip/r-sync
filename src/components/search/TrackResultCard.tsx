"use client";

import Link from "next/link";
import { Play, Music2, Clock, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddTrackMenu } from "@/components/track/AddTrackMenu";
import type { Track } from "@/lib/mock-data";
import { formatDuration } from "@/lib/mock-data";

export function TrackResultCard({ track }: { track: Track }) {
  const [c1, c2] = track.artworkColors;

  return (
    <Card className="group flex items-center gap-4 p-4 transition-colors hover:border-white/15">
      <Link href={`/track/${track.id}`} className="contents">
        <div
          className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl"
          style={{ background: `linear-gradient(135deg, ${c1}33, ${c2}33)` }}
        >
          <Music2 className="h-5 w-5 text-foreground/40" />
          <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100">
            <Play className="h-5 w-5 fill-foreground text-foreground" />
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <h4 className="truncate font-display text-[15px] font-semibold">{track.title}</h4>
            <span className="shrink-0 text-xs text-muted-2">{track.releaseYear}</span>
          </div>
          <p className="truncate text-sm text-muted">
            {track.artist} · {track.label}
          </p>
        </div>

        <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
          <Badge variant="cyan">{track.camelotKey}</Badge>
          <Badge variant="purple">{track.bpm} BPM</Badge>
          <Badge>{track.genre}</Badge>
        </div>

        <div className="hidden shrink-0 items-center gap-1 text-xs text-muted-2 md:flex">
          <Clock className="h-3.5 w-3.5" />
          {formatDuration(track.durationSec)}
        </div>
      </Link>

      <AddTrackMenu
        track={{
          id: track.id,
          title: track.title,
          artist: track.artist,
          genre: track.genre,
          bpm: track.bpm,
          camelotKey: track.camelotKey,
          energy: track.energy,
          artworkColors: track.artworkColors,
        }}
        trigger={
          <Button size="icon" variant="ghost" className="shrink-0" aria-label="Add track">
            <Plus className="h-4 w-4" />
          </Button>
        }
      />
    </Card>
  );
}
