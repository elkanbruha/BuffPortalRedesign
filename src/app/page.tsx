"use client";

import { useState } from "react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const HOURS = Array.from({ length: 24 }, (_, i) => {
  const h = i % 12 || 12;
  const ampm = i < 12 ? "AM" : "PM";
  return `${h}:00 ${ampm}`;
});

function getStartOfWeek(date: Date) {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-3 bg-black border-b border-gray-800 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded" style={{ backgroundColor: "#CBB983" }} />
          <span className="text-lg font-semibold text-white">Logo</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="px-4 py-2 text-sm font-medium text-gray-300 rounded hover:bg-gray-900">
            Home
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-300 rounded hover:bg-gray-900">
            Settings
          </button>
          <button className="px-4 py-2 text-sm font-medium text-red-400 rounded hover:bg-gray-900">
            Log Out
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="flex flex-1 p-6 gap-6">
        {/* Left Info Panel */}
        <aside className="w-72 shrink-0 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Information</h2>

          <div className="space-y-4">
            <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-4">
              <h3 className="text-sm font-medium text-gray-600 mb-1">Upcoming Events</h3>
              <p className="text-sm text-gray-400">No events scheduled</p>
            </div>

            <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-4">
              <h3 className="text-sm font-medium text-gray-600 mb-1">Reminders</h3>
              <p className="text-sm text-gray-400">No reminders</p>
            </div>

            <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-4">
              <h3 className="text-sm font-medium text-gray-600 mb-1">Quick Stats</h3>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tasks</span>
                  <span className="font-medium text-gray-700">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Completed</span>
                  <span className="font-medium text-gray-700">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Pending</span>
                  <span className="font-medium text-gray-700">0</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Calendar - Week View */}
        <main className="flex-1 rounded-lg border border-gray-200 bg-white p-5 shadow-sm flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={prevWeek}
                className="px-3 py-1 text-sm font-medium text-gray-600 rounded hover:bg-gray-100"
              >
                &larr; Prev
              </button>
              <button
                onClick={goToToday}
                className="px-3 py-1 text-sm font-medium rounded hover:opacity-80"
                style={{ color: "#CBB983" }}
              >
                Today
              </button>
              <button
                onClick={nextWeek}
                className="px-3 py-1 text-sm font-medium text-gray-600 rounded hover:bg-gray-100"
              >
                Next &rarr;
              </button>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              {formatWeekRange(weekStart)}
            </h2>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-[60px_repeat(7,1fr)]">
            <div className="border border-gray-200 bg-gray-50" />
            {weekDays.map((date, i) => (
              <div
                key={i}
                className="py-2 text-center border border-gray-200"
                style={{ backgroundColor: isToday(date) ? "rgba(203, 185, 131, 0.15)" : "#f9fafb" }}
              >
                <div className="text-xs font-semibold uppercase text-gray-500">
                  {DAYS[date.getDay()]}
                </div>
                <div
                  className="text-lg font-semibold"
                  style={{ color: isToday(date) ? "#CBB983" : "#1f2937" }}
                >
                  {date.getDate()}
                </div>
              </div>
            ))}
          </div>

          {/* Time grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-[60px_repeat(7,1fr)]">
              {HOURS.map((hour, hi) => (
                <div key={`row-${hi}`} className="contents">
                  <div className="h-14 border border-gray-200 px-1 py-1 text-right text-xs text-gray-400 bg-gray-50">
                    {hour}
                  </div>
                  {weekDays.map((date, di) => (
                    <div
                      key={`cell-${hi}-${di}`}
                      className="h-14 border border-gray-200 hover:bg-gray-50 cursor-pointer"
                      style={{ backgroundColor: isToday(date) ? "rgba(203, 185, 131, 0.08)" : undefined }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
