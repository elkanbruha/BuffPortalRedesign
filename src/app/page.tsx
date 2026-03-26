"use client";

import { useState } from "react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function Home() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const calendarCells = [];
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(<div key={`empty-${i}`} className="h-24 border border-gray-200" />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday =
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear();
    calendarCells.push(
      <div
        key={day}
        className={`h-24 border border-gray-200 p-2 text-sm hover:bg-gray-50 cursor-pointer ${
          isToday ? "bg-blue-50 font-bold" : ""
        }`}
      >
        <span
          className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${
            isToday ? "bg-blue-500 text-white" : "text-gray-700"
          }`}
        >
          {day}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-blue-500" />
          <span className="text-lg font-semibold text-gray-800">Logo</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="px-4 py-2 text-sm font-medium text-gray-600 rounded hover:bg-gray-100">
            Home
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 rounded hover:bg-gray-100">
            Settings
          </button>
          <button className="px-4 py-2 text-sm font-medium text-red-500 rounded hover:bg-red-50">
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

        {/* Calendar */}
        <main className="flex-1 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="px-3 py-1 text-sm font-medium text-gray-600 rounded hover:bg-gray-100"
            >
              &larr; Prev
            </button>
            <h2 className="text-xl font-semibold text-gray-800">
              {MONTHS[currentMonth]} {currentYear}
            </h2>
            <button
              onClick={nextMonth}
              className="px-3 py-1 text-sm font-medium text-gray-600 rounded hover:bg-gray-100"
            >
              Next &rarr;
            </button>
          </div>

          <div className="grid grid-cols-7">
            {DAYS.map((day) => (
              <div
                key={day}
                className="py-2 text-center text-xs font-semibold uppercase text-gray-500 border border-gray-200 bg-gray-50"
              >
                {day}
              </div>
            ))}
            {calendarCells}
          </div>
        </main>
      </div>
    </div>
  );
}
