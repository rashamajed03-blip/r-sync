"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    n: "01",
    title: "Search or import",
    body: "Look up any track, or upload your Rekordbox XML so R-SYNC knows your full library.",
  },
  {
    n: "02",
    title: "Get ranked matches",
    body: "See every compatible track scored by key, BPM, energy, and genre — with the match explained.",
  },
  {
    n: "03",
    title: "Drop it with confidence",
    body: "Save it to a crate, drop it in your set plan, or take it straight into your next mix.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-28">
      <div className="container mx-auto">
        <div className="mx-auto max-w-xl text-center">
          <span className="eyebrow">The process</span>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            From track to transition
            <br />
            in three steps.
          </h2>
        </div>

        <div className="relative mt-20 grid grid-cols-1 gap-10 md:grid-cols-3">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="relative text-center md:text-left"
            >
              <div className="relative z-10 mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background font-mono text-sm text-cyan md:mx-0">
                {s.n}
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
