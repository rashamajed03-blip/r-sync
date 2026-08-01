import Link from "next/link";
import { Radio, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-purple">
        <Radio className="h-4 w-4 text-background" strokeWidth={2.5} />
      </div>
      <div className="mt-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface text-muted">
        <SearchX className="h-6 w-6" />
      </div>
      <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight">
        This track skipped the set.
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        We couldn't find what you're looking for. It may have moved, or the link might be
        off.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/">
          <Button variant="secondary">Back home</Button>
        </Link>
        <Link href="/search">
          <Button>Search tracks</Button>
        </Link>
      </div>
    </main>
  );
}
