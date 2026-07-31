"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Library, ArrowRight } from "lucide-react";
import { Dropzone } from "@/components/import/Dropzone";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  parseRekordboxXML,
  estimateEnergy,
  computeLibraryStats,
  RekordboxParseError,
} from "@/lib/rekordbox-import";
import { useLibraryStore } from "@/store/library-store";

export default function ImportPage() {
  const router = useRouter();
  const setLibrary = useLibraryStore((s) => s.setLibrary);
  const [status, setStatus] = useState<"idle" | "parsing" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<ReturnType<typeof computeLibraryStats> | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setStatus("parsing");
    try {
      const text = await file.text();
      // Small artificial delay so the parsing state is visible for typical
      // (small) demo files — remove if importing very large real libraries.
      await new Promise((r) => setTimeout(r, 500));
      const rawTracks = parseRekordboxXML(text);
      const tracks = estimateEnergy(rawTracks);
      const stats = computeLibraryStats(tracks);

      setLibrary(tracks, file.name);
      setPreview(stats);
      setStatus("done");
    } catch (e) {
      setStatus("idle");
      setError(
        e instanceof RekordboxParseError
          ? e.message
          : "Something went wrong reading that file. Double-check it's an unmodified Rekordbox XML export.",
      );
    }
  }

  return (
    <main className="min-h-screen pb-24 pt-10">
      <div className="container mx-auto max-w-xl">
        <div className="text-center">
          <span className="eyebrow flex items-center justify-center gap-2">
            <Library className="h-3 w-3" />
            Rekordbox import
          </span>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Bring in your library.
          </h1>
          <p className="mt-2 text-sm text-muted">
            R-SYNC reads your Rekordbox collection and prioritizes recommendations from
            tracks you already own.
          </p>
        </div>

        <div className="mt-10">
          {status === "parsing" ? (
            <div className="space-y-3 rounded-2xl border border-border bg-surface p-8">
              <p className="text-center text-sm text-muted">Analyzing your library…</p>
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          ) : status === "done" && preview ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Stat label="Tracks imported" value={preview.trackCount} />
                <Stat label="Genres" value={preview.genreCounts.length} />
                <Stat label="Camelot keys covered" value={`${preview.keysCovered}/24`} />
                <Stat
                  label="BPM range"
                  value={preview.bpmRange ? `${preview.bpmRange[0]}–${preview.bpmRange[1]}` : "—"}
                />
                <Stat label="Compatible pairs" value={preview.compatibleTransitionPairs} />
                <Stat label="Top genre" value={preview.genreCounts[0]?.genre ?? "—"} />
              </div>

              <Button className="w-full" size="lg" onClick={() => router.push("/library")}>
                View my library
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          ) : (
            <Dropzone onFile={handleFile} error={error} />
          )}
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="font-mono text-[11px] uppercase tracking-wide text-muted-2">{label}</p>
      <p className="mt-1 truncate font-display text-xl font-semibold">{value}</p>
    </div>
  );
}
