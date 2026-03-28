"use client";

import { useState } from "react";
import Image from "next/image";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const HOURS = Array.from({ length: 15 }, (_, i) => {
  const hour = i + 6; // 6 AM to 8 PM
  const h = hour % 12 || 12;
  const ampm = hour < 12 ? "AM" : "PM";
  return `${h}:00 ${ampm}`;
});

// Mock availability slots keyed by dayOfWeek (0=Sun..6=Sat)
// startHour/endHour are 24h values, type is "in-person" or "virtual"
const AVAILABILITY: { day: number; startHour: number; endHour: number; type: "in-person" | "virtual"; advisor: string }[] = [
  { day: 1, startHour: 9, endHour: 11, type: "in-person", advisor: "Dr. Martinez" },
  { day: 1, startHour: 13, endHour: 15, type: "virtual", advisor: "Dr. Martinez" },
  { day: 2, startHour: 10, endHour: 12, type: "virtual", advisor: "Sarah Kim" },
  { day: 2, startHour: 14, endHour: 16, type: "in-person", advisor: "Dr. Johnson" },
  { day: 3, startHour: 8, endHour: 10, type: "in-person", advisor: "Dr. Martinez" },
  { day: 3, startHour: 11, endHour: 13, type: "virtual", advisor: "Sarah Kim" },
  { day: 3, startHour: 15, endHour: 17, type: "in-person", advisor: "Dr. Johnson" },
  { day: 4, startHour: 9, endHour: 11, type: "virtual", advisor: "Sarah Kim" },
  { day: 4, startHour: 13, endHour: 15, type: "in-person", advisor: "Dr. Martinez" },
  { day: 5, startHour: 10, endHour: 12, type: "in-person", advisor: "Dr. Johnson" },
  { day: 5, startHour: 14, endHour: 16, type: "virtual", advisor: "Dr. Martinez" },
];

function getStartOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  // Shift so Monday=0: if Sunday (0), go back 6; otherwise go back (day-1)
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatWeekRange(start: Date) {
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const startMonth = MONTHS[start.getMonth()];
  const endMonth = MONTHS[end.getMonth()];
  if (start.getMonth() === end.getMonth()) {
    return `${startMonth} ${start.getDate()} – ${end.getDate()}, ${start.getFullYear()}`;
  }
  return `${startMonth} ${start.getDate()} – ${endMonth} ${end.getDate()}, ${end.getFullYear()}`;
}

function getSlotsForCell(dayOfWeek: number, hour: number) {
  return AVAILABILITY.filter(
    (s) => s.day === dayOfWeek && hour >= s.startHour && hour < s.endHour
  );
}

function formatHour(h: number) {
  const hr = h % 12 || 12;
  const ampm = h < 12 ? "AM" : "PM";
  return `${hr} ${ampm}`;
}

