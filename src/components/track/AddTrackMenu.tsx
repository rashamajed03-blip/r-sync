"use client";

import { useState } from "react";
import { Plus, FolderPlus, ListMusic, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCratesStore } from "@/store/crates-store";
import { useSetPlannerStore } from "@/store/set-planner-store";
import type { TrackRef } from "@/lib/track-ref";

export function AddTrackMenu({
  track,
  trigger,
}: {
  track: TrackRef;
  trigger?: React.ReactNode;
}) {
  const { crates, createCrate, addTrackToCrate } = useCratesStore();
  const { addTrack: addToSet, tracks: setTracks } = useSetPlannerStore();
  const [newCrateOpen, setNewCrateOpen] = useState(false);
  const [newCrateName, setNewCrateName] = useState("");

  const inSet = setTracks.some((t) => t.id === track.id);

  function handleCreateCrate() {
    const crate = createCrate(newCrateName);
    addTrackToCrate(crate.id, track);
    setNewCrateName("");
    setNewCrateOpen(false);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {trigger ?? (
            <Button size="sm" variant="secondary" className="flex-1">
              <Plus className="h-3.5 w-3.5" />
              Add to crate
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem onSelect={() => addToSet(track)} disabled={inSet}>
            <ListMusic className="h-3.5 w-3.5" />
            {inSet ? "Already in set planner" : "Add to set planner"}
            {inSet && <Check className="ml-auto h-3.5 w-3.5 text-cyan" />}
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Add to crate</DropdownMenuLabel>

          {crates.length === 0 ? (
            <p className="px-2.5 py-2 text-xs text-muted-2">No crates yet</p>
          ) : (
            crates.map((c) => {
              const already = c.tracks.some((t) => t.id === track.id);
              return (
                <DropdownMenuItem
                  key={c.id}
                  onSelect={() => addTrackToCrate(c.id, track)}
                  disabled={already}
                >
                  {c.name}
                  {already && <Check className="ml-auto h-3.5 w-3.5 text-cyan" />}
                </DropdownMenuItem>
              );
            })
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setNewCrateOpen(true)}>
            <FolderPlus className="h-3.5 w-3.5" />
            New crate...
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={newCrateOpen} onOpenChange={setNewCrateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New crate</DialogTitle>
            <DialogDescription>
              "{track.title}" will be added to it right away.
            </DialogDescription>
          </DialogHeader>
          <Input
            autoFocus
            placeholder="e.g. Sunset Warm Up"
            value={newCrateName}
            onChange={(e) => setNewCrateName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreateCrate()}
            className="mt-4"
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button onClick={handleCreateCrate}>Create & add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
