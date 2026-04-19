"use client";

import { useEffect, useState, type CSSProperties } from "react";

type Props = {
  percent: number;
  size?: number;
  stroke?: number;
  color?: string;
  trackColor?: string;
  label?: string;
  /** Show a count-up animation on the numeric percentage. */
  animateNumber?: boolean;
  /** Animate the ring stroke on mount. */
  animateStroke?: boolean;
};

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function useCountUp(target: number, enabled: boolean, duration = 900) {
  // If disabled, display the target immediately via useState initializer.
  // If enabled, start at 0 and let rAF animate up to target.
  const [value, setValue] = useState(enabled ? 0 : target);

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // setValue inside rAF callback is asynchronous relative to the effect
      // body, so it doesn't trigger the "setState in effect" lint rule.
      setValue(target * easeOutCubic(t));
      if (t < 1) {
        raf = requestAnimationFrame(step);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, enabled, duration]);

  return Math.round(value);
}

export function ProgressRing({
  percent,
  size = 112,
  stroke = 10,
  color = "#CBB983",
  trackColor = "#f3f4f6",
  label = "complete",
  animateNumber = true,
  animateStroke = true,
}: Props) {
  const clamped = Math.max(0, Math.min(100, percent));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference * (1 - clamped / 100);

  const display = useCountUp(clamped, animateNumber);

  const ringStyle: CSSProperties = animateStroke
    ? ({
        ["--ring-circumference" as const]: String(circumference),
        ["--ring-target" as const]: String(targetOffset),
      } as CSSProperties)
    : {};

  const numberSize = Math.round(size * (size >= 160 ? 0.22 : 0.2));
  const labelSize = Math.round(size * (size >= 160 ? 0.075 : 0.09));

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${clamped}% ${label}`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={targetOffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className={animateStroke ? "animate-draw-ring" : undefined}
          style={ringStyle}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-semibold text-gray-900 tabular-nums"
          style={{ fontSize: numberSize, lineHeight: 1 }}
        >
          {display}%
        </span>
        <span
          className="text-gray-500 font-medium mt-0.5"
          style={{ fontSize: labelSize }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
