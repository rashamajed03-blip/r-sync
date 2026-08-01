"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, ArrowRight, PlayCircle } from "lucide-react";
import { CamelotWheel } from "./CamelotWheel";

const CHIP_MATCHES = [
  { label: "8B", sub: "Same key", pos: "left-[6%] top-[18%]", delay: 0.1 },
  { label: "128", sub: "BPM match", pos: "right-[4%] top-[28%]", delay: 0.3 },
  { label: "97%", sub: "Transition score", pos: "left-[10%] bottom-[16%]", delay: 0.5 },
  { label: "9B", sub: "Compatible", pos: "right-[8%] bottom-[22%]", delay: 0.7 },
];

export function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function goToSearch() {
    router.push(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : "/search");
  }

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-28">
      {/* Ambient gradient wash */}
      <div className="pointer-events-none absolute inset-0 bg-grid-fade" />
      <div className="pointer-events-none absolute left-1/2 top-[38%] -z-10 -translate-x-1/2 -translate-y-1/2 opacity-70">
        <CamelotWheel size={760} />
      </div>

      {/* Floating match chips — decorative, illustrate the product's core output */}
      {CHIP_MATCHES.map((chip) => (
        <motion.div
          key={chip.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: chip.delay, duration: 0.8 }}
          className={`glass absolute hidden rounded-xl px-4 py-2.5 shadow-glow lg:block ${chip.pos} animate-float`}
          style={{ animationDelay: `${chip.delay}s` }}
        >
          <div className="font-mono text-sm font-medium text-cyan">{chip.label}</div>
          <div className="text-[11px] text-muted">{chip.sub}</div>
        </motion.div>
      ))}

      <div className="container relative z-10 mx-auto flex flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="eyebrow mb-6 flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-cyan shadow-glow" />
          Harmonic mixing, solved in real time
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-3xl text-balance font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
        >
          Find your perfect
          <br />
          <span className="text-gradient">next transition.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 max-w-xl text-balance text-lg text-muted"
        >
          R-SYNC reads your library by BPM, key, and energy — then tells you
          exactly which track to drop next, and why it works.
        </motion.p>

        {/* Animated search bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass mt-10 flex w-full max-w-xl items-center gap-3 rounded-2xl p-2 pl-5 shadow-glow"
        >
          <Search className="h-5 w-5 shrink-0 text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && goToSearch()}
            placeholder="Try “Rebirth” — or a BPM, key, or genre"
            className="h-11 w-full bg-transparent text-sm text-foreground placeholder:text-muted-2 focus:outline-none"
          />
          <button onClick={goToSearch} className="btn-primary h-11 shrink-0 px-5 text-sm">
            Search
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex flex-col items-center gap-4 sm:flex-row"
        >
          <a href="/signup" className="btn-primary px-7 py-3.5 text-sm">
            Start mixing free
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="#how-it-works"
            className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
          >
            <PlayCircle className="h-4 w-4" />
            See how it works
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 font-mono text-xs uppercase tracking-[0.15em] text-muted-2"
        >
          No credit card · Free tier includes unlimited search
        </motion.p>
      </div>
    </section>
  );
}
