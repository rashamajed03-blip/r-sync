"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production, send this to an error-tracking service (Sentry, etc.)
    // instead of just logging it.
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center text-foreground">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/25 bg-red-500/10 text-red-400">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-semibold">Something went wrong.</h1>
        <p className="mt-2 max-w-sm text-sm text-neutral-400">
          That's on us — try again, or head back to the homepage.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/">
            <Button variant="secondary">Back home</Button>
          </Link>
          <Button onClick={() => reset()}>Try again</Button>
        </div>
      </body>
    </html>
  );
}
