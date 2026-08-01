import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-border bg-surface-raised text-muted",
        cyan: "border-cyan/25 bg-cyan/10 text-cyan",
        purple: "border-purple/25 bg-purple/10 text-purple",
        outline: "border-border text-foreground",
        success: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
        warning: "border-amber-500/25 bg-amber-500/10 text-amber-400",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
