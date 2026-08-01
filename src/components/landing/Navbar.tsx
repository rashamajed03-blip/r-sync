"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X, Radio } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#faq" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="glass mx-auto mt-4 flex h-16 max-w-6xl items-center justify-between rounded-2xl px-5">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-purple">
            <Radio className="h-4 w-4 text-background" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">
            R-SYNC
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <SignedOut>
            <Link
              href="/login"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              Log in
            </Link>
            <Link href="/signup" className="btn-primary h-10 px-5 text-sm">
              Sign up free
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              href="/library"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              My Library
            </Link>
            <Link
              href="/assistant"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              AI Assistant
            </Link>
            <Link
              href="/dashboard"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>

        <button
          className="text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass mx-4 mt-2 flex flex-col gap-1 rounded-2xl p-3 md:hidden"
        >
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm text-muted hover:bg-white/5 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
            <SignedOut>
              <Link href="/login" className="btn-secondary h-10 text-sm">
                Log in
              </Link>
              <Link href="/signup" className="btn-primary h-10 text-sm">
                Sign up free
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/library" className="btn-secondary h-10 text-sm">
                My Library
              </Link>
              <Link href="/assistant" className="btn-secondary h-10 text-sm">
                AI Assistant
              </Link>
              <Link href="/dashboard" className="btn-secondary h-10 text-sm">
                Dashboard
              </Link>
            </SignedIn>
          </div>
        </motion.div>
      )}
    </header>
  );
}