export default function Home() {
  const today = new Date();
  const [weekStart, setWeekStart] = useState(getStartOfWeek(today));

  const prevWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d);
  };

  const nextWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d);
  };

  const goToToday = () => {
    setWeekStart(getStartOfWeek(today));
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const isToday = (date: Date) =>
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  // Upcoming slots for the side panel (next 5 from today onward)
  const upcomingSlots = weekDays
    .flatMap((date, di) =>
      AVAILABILITY.filter((s) => s.day === date.getDay()).map((s) => ({
        ...s,
        date,
        dayIndex: di,
      }))
    )
    .filter((s) => {
      const slotDate = new Date(s.date);
      slotDate.setHours(s.startHour);
      return slotDate >= today;
    })
    .slice(0, 5);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 sm:px-6 py-3 bg-black border-b border-gray-800 shadow-sm">
        <div className="flex items-center gap-2">
          <Image src="/buffalo-logo.png" alt="CU Buffs Logo" width={36} height={36} className="h-8 w-8 sm:h-9 sm:w-9 object-contain" />
          <span className="text-base sm:text-lg font-semibold text-white">CU Buffs Advising</span>
        </div>
        <div className="flex items-center gap-0 sm:gap-1">
          <button className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-300 rounded hover:bg-gray-900">
            Home
          </button>
          <button className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-300 rounded hover:bg-gray-900">
            Settings
          </button>
          <button className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-red-400 rounded hover:bg-gray-900">
            Log Out
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="flex flex-col lg:flex-row flex-1 p-4 lg:p-6 gap-4 lg:gap-6">
        {/* Info Panel */}
        <aside className="w-full lg:w-72 shrink-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Schedule an Appointment</h2>

          <p className="text-sm text-gray-500 mb-5">
            Click on any available slot in the calendar to book a session with an advisor.
          </p>

          <div className="space-y-4">
            {/* Legend */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Availability Key</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "rgba(203, 185, 131, 0.7)" }} />
                  <span className="text-sm text-gray-600">In-Person</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-400" />
                  <span className="text-sm text-gray-600">Virtual</span>
                </div>
              </div>
            </div>

            {/* Upcoming availability */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Upcoming Availability</h3>
              {upcomingSlots.length > 0 ? (
                <div className="space-y-2">
                  {upcomingSlots.map((slot, i) => (
                    <button
                      key={i}
                      className="w-full text-left rounded-lg border border-gray-200 bg-white p-3 hover:shadow-sm transition-shadow cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-800">{slot.advisor}</span>
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                            slot.type === "in-person"
                              ? "text-yellow-800 bg-yellow-100"
                              : "text-blue-800 bg-blue-100"
                          }`}
                        >
                          {slot.type === "in-person" ? "In-Person" : "Virtual"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][slot.date.getDay()]}, {MONTHS[slot.date.getMonth()]} {slot.date.getDate()} &middot; {formatHour(slot.startHour)} – {formatHour(slot.endHour)}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No upcoming slots this week</p>
              )}
            </div>

            {/* CTA */}
            <button
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-black transition-colors hover:opacity-90"
              style={{ backgroundColor: "#CBB983" }}
            >
              Schedule Now
            </button>
          </div>
        </aside>

        {/* Calendar - Week View */}
        <main className="flex-1 min-w-0 rounded-2xl border border-gray-200 bg-white p-3 lg:p-5 shadow-md flex flex-col overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-2">
            <div className="flex items-center gap-1">
              <button
                onClick={prevWeek}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                &larr; Prev
              </button>
              <button
                onClick={goToToday}
                className="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
                style={{ color: "#CBB983", backgroundColor: "rgba(203, 185, 131, 0.1)" }}
              >
                Today
              </button>
              <button
                onClick={nextWeek}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Next &rarr;
              </button>
            </div>
            <h2 className="text-base sm:text-xl font-semibold text-gray-800">
              {formatWeekRange(weekStart)}
            </h2>
          </div>

          {/* Day headers + Time grid wrapped in rounded container */}
          <div className="flex-1 flex flex-col overflow-hidden rounded-xl border border-gray-200">
            {/* Day headers */}
            <div className="grid grid-cols-[40px_repeat(7,1fr)] sm:grid-cols-[60px_repeat(7,1fr)]">
              <div className="border-b border-r border-gray-200 bg-gray-50 rounded-tl-xl" />
              {weekDays.map((date, i) => (
                <div
                  key={i}
                  className={`py-2 sm:py-3 text-center border-b border-r border-gray-200 ${i === 6 ? "rounded-tr-xl" : ""}`}
                  style={{ backgroundColor: isToday(date) ? "rgba(203, 185, 131, 0.15)" : "#f9fafb" }}
                >
                  <div className="text-[10px] sm:text-xs font-semibold uppercase text-gray-400 tracking-wide">
                    {DAYS[i].charAt(0)}<span className="hidden sm:inline">{DAYS[i].slice(1)}</span>
                  </div>
                  <div
                    className="text-sm sm:text-lg font-semibold mt-0.5"
                    style={{ color: isToday(date) ? "#CBB983" : "#1f2937" }}
                  >
                    {date.getDate()}
                  </div>
                </div>
              ))}
            </div>

            {/* Time grid */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-[40px_repeat(7,1fr)] sm:grid-cols-[60px_repeat(7,1fr)]">
                {HOURS.map((hour, hi) => {
                  const currentHour = hi + 6;
                  return (
                    <div key={`row-${hi}`} className="contents">
                      <div className="h-12 sm:h-14 border-b border-r border-gray-100 px-1 py-1 text-right text-[10px] sm:text-xs text-gray-400 bg-gray-50/50">
                        {hour}
                      </div>
                      {weekDays.map((date, di) => {
                        const slots = getSlotsForCell(date.getDay(), currentHour);
                        const isStart = slots.length > 0 && slots[0].startHour === currentHour;
                        return (
                          <div
                            key={`cell-${hi}-${di}`}
                            className="h-12 sm:h-14 border-b border-r border-gray-100 relative cursor-pointer transition-colors hover:bg-gray-50"
                            style={{ backgroundColor: isToday(date) ? "rgba(203, 185, 131, 0.06)" : undefined }}
                          >
                            {slots.map((slot, si) => (
                              <div
                                key={si}
                                className={`absolute inset-x-0.5 inset-y-0 rounded-md flex items-start px-1 py-0.5 ${
                                  isStart ? "rounded-t-md" : ""
                                } ${
                                  slot.endHour === currentHour + 1 ? "rounded-b-md" : ""
                                }`}
                                style={{
                                  backgroundColor:
                                    slot.type === "in-person"
                                      ? "rgba(203, 185, 131, 0.25)"
                                      : "rgba(96, 165, 250, 0.25)",
                                  borderLeft: `3px solid ${
                                    slot.type === "in-person" ? "#CBB983" : "#60a5fa"
                                  }`,
                                }}
                              >
                                {isStart && (
                                  <div className="overflow-hidden">
                                    <div className="text-[9px] sm:text-[11px] font-semibold text-gray-800 truncate">
                                      {slot.advisor}
                                    </div>
                                    <div className="text-[8px] sm:text-[10px] text-gray-500 truncate">
                                      {slot.type === "in-person" ? "In-Person" : "Virtual"}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
