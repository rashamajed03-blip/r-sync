import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Music2 } from "lucide-react";
import { formatDuration, MOCK_TRACKS } from "@/lib/mock-data";
import { getTrackByIdAsync, getAllTracks } from "@/lib/data/tracks";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TrackResultCard } from "@/components/search/TrackResultCard";
import { TrackActionBar } from "@/components/track/TrackActionBar";

export async function generateStaticParams() {
  // Falls back to the mock ID list if DATABASE_URL isn't available at build time.
  const tracks = process.env.DATABASE_URL ? await getAllTracks() : MOCK_TRACKS;
  return tracks.map((t) => ({ id: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const track = await getTrackByIdAsync(id);
  if (!track) return { title: "Track not found" };

  const title = `${track.title} — ${track.artist}`;
  const description = `${track.camelotKey} · ${track.bpm} BPM · ${track.genre}. Find harmonically compatible transitions for "${track.title}" on R-SYNC.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "music.song" },
    twitter: { card: "summary", title, description },
  };
}

export default async function TrackDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const track = await getTrackByIdAsync(id);
  if (!track) notFound();

  const allTracks = await getAllTracks();
  const [c1, c2] = track.artworkColors;
  const related = allTracks
    .filter((t) => t.id !== track.id && (t.genre === track.genre || t.camelotKey === track.camelotKey))
    .slice(0, 3);

  const stats: { label: string; value: string }[] = [
    { label: "Label", value: track.label },
    { label: "Genre", value: track.genre },
    { label: "Subgenre", value: track.subgenre },
    { label: "Release year", value: String(track.releaseYear) },
    { label: "Duration", value: formatDuration(track.durationSec) },
    { label: "Musical key", value: track.musicalKey },
    { label: "Mood", value: track.mood },
    { label: "Vocal", value: track.vocal ? "Yes" : "Instrumental" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    name: track.title,
    byArtist: { "@type": "MusicGroup", name: track.artist },
    duration: `PT${Math.floor(track.durationSec / 60)}M${track.durationSec % 60}S`,
    genre: track.genre,
    datePublished: String(track.releaseYear),
    recordLabel: track.label,
  };

  return (
    <main className="min-h-screen pb-24 pt-10">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[280px_1fr]">
          {/* Artwork */}
          <div
            className="flex aspect-square w-full items-center justify-center rounded-3xl border border-border shadow-glow"
            style={{ background: `linear-gradient(135deg, ${c1}26, ${c2}26)` }}
          >
            <Music2 className="h-16 w-16 text-foreground/30" />
          </div>

          {/* Header info */}
          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="cyan">{track.camelotKey}</Badge>
              <Badge variant="purple">{track.bpm} BPM</Badge>
              <Badge>{track.genre}</Badge>
              {track.explicit && <Badge variant="warning">Explicit</Badge>}
            </div>
            <h1 className="mt-4 text-balance font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              {track.title}
            </h1>
            <p className="mt-2 text-lg text-muted">{track.artist}</p>

            <div className="mt-6">
              <TrackActionBar track={track} />
            </div>
          </div>
        </div>

        {/* Waveform placeholder */}
        <Card className="mt-12 flex h-24 items-center gap-[3px] overflow-hidden px-6">
          {Array.from({ length: 80 }).map((_, i) => (
            <span
              key={i}
              className="w-full shrink-0 rounded-full bg-gradient-to-t from-cyan/50 to-purple/50"
              style={{ height: `${18 + Math.abs(Math.sin(i * 0.5)) * 60}%` }}
            />
          ))}
        </Card>

        {/* Stat grid */}
        <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-surface p-5">
              <p className="font-mono text-[11px] uppercase tracking-wide text-muted-2">
                {s.label}
              </p>
              <p className="mt-1 truncate text-sm font-medium">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Energy / danceability / popularity meters */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Meter label="Energy" value={track.energy * 10} accent="cyan" />
          <Meter label="Danceability" value={track.danceability} accent="purple" />
          <Meter label="Popularity" value={track.popularity} accent="cyan" />
        </div>

        {/* Related tracks */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-xl font-semibold">
              More from {track.genre}
              {track.camelotKey ? ` in ${track.camelotKey}` : ""}
            </h2>
            <div className="mt-5 space-y-3">
              {related.map((t) => (
                <TrackResultCard key={t.id} track={t} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function Meter({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: "cyan" | "purple";
}) {
  return (
    <Card className="p-5">
      <div className="flex items-baseline justify-between">
        <p className="text-sm text-muted">{label}</p>
        <p className={`font-mono text-sm ${accent === "cyan" ? "text-cyan" : "text-purple"}`}>
          {value}
          <span className="text-muted-2">/100</span>
        </p>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div
          className={`h-full rounded-full ${accent === "cyan" ? "bg-cyan" : "bg-purple"}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </Card>
  );
}
