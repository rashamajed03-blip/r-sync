"use client";

import Link from "next/link";
import { Radio, Twitter, Instagram, Youtube } from "lucide-react";

const COLUMNS = [
  {
    title: "Product",
    links: ["Features", "Pricing", "Search", "Set Planner", "AI Assistant"],
  },
  {
    title: "Company",
    links: ["About", "Blog", "Careers", "Contact"],
  },
  {
    title: "Resources",
    links: ["Help Center", "Rekordbox Import Guide", "Camelot Wheel 101", "API"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service"],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border">
      <div className="container mx-auto py-20 text-center">
        <h2 className="mx-auto max-w-lg text-balance font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Your next transition
          <br />
          <span className="text-gradient">is one search away.</span>
        </h2>
        <Link href="/signup" className="btn-primary mt-8 inline-flex px-7 py-3.5 text-sm">
          Start mixing free
        </Link>
      </div>

      <div className="container mx-auto grid grid-cols-2 gap-8 border-t border-border py-14 sm:grid-cols-3 lg:grid-cols-5">
        <div className="col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-purple">
              <Radio className="h-3.5 w-3.5 text-background" strokeWidth={2.5} />
            </div>
            <span className="font-display text-base font-semibold">R-SYNC</span>
          </div>
          <p className="mt-3 max-w-[220px] text-sm text-muted">
            Find your perfect next transition.
          </p>
          <div className="mt-5 flex gap-4 text-muted">
            <Twitter className="h-4 w-4 transition-colors hover:text-foreground" />
            <Instagram className="h-4 w-4 transition-colors hover:text-foreground" />
            <Youtube className="h-4 w-4 transition-colors hover:text-foreground" />
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="font-mono text-xs uppercase tracking-wide text-muted-2">
              {col.title}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-muted hover:text-foreground">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border py-6">
        <p className="text-center text-xs text-muted-2">
          © {new Date().getFullYear()} R-SYNC. Built for DJs, by DJs.
        </p>
      </div>
    </footer>
  );
}
