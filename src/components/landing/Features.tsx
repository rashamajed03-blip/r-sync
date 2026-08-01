"use client";

import { motion } from "framer-motion";
import {
  Waves,
  CircleDot,
  Sparkles,
  Library,
  SlidersHorizontal,
  Route,
} from "lucide-react";

const FEATURES = [
  {
    icon: CircleDot,
    title: "Harmonic matching",
    body: "Full Camelot Wheel logic finds every key that mixes clean — same key, relative, or energy boost.",
    accent: "cyan" as const,
  },
  {
    icon: Waves,
    title: "BPM & energy aware",
    body: "Matches respect your tolerance window and track the energy curve, so transitions never feel flat.",
    accent: "purple" as const,
  },
  {
    icon: Sparkles,
    title: "AI transition assistant",
    body: "Describe the moment — “opening a sunset set” — and get explained, ranked recommendations.",
    accent: "cyan" as const,
  },
  {
    icon: Library,
    title: "Your library, prioritized",
    body: "Import your Rekordbox XML and R-SYNC recommends from tracks you actually own first.",
    accent: "purple" as const,
  },
  {
    icon: SlidersHorizontal,
    title: "Pro-grade filters",
    body: "Key, BPM tolerance, genre, vocal presence, popularity, duration — stack as many as you need.",
    accent: "cyan" as const,
  },
  {
    icon: Route,
    title: "Full set planning",
    body: "Lay out an entire set on a timeline with live BPM and Camelot progression, flagged where it breaks.",
    accent: "purple" as const,
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-28">
      <div className="container mx-auto">
        <div className="mx-auto max-w-xl text-center">
          <span className="eyebrow">What R-SYNC does</span>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Everything a mix needs,
            <br />
            nothing it doesn't.
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: (i % 3) * 0.08, duration: 0.5 }}
              className="surface-card group relative overflow-hidden p-7 transition-colors hover:border-white/15"
            >
              <div
                className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl border ${
                  f.accent === "cyan"
                    ? "border-cyan/20 bg-cyan/10 text-cyan"
                    : "border-purple/20 bg-purple/10 text-purple"
                }`}
              >
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>

              <div
                className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20 ${
                  f.accent === "cyan" ? "bg-cyan" : "bg-purple"
                }`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
