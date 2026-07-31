import { Skeleton } from "@/components/ui/skeleton";

export default function TrackDetailLoading() {
  return (
    <main className="min-h-screen pb-24 pt-10">
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[280px_1fr]">
          <Skeleton className="aspect-square w-full rounded-3xl" />
          <div className="flex flex-col justify-center gap-4">
            <div className="flex gap-1.5">
              <Skeleton className="h-5 w-12 rounded-md" />
              <Skeleton className="h-5 w-16 rounded-md" />
              <Skeleton className="h-5 w-20 rounded-md" />
            </div>
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-5 w-1/3" />
            <div className="flex gap-3 pt-2">
              <Skeleton className="h-12 w-32 rounded-xl" />
              <Skeleton className="h-12 w-40 rounded-xl" />
            </div>
          </div>
        </div>
        <Skeleton className="mt-12 h-24 w-full rounded-2xl" />
        <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl sm:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-none" />
          ))}
        </div>
      </div>
    </main>
  );
}
