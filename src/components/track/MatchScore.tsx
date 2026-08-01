"use client";

import { cn } from "@/lib/utils";

function scoreColor(score: number) {
  if (score >= 90) return "#22D3EE"; // cyan — excellent
  if (score >= 75) return "#A855F7"; // purple — strong
  return "#8A8A93"; // muted — usable but not ideal
}

export function MatchScore({
  score,
  size = 56,
  className,
}: {
  score: number;
  size?: number;
  className?: string;
}) {
  const stroke = size * 0.09;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);
  const color = scoreColor(score);

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#262626"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            filter: `drop-shadow(0 0 6px ${color}66)`,
          }}
        />
      </svg>
      <span
        className="absolute font-mono font-semibold"
        style={{ fontSize: size * 0.24, color }}
      >
        {score}
      </span>
    </div>
  );
}
