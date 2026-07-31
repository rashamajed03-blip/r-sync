"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, ListMusic, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useCratesStore } from "@/store/crates-store";

const SUGGESTED_NAMES = ["Warm Up", "Peak Time", "Closing", "Festival", "Warehouse", "Beach", "Sunset"];

export default function CratesPage() {
  const router = useRouter();
  const { crates, createCrate, deleteCrate } = useCratesStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");

  function handleCreate(presetName?: string) {
    const crate = createCrate(presetName ?? name);
    setName("");
    setDialogOpen(false);
    router.push(`/crates/${crate.id}`);
  }

  return (
    <main className="min-h-screen px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="eyebrow">Crates</span>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
              {crates.length > 0 ? `${crates.length} crates` : "No crates yet"}
            </h1>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            New crate
          </Button>
        </div>

        {crates.length === 0 ? (
          <div className="mt-10">
            <p className="text-sm text-muted">Quick start with a common set structure:</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {SUGGESTED_NAMES.map((n) => (
                <button
                  key={n}
                  onClick={() => handleCreate(n)}
                  className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted transition-colors hover:border-cyan/30 hover:text-foreground"
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {crates.map((c) => (
              <Card key={c.id} className="group relative p-5 transition-colors hover:border-white/15">
                <Link href={`/crates/${c.id}`} className="block">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan/20 bg-cyan/10 text-cyan">
                    <ListMusic className="h-4 w-4" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold">{c.name}</h3>
                  <p className="mt-1 text-sm text-muted">
                    {c.tracks.length} {c.tracks.length === 1 ? "track" : "tracks"}
                  </p>
                </Link>
                <button
                  onClick={() => deleteCrate(c.id)}
                  className="absolute right-4 top-4 text-muted-2 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                  aria-label={`Delete ${c.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </Card>
            ))}
          </motion.div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New crate</DialogTitle>
            <DialogDescription>Name it whatever helps you find it later.</DialogDescription>
          </DialogHeader>
          <Input
            autoFocus
            placeholder="e.g. Sunset Warm Up"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            className="mt-4"
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button onClick={() => handleCreate()}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
