"use client";

import { useMemo } from "react";
import {
  AVAILABILITY,
  advisorById,
  type AvailabilitySlot,
} from "@/lib/mockData";
import { useAppStore } from "@/lib/store";
import {
  MONTHS_SHORT,
  DAYS_SHORT,
  addDays,
  formatHour,
  localIsoDate,
} from "@/lib/dateUtils";
import { Avatar } from "./Avatar";

type SlotWithDate = AvailabilitySlot & { date: Date };

type Props = {
  advisorId?: string;
  limit?: number;
  onSlotSelect?: (slot: AvailabilitySlot, date: Date) => void;
};

export function UpcomingSlotsList({ advisorId, limit = 5, onSlotSelect }: Props) {
  const { appointments, setBookingDraft } = useAppStore();
  const today = useMemo(() => new Date(), []);

  const upcoming: SlotWithDate[] = useMemo(() => {
    const pool = advisorId
      ? AVAILABILITY.filter((s) => s.advisorId === advisorId)
      : AVAILABILITY;

    const result: SlotWithDate[] = [];
    for (let i = 0; i < 14 && result.length < limit * 3; i++) {
      const date = addDays(today, i);
      for (const slot of pool) {
        if (slot.day !== date.getDay()) continue;
        const slotDate = new Date(date);
        slotDate.setHours(slot.startHour, 0, 0, 0);
        if (slotDate < today) continue;
        result.push({ ...slot, date });
      }
    }

    // Remove any slots that are already booked
    const bookedSet = new Set(
      appointments
        .filter((a) => a.status !== "cancelled")
        .map((a) => `${a.advisorId}:${a.date}:${a.startHour}`),
    );
    const filtered = result.filter((s) => {
      const key = `${s.advisorId}:${localIsoDate(s.date)}:${s.startHour}`;
      return !bookedSet.has(key);
    });

    return filtered.slice(0, limit);
  }, [advisorId, limit, today, appointments]);

  const handleClick = (slot: AvailabilitySlot, date: Date) => {
    if (onSlotSelect) onSlotSelect(slot, date);
    else setBookingDraft({ slot, date });
  };

  if (upcoming.length === 0) {
    return (
      <p className="text-sm text-gray-400">No upcoming availability in the next two weeks.</p>
    );
  }

  return (
    <div className="space-y-2">
      {upcoming.map((s) => {
        const advisor = advisorById(s.advisorId);
        const isGeneral = s.advisorId === "adv-general";
        return (
          <button
            key={`${s.id}:${localIsoDate(s.date)}`}
            type="button"
            onClick={() => handleClick(s, s.date)}
            className="w-full group text-left rounded-lg border border-gray-200 bg-white p-3 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer flex items-start gap-3"
          >
            {!isGeneral && advisor && (
              <Avatar
                name={advisor.name}
                accent={advisor.accent}
                size={32}
              />
            )}
            {isGeneral && (
              <div
                className="inline-flex items-center justify-center rounded-full h-8 w-8 text-[10px] font-semibold text-purple-700 shrink-0"
                style={{ backgroundColor: "rgba(167, 139, 250, 0.22)" }}
              >
                GA
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-gray-800 truncate">
                  {isGeneral ? "General Advising" : advisor?.name ?? "Advisor"}
                </span>
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
                    s.type === "in-person"
                      ? "text-yellow-800 bg-yellow-100"
                      : "text-blue-800 bg-blue-100"
                  }`}
                >
                  {s.type === "in-person" ? "In-Person" : "Virtual"}
                </span>
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                {DAYS_SHORT[s.date.getDay()]}, {MONTHS_SHORT[s.date.getMonth()]}{" "}
                {s.date.getDate()} · {formatHour(s.startHour)}–
                {formatHour(s.endHour)}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
