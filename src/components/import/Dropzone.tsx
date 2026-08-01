"use client";

import { useCallback, useRef, useState } from "react";
import { UploadCloud, FileWarning } from "lucide-react";
import { cn } from "@/lib/utils";

export function Dropzone({
  onFile,
  error,
}: {
  onFile: (file: File) => void;
  error: string | null;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (file) onFile(file);
    },
    [onFile],
  );

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-14 text-center transition-colors",
          dragging ? "border-cyan bg-cyan/5" : "border-border bg-surface hover:border-white/20",
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan/20 bg-cyan/10 text-cyan">
          <UploadCloud className="h-5 w-5" />
        </div>
        <p className="mt-4 font-display text-base font-semibold">
          Drop your Rekordbox XML export here
        </p>
        <p className="mt-1 text-sm text-muted">or click to browse — .xml files only</p>

        <input
          ref={inputRef}
          type="file"
          accept=".xml,text/xml,application/xml"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-500/25 bg-red-500/10 p-3 text-sm text-red-300">
          <FileWarning className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <p className="mt-4 text-center text-xs text-muted-2">
        In Rekordbox: File → Export Collection in xml format. Nothing is uploaded to a
        server — this file is parsed entirely in your browser.
      </p>
    </div>
  );
}
