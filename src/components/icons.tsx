import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 20, strokeWidth = 1.75, ...rest }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...rest,
  };
}

export function IconBell(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M6 8a6 6 0 1 1 12 0c0 4 1.5 5.5 2 6.5H4c.5-1 2-2.5 2-6.5Z" />
      <path d="M10 18a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function IconCalendar(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4" />
    </svg>
  );
}

export function IconGraduation(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M2 10l10-5 10 5-10 5-10-5Z" />
      <path d="M6 12v4c0 1.5 3 3 6 3s6-1.5 6-3v-4" />
    </svg>
  );
}

export function IconChat(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4V6Z" />
    </svg>
  );
}

export function IconUsers(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2 20c0-3 3-5 7-5s7 2 7 5" />
      <circle cx="17" cy="7" r="2.5" />
      <path d="M22 18c0-2-2-3.5-5-3.5" />
    </svg>
  );
}

export function IconBook(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 5a2 2 0 0 1 2-2h10v16H6a2 2 0 0 0-2 2V5Z" />
      <path d="M16 3a2 2 0 0 1 2 2v16" />
    </svg>
  );
}

export function IconHome(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-5h4v5" />
    </svg>
  );
}

export function IconMenu(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function IconClose(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function IconCheck(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 12l5 5 11-12" />
    </svg>
  );
}

export function IconCheckCircle(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12l3 3 5-6" />
    </svg>
  );
}

export function IconClock(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function IconMapPin(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 22s7-7 7-13a7 7 0 1 0-14 0c0 6 7 13 7 13Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

export function IconChevronRight(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function IconChevronLeft(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

export function IconChevronDown(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function IconArrowRight(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconSparkle(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z" />
    </svg>
  );
}

export function IconSearch(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

export function IconSend(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 12 21 4l-8 17-2-8-7-1Z" />
    </svg>
  );
}

export function IconPlus(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconAlert(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 3l10 17H2L12 3Z" />
      <path d="M12 10v4M12 17h0" />
    </svg>
  );
}

export function IconTarget(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" />
    </svg>
  );
}

export function IconWrench(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M14 6a4 4 0 0 0 5 5l-9 9a2 2 0 0 1-3-3l9-9a4 4 0 0 0-2-4l-2 2 2 2-2 2-2-2 2-2a4 4 0 0 0 4 0Z" />
    </svg>
  );
}

export function IconHeart(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10Z" />
    </svg>
  );
}

export function IconMoney(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="3" />
      <path d="M7 9v6M17 9v6" />
    </svg>
  );
}

export function IconGlobe(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18" />
    </svg>
  );
}

export function IconPencil(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 20h4l11-11-4-4L4 16v4Z" />
      <path d="m13 6 4 4" />
    </svg>
  );
}

export function IconInfo(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h0" />
    </svg>
  );
}

export function IconMessage(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M21 11a8 8 0 1 1-3-6l3-2-1 4 1 4Z" />
    </svg>
  );
}

export function IconLightbulb(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-4 10.5c1 1 1.5 2 1.5 3.5h5c0-1.5.5-2.5 1.5-3.5A6 6 0 0 0 12 3Z" />
    </svg>
  );
}

export const RESOURCE_ICONS = {
  book: IconBook,
  wrench: IconWrench,
  target: IconTarget,
  globe: IconGlobe,
  heart: IconHeart,
  money: IconMoney,
  pencil: IconPencil,
  graduation: IconGraduation,
};
