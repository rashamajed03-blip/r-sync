"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "Is R-SYNC a streaming platform?",
    a: "No — R-SYNC doesn't host or stream audio. It's a recommendation and set-planning tool built on top of your existing library and DJ software.",
  },
  {
    q: "How does harmonic matching work?",
    a: "R-SYNC uses the Camelot Wheel system to find keys that mix cleanly — the same key, its relative major/minor, or an adjacent key for an energy shift.",
  },
  {
    q: "Can I import my existing Rekordbox library?",
    a: "Yes. Upload your Rekordbox XML export and R-SYNC analyzes your full library — BPM, key, genre, and energy distribution — in minutes.",
  },
  {
    q: "What happens if I go over the Free plan's limits?",
    a: "You'll be prompted to upgrade to Premium. Nothing you've already saved is ever deleted or locked.",
  },
  {
    q: "Which DJ software does R-SYNC integrate with?",
    a: "Rekordbox import is available today. Beatport, Spotify, Apple Music, and SoundCloud integrations are on our roadmap.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-28">
      <div className="container mx-auto">
        <div className="mx-auto max-w-xl text-center">
          <span className="eyebrow">Questions</span>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Good to know.
          </h2>
        </div>

        <div className="mx-auto mt-14 max-w-2xl divide-y divide-border rounded-2xl border border-border bg-surface">
          {FAQS.map((item, i) => (
            <div key={item.q} className="px-6">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
                aria-expanded={open === i}
              >
                <span className="font-medium">{item.q}</span>
                <Plus
                  className={cn(
                    "h-4 w-4 shrink-0 text-cyan transition-transform duration-300",
                    open === i && "rotate-45",
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 text-sm leading-relaxed text-muted">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
