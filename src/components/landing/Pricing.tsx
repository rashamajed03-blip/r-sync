"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For DJs who just need fast, accurate matches.",
    features: [
      "Unlimited search",
      "Basic BPM & key recommendations",
      "Save favorites",
      "Limited Rekordbox uploads",
    ],
    cta: "Start free",
    highlighted: false,
  },
  {
    name: "Premium",
    price: "$14",
    period: "/ month",
    description: "For DJs who plan sets and mix professionally.",
    features: [
      "Everything in Free",
      "AI recommendation assistant",
      "Unlimited crates & uploads",
      "Full set planner",
      "Advanced filters & analytics",
      "Cloud sync across devices",
    ],
    cta: "Start Premium",
    highlighted: true,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-28">
      <div className="container mx-auto">
        <div className="mx-auto max-w-xl text-center">
          <span className="eyebrow">Pricing</span>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Simple pricing,
            <br />
            built to scale with your sets.
          </h2>
        </div>

        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={cn(
                "relative flex flex-col rounded-2xl border p-8",
                plan.highlighted
                  ? "border-cyan/30 bg-surface shadow-glow"
                  : "border-border bg-surface",
              )}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-8 rounded-full bg-cyan-purple px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-background">
                  Most popular
                </span>
              )}
              <h3 className="font-display text-xl font-semibold">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted">{plan.description}</p>
              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="font-display text-4xl font-semibold">{plan.price}</span>
                <span className="text-sm text-muted">{plan.period}</span>
              </div>

              <ul className="mt-7 flex-1 space-y-3">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />
                    <span className="text-foreground/90">{feat}</span>
                  </li>
                ))}
              </ul>

              <a
                href="/signup"
                className={cn(
                  "mt-8 w-full",
                  plan.highlighted ? "btn-primary" : "btn-secondary",
                )}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
