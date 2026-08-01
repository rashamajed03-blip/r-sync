"use client";

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export function SortSelect<T extends string>({
  value,
  onChange,
  labels,
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  labels: Record<T, string>;
  className?: string;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as T)}>
      <SelectTrigger className={className ?? "w-44"}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(labels) as T[]).map((key) => (
          <SelectItem key={key} value={key}>
            {labels[key]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
