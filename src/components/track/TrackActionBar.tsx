"use client";

import Link from "next/link";
import { Play, Heart, Share2, Sparkles, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddTrackMenu } from "@/components/track/AddTrackMenu";
import type { Track } from "@/lib/mock-data";

export function TrackActionBar({ track }: { track: Track }) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <Button size="lg">
        <Play className="h-4 w-4 fill-background" />
        Preview
      </Button>
      <Link href={`/recommendations?from=${track.id}`}>
        <Button size="lg" variant="outline">
          <Sparkles className="h-4 w-4" />
          Find transitions
        </Button>
      </Link>
      <Button size="icon" variant="ghost" aria-label="Save to favorites">
        <Heart className="h-4 w-4" />
      </Button>
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
          <Button size="icon" variant="ghost" aria-label="Add track">
            <Plus className="h-4 w-4" />
          </Button>
        }
      />
      <Button size="icon" variant="ghost" aria-label="Share">
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
