"use client";

const OUTER = ["1B", "2B", "3B", "4B", "5B", "6B", "7B", "8B", "9B", "10B", "11B", "12B"];
const INNER = ["1A", "2A", "3A", "4A", "5A", "6A", "7A", "8A", "9A", "10A", "11A", "12A"];

function ringLabels(labels: string[], radius: number, size: number) {
  const center = size / 2;
  return labels.map((label, i) => {
    const angle = (i / labels.length) * 2 * Math.PI - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return (
      <text
        key={label}
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-current font-mono"
        fontSize={size * 0.026}
      >
        {label}
      </text>
    );
  });
}

/** Ambient, decorative — aria-hidden. Two counter-rotating rings evoke a turntable platter as much as a mixing wheel. */
export function CamelotWheel({ size = 640 }: { size?: number }) {
  const c = size / 2;
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      aria-hidden="true"
      className="pointer-events-none select-none"
    >
      <defs>
        <radialGradient id="wheelFade" cx="50%" cy="50%" r="50%">
          <stop offset="55%" stopColor="#22D3EE" stopOpacity="0" />
          <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.05" />
        </radialGradient>
      </defs>

      <circle cx={c} cy={c} r={size * 0.49} fill="url(#wheelFade)" />

      <g className="origin-center animate-spin-slow text-cyan/40">
        <circle
          cx={c}
          cy={c}
          r={size * 0.46}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.25"
          strokeWidth="1"
        />
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
          return (
            <line
              key={i}
              x1={c + size * 0.34 * Math.cos(angle)}
              y1={c + size * 0.34 * Math.sin(angle)}
              x2={c + size * 0.46 * Math.cos(angle)}
              y2={c + size * 0.46 * Math.sin(angle)}
              stroke="currentColor"
              strokeOpacity="0.2"
              strokeWidth="1"
            />
          );
        })}
        <g className="text-cyan-soft/70">{ringLabels(OUTER, size * 0.4, size)}</g>
      </g>

      <g className="origin-center animate-spin-slow-reverse text-purple/40">
        <circle
          cx={c}
          cy={c}
          r={size * 0.3}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.3"
          strokeWidth="1"
        />
        <g className="text-purple-soft/70">{ringLabels(INNER, size * 0.24, size)}</g>
      </g>

      <circle cx={c} cy={c} r={size * 0.1} fill="none" stroke="#262626" strokeWidth="1" />
    </svg>
  );
}
