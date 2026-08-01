"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { TrackCard, type TrackCardData } from "@/components/track/TrackCard";
import { MatchScore } from "@/components/track/MatchScore";

const SAMPLE_TRACKS: TrackCardData[] = [
  {
    id: "1",
    title: "Rebirth (Extended Mix)",
    artist: "Nova Reyes",
    genre: "Melodic Techno",
    subgenre: "Progressive",
    bpm: 124,
    camelotKey: "8B",
    energy: 7,
    popularity: 82,
    matchScore: 98,
    reasons: ["Perfect harmonic transition", "Same BPM", "Similar energy", "Frequently mixed together"],
    artworkColor: ["#22D3EE", "#A855F7"],
  },
  {
    id: "2",
    title: "Low Tide",
    artist: "Ferro & Kessel",
    genre: "Deep House",
    bpm: 122,
    camelotKey: "9B",
    energy: 5,
    popularity: 64,
    matchScore: 84,
    reasons: ["Compatible key (+1 Camelot)", "Similar groove"],
    artworkColor: ["#A855F7", "#22D3EE"],
  },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-border py-12">
      <h2 className="mb-6 font-display text-sm uppercase tracking-[0.15em] text-muted-2">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function StyleGuidePage() {
  const [sliderVal, setSliderVal] = useState([2]);

  return (
    <TooltipProvider>
      <main className="container mx-auto max-w-4xl py-16">
        <h1 className="font-display text-4xl font-semibold tracking-tight">
          R-SYNC <span className="text-gradient">design system</span>
        </h1>
        <p className="mt-2 text-muted">
          Internal reference — every primitive used to build the rest of the app.
        </p>

        <Section title="Buttons">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
        </Section>

        <Section title="Badges">
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="cyan">8B</Badge>
            <Badge variant="purple">124 BPM</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="success">Compatible</Badge>
            <Badge variant="warning">Close call</Badge>
          </div>
        </Section>

        <Section title="Match score">
          <div className="flex items-center gap-6">
            <MatchScore score={98} />
            <MatchScore score={82} />
            <MatchScore score={61} />
          </div>
        </Section>

        <Section title="Form controls">
          <div className="grid max-w-sm gap-5">
            <div className="grid gap-2">
              <Label htmlFor="track">Track name</Label>
              <Input id="track" placeholder="Search a track..." />
            </div>

            <div className="grid gap-2">
              <Label>BPM tolerance</Label>
              <Select defaultValue="1">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Same BPM</SelectItem>
                  <SelectItem value="1">± 1 BPM</SelectItem>
                  <SelectItem value="2">± 2 BPM</SelectItem>
                  <SelectItem value="3">± 3 BPM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Energy range — {sliderVal[0]}</Label>
              <Slider value={sliderVal} onValueChange={setSliderVal} max={10} step={1} />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="explicit" />
              <Label htmlFor="explicit">Hide explicit tracks</Label>
            </div>
          </div>
        </Section>

        <Section title="Tabs">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="matches">Matches</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <p className="text-sm text-muted">Track metadata and waveform live here.</p>
            </TabsContent>
            <TabsContent value="matches">
              <p className="text-sm text-muted">Ranked recommendations render here.</p>
            </TabsContent>
            <TabsContent value="history">
              <p className="text-sm text-muted">Play and mix history render here.</p>
            </TabsContent>
          </Tabs>
        </Section>

        <Section title="Tooltip & dialog">
          <div className="flex items-center gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="sm">
                  Hover for why
                </Button>
              </TooltipTrigger>
              <TooltipContent>Same key, same BPM, frequently mixed together.</TooltipContent>
            </Tooltip>

            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">Create crate</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New crate</DialogTitle>
                  <DialogDescription>
                    Give your crate a name — you can add tracks after.
                  </DialogDescription>
                </DialogHeader>
                <Input placeholder="e.g. Sunset Warm Up" className="mt-4" />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="secondary">Cancel</Button>
                  </DialogClose>
                  <Button>Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </Section>

        <Section title="Skeleton loading">
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
        </Section>

        <Section title="Card">
          <Card className="max-w-sm">
            <CardHeader>
              <CardTitle>Library summary</CardTitle>
              <CardDescription>Imported from your last Rekordbox export.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Tracks</span>
                <span className="font-mono">4,218</span>
              </div>
              <Separator className="my-3" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Top key</span>
                <Badge variant="cyan">8B</Badge>
              </div>
            </CardContent>
          </Card>
        </Section>

        <Section title="Track card (recommendation engine)">
          <div className="grid gap-4 sm:grid-cols-2">
            {SAMPLE_TRACKS.map((t) => (
              <TrackCard key={t.id} track={t} />
            ))}
          </div>
        </Section>
      </main>
    </TooltipProvider>
  );
}
