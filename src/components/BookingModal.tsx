"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { advisorById } from "@/lib/mockData";
import { DAYS_LONG, MONTHS, formatHour } from "@/lib/dateUtils";
import { Avatar } from "./Avatar";
import {
  IconCalendar,
  IconCheck,
  IconClock,
  IconClose,
  IconMapPin,
} from "./icons";

export function BookingModal() {
  const { bookingDraft, setBookingDraft, bookAppointment } = useAppStore();
  const [topic, setTopic] = useState("");
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setBookingDraft(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setBookingDraft]);

  // Component is mounted by ModalHost only when bookingDraft is non-null,
  // so state resets naturally with each mount and no effect-based reset is needed.
  if (!bookingDraft) return null;
  const { slot, date } = bookingDraft;
  const advisor = advisorById(slot.advisorId);
  const isGeneral = slot.advisorId === "adv-general";
  const dateLong = `${DAYS_LONG[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}`;

  const confirm = () => {
    setConfirming(true);
    // Keep UI responsive — no real latency since we're local
    setTimeout(() => {
      bookAppointment(slot, date, topic.trim() || undefined);
      setBookingDraft(null);
    }, 120);
  };

  return (
    <div className="fixed inset-0 z-[55] flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-black/40 animate-fade-in-up"
        onClick={() => setBookingDraft(null)}
      />
      <div
        className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-xl animate-scale-in overflow-hidden"
      >
        <header
          className="px-5 py-4 border-b border-gray-100 flex items-start gap-3"
          style={{ backgroundColor: "var(--color-gold-soft)" }}
        >
          <div className="flex-1">
            <p className="text-[11px] font-semibold tracking-wide uppercase" style={{ color: "#8a7a44" }}>
              Confirm appointment
            </p>
            <h2 className="text-lg font-semibold text-gray-900 mt-0.5">
              {isGeneral ? "General Advising" : advisor?.name ?? "Advisor"}
            </h2>
            {!isGeneral && advisor && (
              <p className="text-xs text-gray-600">{advisor.title}</p>
            )}
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setBookingDraft(null)}
            className="inline-flex items-center justify-center h-8 w-8 rounded-md text-gray-500 hover:text-gray-800 hover:bg-white/50"
          >
            <IconClose size={18} />
          </button>
        </header>

        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            {!isGeneral && advisor && (
              <Avatar name={advisor.name} accent={advisor.accent} size={40} />
            )}
            <div className="flex-1 min-w-0">
              <ul className="text-sm text-gray-700 space-y-1">
                <li className="flex items-center gap-2">
                  <IconCalendar size={14} className="text-gray-400" />
                  <span>{dateLong}</span>
                </li>
                <li className="flex items-center gap-2">
                  <IconClock size={14} className="text-gray-400" />
                  <span>
                    {formatHour(slot.startHour)} – {formatHour(slot.endHour)}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <IconMapPin size={14} className="text-gray-400" />
                  <span>
                    {slot.type === "in-person"
                      ? advisor?.officeLocation ?? "In-person"
                      : "Virtual (Zoom link sent by email)"}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <label
              htmlFor="booking-topic"
              className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1"
            >
              What do you want to talk about? <span className="text-gray-400 font-normal lowercase">(optional)</span>
            </label>
            <input
              id="booking-topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Fall 2026 registration, ML electives, change of major"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Sharing a topic lets your advisor come prepared.
            </p>
          </div>

          <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-xs text-gray-600">
            We&apos;ll send a confirmation email and a calendar invite within a minute.
            You can reschedule up to 2 hours before the appointment.
          </div>
        </div>

        <footer className="px-5 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setBookingDraft(null)}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirm}
            disabled={confirming}
            className="btn-press inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-black transition-opacity disabled:opacity-60"
            style={{ backgroundColor: "#CBB983" }}
          >
            <IconCheck size={16} />
            {confirming ? "Booking…" : "Confirm"}
          </button>
        </footer>
      </div>
    </div>
  );
}
