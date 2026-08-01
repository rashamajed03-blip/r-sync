"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Heart, Music2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MatchScore } from "./MatchScore";
import { AddTrackMenu } from "./AddTrackMenu";
import { cn } from "@/lib/utils";

export interface TrackCardData {
  id: string;
  title: string;
  artist: string;
  genre: string;
  subgenre?: string;
  bpm: number;
  camelotKey: string;
  energy: number; // 1–10
  popularity: number; // 1–100
  matchScore: number; // 0–100
  reasons: string[];
  artworkColor?: [string, string]; // gradient placeholder in lieu of real artwork
}

export function TrackCard({
  track,
  className,
}: {
  track: TrackCardData;
  className?: string;
}) {
  const [c1, c2] = track.artworkColor ?? ["#22D3EE", "#A855F7"];

  return (
    <Card
      className={cn(
        "group relative overflow-hidden p-4 transition-colors hover:border-white/15",
        className,
      )}
    >
      <div className="flex gap-4">
        {/* Artwork placeholder */}
        <Link
          href={`/track/${track.id}`}
          className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl"
          style={{ background: `linear-gradient(135deg, ${c1}33, ${c2}33)` }}
        >
          <Music2 className="h-6 w-6 text-foreground/40" />
          <span
            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100"
            aria-label={`Open ${track.title}`}
          >
            <Play className="h-6 w-6 fill-foreground text-foreground" />
          </span>
        </Link>

        {/* Metadata */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <Link href={`/track/${track.id}`} className="min-w-0">
              <h4 className="truncate font-display text-base font-semibold hover:text-cyan">
                {track.title}
              </h4>
              <p className="truncate text-sm text-muted">{track.artist}</p>
            </Link>
            <MatchScore score={track.matchScore} size={48} className="shrink-0" />
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            <Badge variant="cyan">{track.camelotKey}</Badge>
            <Badge variant="purple">{track.bpm} BPM</Badge>
            <Badge>{track.genre}</Badge>
            {track.subgenre && <Badge>{track.subgenre}</Badge>}
            <Badge variant="outline">Energy {track.energy}/10</Badge>
          </div>
        </div>
      </div>

      {/* Why it works */}
      {track.reasons.length > 0 && (
        <ul className="mt-4 space-y-1 border-t border-border pt-3">
          {track.reasons.map((reason) => (
            <li key={reason} className="flex items-center gap-2 text-xs text-muted">
              <span className="text-cyan">✓</span>
              {reason}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex items-center gap-2">
        <AddTrackMenu
          track={{
            id: track.id,
            title: track.title,
            artist: track.artist,
            genre: track.genre,
            bpm: track.bpm,
            camelotKey: track.camelotKey,
            energy: track.energy,
            artworkColors: [c1, c2],
          }}
        />
        <Button size="icon" variant="ghost" aria-label="Save to favorites">
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      <motion.div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20"
        style={{ background: c1 }}
      />
    </Card>
  );
}
