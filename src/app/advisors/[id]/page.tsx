"use client";

import Link from "next/link";
import { use } from "react";
import { notFound } from "next/navigation";
import { advisorById } from "@/lib/mockData";
import { useAppStore } from "@/lib/store";
import { Avatar } from "@/components/Avatar";
import { WeekCalendar } from "@/components/WeekCalendar";
import {
  IconArrowRight,
  IconCalendar,
  IconChat,
  IconChevronLeft,
  IconCheck,
  IconClock,
  IconMapPin,
  IconPlus,
  IconUsers,
} from "@/components/icons";

export default function AdvisorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const advisor = advisorById(id);
  const { advisorId, setAdvisorId } = useAppStore();

  if (!advisor) {
    notFound();
  }

  const isYours = advisor.id === advisorId;
  const isGeneral = advisor.id === "adv-general";

  return (
    <div className="flex-1 px-4 sm:px-6 py-5 sm:py-8 max-w-[1400px] mx-auto w-full">
      <Link
        href="/advisors"
        className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-800 mb-4"
      >
        <IconChevronLeft size={14} />
        All advisors
      </Link>

      {/* Hero */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-md mb-5 sm:mb-6 animate-fade-in-up">
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          <Avatar name={advisor.name} accent={advisor.accent} size={96} />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                {advisor.name}
              </h1>
              {isYours && (
                <span
                  className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: "var(--color-gold-soft)",
                    color: "#8a7a44",
                  }}
                >
                  Your advisor
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">{advisor.title}</p>

            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <IconMapPin size={14} className="text-gray-400" />
                {advisor.officeLocation}
              </li>
              <li className="flex items-center gap-2">
                <IconClock size={14} className="text-gray-400" />
                {advisor.officeHoursText}
              </li>
              <li className="flex items-center gap-2">
                <IconChat size={14} className="text-gray-400" />
                <a
                  href={`mailto:${advisor.email}`}
                  className="hover:underline"
                >
                  {advisor.email}
                </a>
              </li>
              {advisor.phone && (
                <li className="flex items-center gap-2">
                  <IconUsers size={14} className="text-gray-400" />
                  <span>{advisor.phone}</span>
                </li>
              )}
            </ul>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Link
                href="/schedule"
                className="btn-press inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-black shadow-sm hover:shadow-md transition-shadow"
                style={{ backgroundColor: "#CBB983" }}
              >
                <IconCalendar size={16} />
                Book a time
              </Link>
              <Link
                href="/messages"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100"
              >
                <IconChat size={16} />
                Send a message
              </Link>
              {!isYours && !isGeneral && (
                <button
                  type="button"
                  onClick={() => setAdvisorId(advisor.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 border border-gray-200 hover:border-gray-300"
                >
                  <IconPlus size={16} />
                  Request as my advisor
                </button>
              )}
              {isYours && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold text-green-700 bg-green-50 border border-green-200">
                  <IconCheck size={12} />
                  Currently yours
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About + specialties + calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1 space-y-5 stagger-children">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">
              About
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">{advisor.bio}</p>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">
              Specialties
            </h2>
            <ul className="space-y-1.5">
              {advisor.specialties.map((s) => (
                <li
                  key={s}
                  className="inline-block mr-1.5 mb-1.5 text-xs font-medium px-2.5 py-1 rounded-full text-gray-700 bg-gray-100"
                >
                  {s}
                </li>
              ))}
            </ul>
          </section>

          {!isGeneral && (
            <section
              className="rounded-2xl p-5 border shadow-sm"
              style={{
                borderColor: "rgba(203, 185, 131, 0.35)",
                background: "linear-gradient(135deg, rgba(203,185,131,0.15), rgba(255,255,255,0.4))",
              }}
            >
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <IconUsers size={14} style={{ color: "#8a7a44" }} />
                Talk to {advisor.name.split(" ")[0]} about
              </h3>
              <p className="text-xs text-gray-700 mt-2 leading-relaxed">
                {isYours
                  ? "Since they're already your advisor, just drop them a message or book a slot."
                  : `Reach out if your goals align with their specialties — or just ask a quick question first via message.`}
              </p>
              <Link
                href="/messages"
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold"
                style={{ color: "#8a7a44" }}
              >
                Open messages <IconArrowRight size={12} />
              </Link>
            </section>
          )}
        </div>

        <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: "120ms" }}>
          <section className="mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">
              {advisor.name.split(" ")[0]}&apos;s availability
            </h2>
          </section>
          <WeekCalendar advisorId={advisor.id} compact />
        </div>
      </div>
    </div>
  );
}
