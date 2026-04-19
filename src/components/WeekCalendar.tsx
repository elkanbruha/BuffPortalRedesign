"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DAYS_SHORT,
  HOURS,
  addDays,
  formatHour,
  formatHourLabel,
  formatWeekRange,
  getStartOfWeek,
  isPastDay,
  isSameDay,
  localIsoDate,
} from "@/lib/dateUtils";
import {
  ADVISORS,
  AVAILABILITY,
  advisorById,
  type AvailabilitySlot,
} from "@/lib/mockData";
import { useAppStore } from "@/lib/store";
import { IconChevronLeft, IconChevronRight, IconCheckCircle } from "./icons";

type Props = {
  advisorId?: string;
  onSlotSelect?: (slot: AvailabilitySlot, date: Date) => void;
  compact?: boolean;
};

function hashSlotForDate(slotId: string, date: Date) {
  // Deterministic key for a recurring slot on a specific date
  return `${slotId}:${localIsoDate(date)}`;
}

export function WeekCalendar({ advisorId, onSlotSelect, compact = false }: Props) {
  const { appointments, setBookingDraft } = useAppStore();
  const today = useMemo(() => new Date(), []);
  const [weekStart, setWeekStart] = useState(() => getStartOfWeek(today));
  const [mobileStart, setMobileStart] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const displayStart = isMobile ? mobileStart : weekStart;
  const dayCount = isMobile ? 5 : 7;

  const visibleDays = useMemo(
    () =>
      Array.from({ length: dayCount }, (_, i) => addDays(displayStart, i)),
    [displayStart, dayCount],
  );

  const filteredAvailability = useMemo(() => {
    return advisorId
      ? AVAILABILITY.filter((s) => s.advisorId === advisorId)
      : AVAILABILITY;
  }, [advisorId]);

  const bookedKeys = useMemo(() => {
    const s = new Set<string>();
    for (const a of appointments) {
      if (a.status === "cancelled") continue;
      // Key by advisor + date + start hour
      s.add(`${a.advisorId}:${a.date}:${a.startHour}`);
    }
    return s;
  }, [appointments]);

  const prev = () => {
    if (isMobile) setMobileStart((d) => addDays(d, -5));
    else setWeekStart((d) => addDays(d, -7));
  };
  const next = () => {
    if (isMobile) setMobileStart((d) => addDays(d, 5));
    else setWeekStart((d) => addDays(d, 7));
  };
  const goToday = () => {
    setWeekStart(getStartOfWeek(today));
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    setMobileStart(d);
  };

  const handleSlotClick = (slot: AvailabilitySlot, date: Date) => {
    if (isPastDay(date, today)) return;
    if (onSlotSelect) {
      onSlotSelect(slot, date);
    } else {
      setBookingDraft({ slot, date });
    }
  };

  return (
    <div className="flex-1 min-w-0 rounded-2xl border border-gray-200 bg-white p-3 lg:p-5 shadow-md flex flex-col overflow-hidden">
      {/* Header: nav + range */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={prev}
            aria-label="Previous week"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <IconChevronLeft size={16} /> Prev
          </button>
          <button
            onClick={goToday}
            className="px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors"
            style={{ color: "#8a7a44", backgroundColor: "var(--color-gold-soft)" }}
          >
            Today
          </button>
          <button
            onClick={next}
            aria-label="Next week"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Next <IconChevronRight size={16} />
          </button>
        </div>
        <h2 className="text-sm sm:text-lg font-semibold text-gray-800">
          {formatWeekRange(displayStart, dayCount)}
        </h2>
      </div>

      {/* Calendar grid */}
      <div className="flex-1 flex flex-col overflow-hidden rounded-xl border border-gray-200">
        {/* Day headers */}
        <div
          className="grid bg-white"
          style={{ gridTemplateColumns: `40px repeat(${dayCount}, minmax(0,1fr))` }}
        >
          <div className="border-b border-r border-gray-200 bg-gray-50 rounded-tl-xl" />
          {visibleDays.map((date, i) => {
            const dayName = DAYS_SHORT[date.getDay()];
            const past = isPastDay(date, today);
            const todayFlag = isSameDay(date, today);
            return (
              <div
                key={i}
                className={`py-2 sm:py-3 text-center border-b border-r border-gray-200 ${
                  i === dayCount - 1 ? "rounded-tr-xl" : ""
                } ${past ? "opacity-50" : ""}`}
                style={{
                  backgroundColor: todayFlag
                    ? "var(--color-gold-soft)"
                    : "#f9fafb",
                }}
              >
                <div className="text-[10px] sm:text-xs font-semibold uppercase text-gray-400 tracking-wide">
                  {dayName.charAt(0)}
                  <span className="hidden sm:inline">{dayName.slice(1)}</span>
                </div>
                <div
                  className="text-sm sm:text-lg font-semibold mt-0.5"
                  style={{
                    color: todayFlag
                      ? "#8a7a44"
                      : past
                        ? "#9ca3af"
                        : "#1f2937",
                  }}
                >
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Time grid */}
        <div className="flex-1 overflow-y-auto subtle-scroll">
          <div className="flex">
            {/* Time labels column */}
            <div className="w-[40px] shrink-0">
              {HOURS.map((h, hi) => (
                <div
                  key={hi}
                  className="h-12 sm:h-14 border-b border-r border-gray-100 px-1 py-1 text-right text-[10px] sm:text-xs text-gray-400 bg-gray-50/50"
                >
                  {formatHourLabel(h)}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {visibleDays.map((date, di) => {
              const past = isPastDay(date, today);
              const todayFlag = isSameDay(date, today);
              const daySlots = filteredAvailability.filter(
                (s) => s.day === date.getDay(),
              );
              return (
                <div key={di} className="flex-1 relative min-w-0">
                  {/* background hour cells */}
                  {HOURS.map((_, hi) => (
                    <div
                      key={hi}
                      className={`h-12 sm:h-14 border-b border-r border-gray-100 transition-colors ${
                        past ? "bg-gray-100/60" : ""
                      }`}
                      style={{
                        backgroundColor:
                          !past && todayFlag ? "var(--color-gold-wash)" : undefined,
                      }}
                    />
                  ))}

                  {/* availability blocks */}
                  {daySlots.map((slot) => {
                    const advisor = advisorById(slot.advisorId);
                    const topHour = slot.startHour - HOURS[0];
                    const spanHours = slot.endHour - slot.startHour;
                    const key = hashSlotForDate(slot.id, date);
                    const bookedKey = `${slot.advisorId}:${localIsoDate(date)}:${slot.startHour}`;
                    const booked = bookedKeys.has(bookedKey);
                    const isGeneral = slot.advisorId === "adv-general";
                    const accent =
                      slot.type === "in-person"
                        ? { bg: "rgba(203,185,131,0.22)", border: "#CBB983" }
                        : { bg: "rgba(96,165,250,0.22)", border: "#60a5fa" };
                    return (
                      <button
                        type="button"
                        key={key}
                        disabled={past}
                        onClick={() => handleSlotClick(slot, date)}
                        className={`absolute left-0.5 right-0.5 rounded-md flex flex-col items-start px-1.5 py-1 text-left transition-transform ${
                          past
                            ? "opacity-40 cursor-not-allowed"
                            : booked
                              ? "cursor-default"
                              : "cursor-pointer hover:translate-y-[-1px] hover:shadow-md"
                        }`}
                        style={{
                          top: `calc(${topHour} * var(--row-h))`,
                          height: `calc(${spanHours} * var(--row-h) - 2px)`,
                          backgroundColor: past
                            ? "rgba(156,163,175,0.18)"
                            : booked
                              ? "rgba(34,197,94,0.14)"
                              : accent.bg,
                          borderLeft: `3px solid ${
                            past
                              ? "#9ca3af"
                              : booked
                                ? "#16a34a"
                                : accent.border
                          }`,
                        }}
                        aria-label={`${advisor?.name ?? "Advisor"} · ${slot.type} · ${formatHour(slot.startHour)} to ${formatHour(slot.endHour)}`}
                      >
                        <div
                          className={`text-[9px] sm:text-[11px] font-semibold truncate max-w-full ${
                            past ? "text-gray-400" : "text-gray-800"
                          }`}
                        >
                          {isGeneral ? "General Advising" : advisor?.name ?? "Advisor"}
                        </div>
                        <div
                          className={`text-[8px] sm:text-[10px] truncate max-w-full ${
                            past ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {booked ? (
                            <span className="inline-flex items-center gap-0.5 font-semibold text-green-700">
                              <IconCheckCircle size={10} /> Booked
                            </span>
                          ) : (
                            <>
                              {slot.type === "in-person" ? "In-Person" : "Virtual"}{" "}
                              · {formatHour(slot.startHour)}–{formatHour(slot.endHour)}
                            </>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {!compact && (
        <p className="mt-3 text-[11px] text-gray-400">
          Click any available slot to book with the advisor — or open{" "}
          {ADVISORS.length} advisor profiles from the Advisors tab.
        </p>
      )}
    </div>
  );
}
