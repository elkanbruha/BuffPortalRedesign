"use client";

import Link from "next/link";
import { WeekCalendar } from "@/components/WeekCalendar";
import { UpcomingSlotsList } from "@/components/UpcomingSlotsList";
import { useAppStore } from "@/lib/store";
import { advisorById } from "@/lib/mockData";
import { Avatar } from "@/components/Avatar";
import {
  IconArrowRight,
  IconCalendar,
  IconCheckCircle,
  IconClock,
  IconInfo,
} from "@/components/icons";
import {
  DAYS_SHORT,
  MONTHS_SHORT,
  formatHour,
  localIsoDate,
  parseLocalIsoDate,
} from "@/lib/dateUtils";

export default function SchedulePage() {
  const { nextAppointment, appointments, cancelAppointment, advisorId } = useAppStore();
  const todayIso = localIsoDate(new Date());
  const myUpcoming = appointments
    .filter((a) => a.status === "upcoming" && a.date >= todayIso)
    .sort((a, b) =>
      a.date === b.date ? a.startHour - b.startHour : a.date.localeCompare(b.date),
    );

  return (
    <div className="flex flex-col lg:flex-row flex-1 p-4 lg:p-6 gap-4 lg:gap-6">
      <aside className="w-full lg:w-80 shrink-0 space-y-4">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-semibold text-gray-900">
              Schedule an appointment
            </h2>
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
              style={{
                backgroundColor: "var(--color-gold-soft)",
                color: "#8a7a44",
              }}
            >
              2 clicks
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Click any open slot and confirm — we&apos;ll handle the rest.
          </p>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
              Availability key
            </h3>
            <ul className="space-y-1.5 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ backgroundColor: "#CBB983" }}
                />
                In-person
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-blue-400" />
                Virtual
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-green-500" />
                Booked (you)
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
              Next available with your advisor
            </h3>
            <UpcomingSlotsList advisorId={advisorId} limit={4} />
          </div>

          <Link
            href="/advisors"
            className="mt-4 inline-flex items-center justify-between w-full text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg px-3 py-2 bg-gray-50 hover:bg-gray-100"
          >
            Book with a different advisor
            <IconArrowRight size={16} />
          </Link>
        </section>

        {myUpcoming.length > 0 && (
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md">
            <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <IconCheckCircle size={16} className="text-green-600" />
              Your upcoming appointments
            </h2>
            <ul className="space-y-3">
              {myUpcoming.map((a) => {
                const adv = advisorById(a.advisorId);
                const d = parseLocalIsoDate(a.date);
                return (
                  <li
                    key={a.id}
                    className="rounded-lg border border-gray-200 p-3 flex items-start gap-3"
                  >
                    {adv && <Avatar name={adv.name} accent={adv.accent} size={32} />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-sm font-semibold text-gray-800 truncate">
                          {adv?.name ?? "Advisor"}
                        </span>
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
                            a.type === "in-person"
                              ? "text-yellow-800 bg-yellow-100"
                              : "text-blue-800 bg-blue-100"
                          }`}
                        >
                          {a.type === "in-person" ? "In-person" : "Virtual"}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1.5">
                        <IconCalendar size={12} />
                        {DAYS_SHORT[d.getDay()]}, {MONTHS_SHORT[d.getMonth()]}{" "}
                        {d.getDate()}
                        <IconClock size={12} className="ml-1" />
                        {formatHour(a.startHour)}–{formatHour(a.endHour)}
                      </div>
                      {a.topic && (
                        <p className="text-xs text-gray-600 mt-1 italic">
                          “{a.topic}”
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() => cancelAppointment(a.id)}
                        className="mt-2 text-[11px] font-medium text-gray-400 hover:text-red-500"
                      >
                        Cancel appointment
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {nextAppointment == null && myUpcoming.length === 0 && (
          <section
            className="rounded-2xl p-5 shadow-md border border-gray-200"
            style={{ background: "linear-gradient(135deg, var(--color-gold-soft), #ffffff)" }}
          >
            <div className="flex items-start gap-2">
              <IconInfo size={18} style={{ color: "#8a7a44" }} className="shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  You haven&apos;t booked anything yet
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Pick any open slot on the calendar — most students meet with their advisor 2–3 weeks before registration.
                </p>
              </div>
            </div>
          </section>
        )}
      </aside>

      <WeekCalendar />
    </div>
  );
}
