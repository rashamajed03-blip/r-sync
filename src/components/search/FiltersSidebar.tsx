"use client";

import { RotateCcw } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { GENRES, CAMELOT_KEYS } from "@/lib/mock-data";

export interface Filters {
  bpmRange: [number, number];
  keyMode: "any" | "same" | "compatible";
  referenceKey: string;
  genres: string[];
  energyRange: [number, number];
  minPopularity: number;
  yearFrom: number;
  vocal: boolean;
  instrumental: boolean;
  hideExplicit: boolean;
}

export const DEFAULT_FILTERS: Filters = {
  bpmRange: [60, 180],
  keyMode: "any",
  referenceKey: "8B",
  genres: [],
  energyRange: [1, 10],
  minPopularity: 0,
  yearFrom: 2018,
  vocal: false,
  instrumental: false,
  hideExplicit: false,
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-5">
      <h4 className="mb-3 font-mono text-xs uppercase tracking-wide text-muted-2">{title}</h4>
      {children}
    </div>
  );
}

export function FiltersSidebar({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (filters: Filters) => void;
}) {
  function set<K extends keyof Filters>(key: K, value: Filters[K]) {
    onChange({ ...filters, [key]: value });
  }

  function toggleGenre(genre: string) {
    set(
      "genres",
      filters.genres.includes(genre)
        ? filters.genres.filter((g) => g !== genre)
        : [...filters.genres, genre],
    );
  }

  return (
    <aside className="surface-card h-fit w-full divide-y divide-border p-5">
      <div className="flex items-center justify-between pb-4">
        <h3 className="font-display text-base font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={() => onChange(DEFAULT_FILTERS)}>
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </Button>
      </div>

      <Section title="Key">
        <Select value={filters.keyMode} onValueChange={(v) => set("keyMode", v as Filters["keyMode"])}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any key</SelectItem>
            <SelectItem value="same">Same key as reference</SelectItem>
            <SelectItem value="compatible">Compatible Camelot keys</SelectItem>
          </SelectContent>
        </Select>
        {filters.keyMode !== "any" && (
          <Select value={filters.referenceKey} onValueChange={(v) => set("referenceKey", v)}>
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CAMELOT_KEYS.map((k) => (
                <SelectItem key={k} value={k}>
                  {k}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </Section>

      <Section title={`BPM — ${filters.bpmRange[0]} to ${filters.bpmRange[1]}`}>
        <Slider
          value={filters.bpmRange}
          onValueChange={(v) => set("bpmRange", v as [number, number])}
          min={60}
          max={180}
          step={1}
        />
      </Section>

      <Section title="Genre">
        <div className="space-y-2">
          {GENRES.map((genre) => (
            <div key={genre} className="flex items-center gap-2">
              <Checkbox
                id={`genre-${genre}`}
                checked={filters.genres.includes(genre)}
                onCheckedChange={() => toggleGenre(genre)}
              />
              <Label htmlFor={`genre-${genre}`} className="text-sm font-normal text-foreground/90">
                {genre}
              </Label>
            </div>
          ))}
        </div>
      </Section>

      <Section title={`Energy — ${filters.energyRange[0]} to ${filters.energyRange[1]}`}>
        <Slider
          value={filters.energyRange}
          onValueChange={(v) => set("energyRange", v as [number, number])}
          min={1}
          max={10}
          step={1}
        />
      </Section>

      <Section title={`Min. popularity — ${filters.minPopularity}`}>
        <Slider
          value={[filters.minPopularity]}
          onValueChange={(v) => set("minPopularity", v[0])}
          min={0}
          max={100}
          step={5}
        />
      </Section>

      <Section title={`Release year — ${filters.yearFrom}+`}>
        <Slider
          value={[filters.yearFrom]}
          onValueChange={(v) => set("yearFrom", v[0])}
          min={2015}
          max={2026}
          step={1}
        />
      </Section>

      <Section title="Vocal">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="vocal"
              checked={filters.vocal}
              onCheckedChange={(c) => set("vocal", Boolean(c))}
            />
            <Label htmlFor="vocal" className="text-sm font-normal text-foreground/90">
              Vocal
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="instrumental"
              checked={filters.instrumental}
              onCheckedChange={(c) => set("instrumental", Boolean(c))}
            />
            <Label htmlFor="instrumental" className="text-sm font-normal text-foreground/90">
              Instrumental
            </Label>
          </div>
        </div>
      </Section>

      <div className="pt-5">
        <div className="flex items-center gap-2">
          <Checkbox
            id="explicit"
            checked={filters.hideExplicit}
            onCheckedChange={(c) => set("hideExplicit", Boolean(c))}
          />
          <Label htmlFor="explicit" className="text-sm font-normal text-foreground/90">
            Hide explicit tracks
          </Label>
        </div>
      </div>
    </aside>
  );
}
