export const DAYS_LONG = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const HOURS = Array.from({ length: 15 }, (_, i) => i + 6); // 6 AM → 8 PM inclusive start

export function formatHour(h: number) {
  const hr = h % 12 || 12;
  const ampm = h < 12 || h === 24 ? "AM" : "PM";
  return `${hr} ${ampm}`;
}

export function formatHourLabel(h: number) {
  const hr = h % 12 || 12;
  const ampm = h < 12 ? "AM" : "PM";
  return `${hr}:00 ${ampm}`;
}

export function getStartOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function formatWeekRange(start: Date, days = 7) {
  const end = new Date(start);
  end.setDate(end.getDate() + days - 1);
  const startMonth = MONTHS[start.getMonth()];
  const endMonth = MONTHS[end.getMonth()];
  if (start.getMonth() === end.getMonth()) {
    return `${startMonth} ${start.getDate()} – ${end.getDate()}, ${start.getFullYear()}`;
  }
  return `${startMonth} ${start.getDate()} – ${endMonth} ${end.getDate()}, ${end.getFullYear()}`;
}

export function isSameDay(a: Date, b: Date) {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

export function isPastDay(date: Date, today: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const t = new Date(today);
  t.setHours(0, 0, 0, 0);
  return d < t;
}

export function formatDateShort(date: Date) {
  return `${DAYS_SHORT[date.getDay()]}, ${MONTHS_SHORT[date.getMonth()]} ${date.getDate()}`;
}

export function formatDateLong(date: Date) {
  return `${DAYS_LONG[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

// yyyy-mm-dd from a Date using the browser's local time (unlike .toISOString()
// which uses UTC and can drift one day off in non-UTC timezones).
export function localIsoDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Parse a yyyy-mm-dd date string into a Date at local midnight. Plain
// `new Date("2026-04-22")` parses as UTC midnight, which shifts to the previous
// day for browsers west of UTC.
export function parseLocalIsoDate(iso: string) {
  return new Date(iso + (iso.includes("T") ? "" : "T00:00:00"));
}

export function daysUntil(target: Date, from: Date = new Date()) {
  const t = new Date(target);
  t.setHours(0, 0, 0, 0);
  const f = new Date(from);
  f.setHours(0, 0, 0, 0);
  const ms = t.getTime() - f.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function relativeDay(target: Date, from: Date = new Date()) {
  const d = daysUntil(target, from);
  if (d === 0) return "Today";
  if (d === 1) return "Tomorrow";
  if (d === -1) return "Yesterday";
  if (d > 0 && d < 7) return `in ${d} days`;
  if (d < 0 && d > -7) return `${Math.abs(d)} days ago`;
  return formatDateShort(target);
}

export function formatTimeRange(startHour: number, endHour: number) {
  return `${formatHour(startHour)} – ${formatHour(endHour)}`;
}
