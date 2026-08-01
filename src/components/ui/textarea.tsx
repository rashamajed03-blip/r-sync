import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground",
          "placeholder:text-muted-2 transition-colors",
          "focus-visible:border-cyan/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/20",
          "disabled:cursor-not-allowed disabled:opacity-40",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
