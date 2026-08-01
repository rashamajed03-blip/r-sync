"use client";

import { motion } from "framer-motion";

const QUOTES = [
  {
    quote:
      "I stopped second-guessing transitions mid-set. R-SYNC tells me the key match before I've even cued the track.",
    name: "M. Álvarez",
    role: "Club resident, Barcelona",
  },
  {
    quote:
      "The Rekordbox import alone paid for the upgrade. My whole library, finally organized by what actually mixes.",
    name: "J. Okafor",
    role: "Open-format DJ",
  },
  {
    quote:
      "Set planner caught a bad energy drop before I played it live. That's the kind of tool that saves a night.",
    name: "R. Kowalski",
    role: "Festival stage curator",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-28">
      <div className="container mx-auto">
        <div className="mx-auto max-w-xl text-center">
          <span className="eyebrow">From the booth</span>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Trusted by DJs who
            <br />
            can't afford a bad transition.
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3">
          {QUOTES.map((q, i) => (
            <motion.figure
              key={q.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="surface-card flex h-full flex-col justify-between p-7"
            >
              <blockquote className="text-[15px] leading-relaxed text-foreground/90">
                “{q.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-purple font-mono text-xs font-medium text-background">
                  {q.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-medium">{q.name}</div>
                  <div className="text-xs text-muted">{q.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
