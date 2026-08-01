import Link from "next/link";
import { Radio, Sparkles } from "lucide-react";
import { CamelotWheel } from "@/components/landing/CamelotWheel";

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Branding panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-border bg-surface p-12 lg:flex">
        <div className="pointer-events-none absolute inset-0 bg-grid-fade" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-0 -translate-x-1/2 -translate-y-1/2 opacity-40">
          <CamelotWheel size={620} />
        </div>

        <Link href="/" className="relative z-10 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-purple">
            <Radio className="h-4 w-4 text-background" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">R-SYNC</span>
        </Link>

        <div className="relative z-10">
          <span className="eyebrow mb-4 flex w-fit items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-1.5">
            <Sparkles className="h-3 w-3" />
            {eyebrow}
          </span>
          <h1 className="max-w-sm text-balance font-display text-4xl font-semibold leading-tight tracking-tight">
            {title}
          </h1>
          <p className="mt-3 max-w-sm text-sm text-muted">{subtitle}</p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-background px-6 py-16">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-purple">
              <Radio className="h-4 w-4 text-background" strokeWidth={2.5} />
            </div>
            <span className="font-display text-lg font-semibold tracking-tight">R-SYNC</span>
          </Link>
          {children}
        </div>
      </div>
    </main>
  );
}
