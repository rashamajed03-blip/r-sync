"use client";

import { motion } from "framer-motion";
import { Circle } from "lucide-react";

const VIEWS = [
  { label: "Search & recommendations", desc: "Ranked matches with explained scoring" },
  { label: "Set planner", desc: "Full timeline with energy and key progression" },
  { label: "Dashboard", desc: "Your library, visualized" },
];

export function Screenshots() {
  return (
    <section className="relative py-28">
      <div className="container mx-auto">
        <div className="mx-auto max-w-xl text-center">
          <span className="eyebrow">Inside R-SYNC</span>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Built like the tools
            <br />
            you already trust.
          </h2>
        </div>

        <div className="mt-16 space-y-6">
          {VIEWS.map((v, i) => (
            <motion.div
              key={v.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="surface-card overflow-hidden"
            >
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <div className="flex gap-1.5">
                  <Circle className="h-2.5 w-2.5 fill-muted-2 text-muted-2" />
                  <Circle className="h-2.5 w-2.5 fill-muted-2 text-muted-2" />
                  <Circle className="h-2.5 w-2.5 fill-muted-2 text-muted-2" />
                </div>
                <span className="ml-2 font-mono text-xs text-muted">
                  app.rsync.com — {v.label.toLowerCase()}
                </span>
              </div>
              <div
                className={`flex aspect-[16/8] items-center justify-center bg-gradient-to-br ${
                  i === 1
                    ? "from-purple/[0.07] to-transparent"
                    : "from-cyan/[0.07] to-transparent"
                }`}
              >
                <div className="text-center">
                  <p className="font-display text-lg text-muted">{v.label}</p>
                  <p className="mt-1 text-sm text-muted-2">{v.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
