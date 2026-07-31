"use client";

import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Music2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getAIRecommendations, type AIMatch } from "@/lib/ai-assistant";
import type { Track } from "@/lib/mock-data";
import Link from "next/link";

const EXAMPLE_PROMPTS = [
  "I'm opening a sunset set.",
  "I need something darker.",
  "I want a festival transition.",
  "I'm closing the night.",
  "Surprise me.",
];

interface Exchange {
  id: string;
  prompt: string;
  interpretation?: string;
  matches?: AIMatch[];
  loading: boolean;
}

export default function AssistantPage() {
  const [input, setInput] = useState("");
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: pool } = useQuery({
    queryKey: ["tracks", "all"],
    queryFn: async () => {
      const res = await fetch("/api/tracks");
      const { tracks } = (await res.json()) as { tracks: Track[] };
      return tracks;
    },
  });

  async function submit(prompt: string) {
    const trimmed = prompt.trim();
    if (!trimmed || !pool) return;
    const id = crypto.randomUUID();
    setExchanges((prev) => [...prev, { id, prompt: trimmed, loading: true }]);
    setInput("");
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

    const response = await getAIRecommendations(trimmed, pool);

    setExchanges((prev) =>
      prev.map((ex) =>
        ex.id === id
          ? { ...ex, loading: false, interpretation: response.interpretation, matches: response.matches }
          : ex,
      ),
    );
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  return (
    <main className="flex min-h-screen flex-col pt-10">
      <div className="container mx-auto flex flex-1 flex-col">
        <div className="mx-auto max-w-xl text-center">
          <span className="eyebrow flex items-center justify-center gap-2">
            <Sparkles className="h-3 w-3" />
            AI Assistant
          </span>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Describe the moment. Get the transition.
          </h1>
          <p className="mt-2 text-sm text-muted">
            No filters to configure — just tell R-SYNC what you need.
          </p>
        </div>

        {/* Conversation */}
        <div className="mx-auto mt-10 w-full max-w-2xl flex-1 space-y-8 pb-40">
          {exchanges.length === 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {EXAMPLE_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => submit(p)}
                  className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted transition-colors hover:border-cyan/30 hover:text-foreground"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          <AnimatePresence initial={false}>
            {exchanges.map((ex) => (
              <motion.div
                key={ex.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* User prompt bubble */}
                <div className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-cyan px-4 py-2.5 text-sm text-background">
                    {ex.prompt}
                  </div>
                </div>

                {/* Assistant response */}
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-purple">
                    <Sparkles className="h-4 w-4 text-background" />
                  </div>
                  <div className="min-w-0 flex-1">
                    {ex.loading ? (
                      <div className="space-y-3">
                        <Skeleton className="h-4 w-3/4" />
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {Array.from({ length: 2 }).map((_, i) => (
                            <Skeleton key={i} className="h-24 rounded-2xl" />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-foreground/90">{ex.interpretation}</p>
                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {ex.matches?.map((m) => (
                            <AIMatchCard key={m.track.id} match={m} />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Composer */}
      <div className="sticky bottom-0 border-t border-border bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto max-w-2xl py-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(input);
            }}
            className="glass flex items-center gap-2 rounded-2xl p-2 pl-4"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for a vibe, a mood, a moment in your set..."
              className="h-11 w-full bg-transparent text-sm text-foreground placeholder:text-muted-2 focus:outline-none"
            />
            <button type="submit" className="btn-primary h-11 w-11 shrink-0 p-0" aria-label="Send">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

function AIMatchCard({ match }: { match: AIMatch }) {
  const { track, reasons } = match;
  const [c1, c2] = track.artworkColors;

  return (
    <Link
      href={`/track/${track.id}`}
      className="surface-card flex gap-3 p-3 transition-colors hover:border-white/15"
    >
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
        style={{ background: `linear-gradient(135deg, ${c1}33, ${c2}33)` }}
      >
        <Music2 className="h-4 w-4 text-foreground/40" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{track.title}</p>
        <p className="truncate text-xs text-muted">{track.artist}</p>
        <div className="mt-1.5 flex flex-wrap gap-1">
          <Badge variant="cyan">{track.camelotKey}</Badge>
          <Badge variant="purple">{track.bpm}</Badge>
        </div>
        {reasons[0] && <p className="mt-1.5 text-[11px] text-muted-2">{reasons[0]}</p>}
      </div>
    </Link>
  );
}
