"use client";

import { useId } from "react";

interface SparklineProps {
  values: number[];
  color: string;
  /** Fill the area under the line with a fade of `color`. */
  area?: boolean;
  width?: number;
  height?: number;
  className?: string;
  /** Describe the trend for assistive tech; omit to hide it (decorative). */
  label?: string;
}

/**
 * Axis-free trend line. Deliberately minimal: a sparkline shows shape, not
 * values — the exact figure always sits next to it in text.
 */
export default function Sparkline({
  values,
  color,
  area = true,
  width = 120,
  height = 36,
  className,
  label,
}: SparklineProps) {
  const gradientId = useId();

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pad = 2;

  const points = values.map((value, i) => {
    const x = (i / (values.length - 1)) * width;
    const y = height - pad - ((value - min) / span) * (height - pad * 2);
    return `${x},${y}`;
  });

  const line = `M ${points.join(" L ")}`;
  const fill = `${line} L ${width},${height} L 0,${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      preserveAspectRatio="none"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {area && (
        <>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.45" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={fill} fill={`url(#${gradientId})`} />
        </>
      )}
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
