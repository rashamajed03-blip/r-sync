"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useUser } from "@clerk/nextjs";
import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useProfileStore } from "@/store/profile-store";
import { useLibraryStore } from "@/store/library-store";
import { useCratesStore } from "@/store/crates-store";
import { useSearchStore } from "@/store/search-store";
import { computeLibraryStats } from "@/lib/rekordbox-import";
import { clerkAppearance } from "@/lib/clerk-appearance";
import { Skeleton } from "@/components/ui/skeleton";

// Clerk's <UserProfile> is a large, iframe-heavy component. Loading it lazily
// (and client-side only) keeps it out of the initial bundle for everyone who
// never opens the Account tab.
const UserProfile = dynamic(() => import("@clerk/nextjs").then((m) => m.UserProfile), {
  ssr: false,
  loading: () => (
    <div className="space-y-3 p-6">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-32 w-full" />
    </div>
  ),
});

export default function ProfilePage() {
  const { user } = useUser();
  const { bio, setBio } = useProfileStore();
  const [draftBio, setDraftBio] = useState(bio);
  const libraryTracks = useLibraryStore((s) => s.tracks);
  const crates = useCratesStore((s) => s.crates);
  const recentSearches = useSearchStore((s) => s.recentSearches);
  const stats = useMemo(() => computeLibraryStats(libraryTracks), [libraryTracks]);

  return (
    <main className="min-h-screen px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-4">
          {user?.imageUrl && (
            <Image
              src={user.imageUrl}
              alt=""
              width={64}
              height={64}
              className="h-16 w-16 rounded-2xl border border-border object-cover"
            />
          )}
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">
              {user?.fullName ?? user?.username ?? "Your profile"}
            </h1>
            <p className="text-sm text-muted">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="mt-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="crates">Crates</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className="p-6">
              <h3 className="font-display text-sm font-semibold">Bio</h3>
              <Textarea
                value={draftBio}
                onChange={(e) => setDraftBio(e.target.value)}
                onBlur={() => setBio(draftBio)}
                placeholder="Tell other DJs what you play..."
                className="mt-3"
                rows={3}
              />
            </Card>

            <Card className="mt-4 p-6">
              <h3 className="font-display text-sm font-semibold">DJ preferences</h3>
              {libraryTracks.length > 0 ? (
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <PrefStat label="Favorite genre" value={stats.genreCounts[0]?.genre ?? "—"} />
                  <PrefStat label="Favorite key" value={stats.keyCounts[0]?.key ?? "—"} accent="cyan" />
                  <PrefStat
                    label="BPM range"
                    value={stats.bpmRange ? `${stats.bpmRange[0]}–${stats.bpmRange[1]}` : "—"}
                    accent="purple"
                  />
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-2">
                  Import your Rekordbox library on{" "}
                  <Link href="/import" className="text-cyan hover:underline">
                    the import page
                  </Link>{" "}
                  to see this filled in automatically.
                </p>
              )}
            </Card>

            <Card className="mt-4 p-6">
              <h3 className="font-display text-sm font-semibold">Recent activity</h3>
              {recentSearches.length > 0 ? (
                <ul className="mt-3 space-y-1.5">
                  {recentSearches.slice(0, 6).map((q) => (
                    <li key={q} className="text-sm text-muted">
                      Searched <span className="text-foreground/90">"{q}"</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted-2">No recent activity yet.</p>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="crates">
            {crates.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {crates.map((c) => (
                  <Link key={c.id} href={`/crates/${c.id}`}>
                    <Card className="p-5 transition-colors hover:border-white/15">
                      <p className="font-display font-semibold">{c.name}</p>
                      <p className="mt-1 text-sm text-muted">{c.tracks.length} tracks</p>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-2">
                No crates yet —{" "}
                <Link href="/crates" className="text-cyan hover:underline">
                  create one
                </Link>
                .
              </p>
            )}
          </TabsContent>

          <TabsContent value="account">
            <div className="overflow-hidden rounded-2xl border border-border">
              <UserProfile appearance={clerkAppearance} routing="hash" />
            </div>
          </TabsContent>

          <TabsContent value="subscription">
            <Card className="flex items-center justify-between gap-4 p-6">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-display text-lg font-semibold">Free plan</p>
                  <Badge>Current</Badge>
                </div>
                <p className="mt-1 text-sm text-muted">
                  Unlimited search, basic recommendations, and limited uploads.
                </p>
              </div>
              <Link href="/#pricing">
                <Button>
                  <Sparkles className="h-3.5 w-3.5" />
                  Upgrade to Premium
                </Button>
              </Link>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

function PrefStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "cyan" | "purple";
}) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-wide text-muted-2">{label}</p>
      <p
        className={`mt-1 font-display text-lg font-semibold ${
          accent === "cyan" ? "text-cyan" : accent === "purple" ? "text-purple" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}
