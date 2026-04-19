import type { Advisor } from "@/lib/mockData";

type AccentKey = Advisor["accent"] | "neutral";

const ACCENT_STYLES: Record<AccentKey, { bg: string; text: string }> = {
  gold: { bg: "rgba(203, 185, 131, 0.22)", text: "#8a7a44" },
  blue: { bg: "rgba(96, 165, 250, 0.22)", text: "#2563eb" },
  green: { bg: "rgba(74, 222, 128, 0.22)", text: "#166534" },
  purple: { bg: "rgba(167, 139, 250, 0.22)", text: "#6d28d9" },
  neutral: { bg: "#e5e7eb", text: "#374151" },
};

export function initialsFromName(name: string) {
  const parts = name
    .replace(/^Dr\.?\s+/i, "")
    .trim()
    .split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({
  name,
  accent = "neutral",
  size = 36,
  className = "",
}: {
  name: string;
  accent?: AccentKey;
  size?: number;
  className?: string;
}) {
  const style = ACCENT_STYLES[accent] ?? ACCENT_STYLES.neutral;
  const fontSize = Math.round(size * 0.4);
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full font-semibold shrink-0 select-none ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: style.bg,
        color: style.text,
        fontSize,
      }}
      aria-hidden
    >
      {initialsFromName(name)}
    </div>
  );
}
