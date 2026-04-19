"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Avatar } from "@/components/Avatar";
import {
  IconAlert,
  IconArrowRight,
  IconBook,
  IconCalendar,
  IconChat,
  IconCheckCircle,
  IconClock,
  IconGraduation,
  IconLightbulb,
  IconSparkle,
  IconTarget,
  IconUsers,
} from "@/components/icons";
import {
  DAYS_LONG,
  MONTHS,
  MONTHS_SHORT,
  formatHour,
  parseLocalIsoDate,
  relativeDay,
} from "@/lib/dateUtils";
import {
  RECOMMENDATIONS,
  REQUIREMENTS,
  advisorById,
  overallProgress,
} from "@/lib/mockData";
import { useAppStore } from "@/lib/store";

function greetingFor(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

type QuickAction = {
  href: string;
  label: string;
  desc: string;
  Icon: typeof IconCalendar;
  accent: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  {
    href: "/schedule",
    label: "Book an appointment",
    desc: "Click a slot, confirm, done.",
    Icon: IconCalendar,
    accent: "#CBB983",
  },
  {
    href: "/degree",
    label: "Plan next semester",
    desc: "See your recommended courses.",
    Icon: IconSparkle,
    accent: "#a78bfa",
  },
  {
    href: "/messages",
    label: "Message your advisor",
    desc: "Threaded conversations.",
    Icon: IconChat,
    accent: "#60a5fa",
  },
  {
    href: "/resources",
    label: "Browse resources",
    desc: "Tutoring, writing, wellness.",
    Icon: IconBook,
    accent: "#4ade80",
  },
];

export default function DashboardPage() {
  const {
    student,
    advisorId,
    nextAppointment,
    notifications,
    setNotificationDrawerOpen,
    unreadCount,
  } = useAppStore();
  const advisor = advisorById(advisorId);
  const progress = overallProgress();

  const now = useMemo(() => new Date(), []);
  const firstName = student.name.split(" ")[0];
  const greet = greetingFor(now.getHours());

  const upcomingNotifs = notifications
    .filter((n) => !n.read)
    .slice(0, 3);

  const topRec = RECOMMENDATIONS[0];

  const nextApptDate = nextAppointment
    ? parseLocalIsoDate(nextAppointment.date)
    : null;

  const remainingCredits = Math.max(
    student.totalCreditsRequired -
      student.totalCreditsCompleted -
      student.totalCreditsInProgress,
    0,
  );

  return (
    <div className="flex-1 flex flex-col">
      {/* Alert banner */}
      <div
        className="px-4 sm:px-6 py-2.5 text-sm flex items-center gap-2 border-b border-gray-200"
        style={{ backgroundColor: "var(--color-gold-soft)", color: "#4b3f14" }}
      >
        <IconAlert size={16} />
        <span className="flex-1">
          <strong className="font-semibold">Fall 2026 registration opens April 30.</strong>{" "}
          Meet with your advisor first — slots fill quickly.
        </span>
        <Link
          href="/schedule"
          className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full hover:bg-white/40"
          style={{ color: "#8a7a44" }}
        >
          Find a time <IconArrowRight size={14} />
        </Link>
      </div>

      <div className="flex-1 px-4 sm:px-6 py-5 sm:py-8 max-w-[1400px] mx-auto w-full">
        {/* Hero row: greeting + next appointment */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {DAYS_LONG[now.getDay()]}, {MONTHS[now.getMonth()]} {now.getDate()}
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-1">
              {greet}, {firstName}.
            </h1>
            <p className="text-sm text-gray-600 mt-1 max-w-xl">
              {nextAppointment
                ? `You're ${progress}% through your degree and have an advisor meeting ${relativeDay(nextApptDate!).toLowerCase()}.`
                : `You're ${progress}% through your degree. Registration opens soon — worth a quick check-in.`}
            </p>
          </div>
          <Link
            href="/schedule"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-black shadow-sm hover:shadow-md transition-shadow"
            style={{ backgroundColor: "#CBB983" }}
          >
            <IconCalendar size={18} />
            {nextAppointment ? "Manage appointments" : "Book an appointment"}
          </Link>
        </header>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* LEFT: anchoring priorities, since survey says 58.3% look left first */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            {/* Next appointment */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <IconCalendar size={16} className="text-gray-400" />
                  Next appointment
                </h2>
                <Link href="/schedule" className="text-xs font-semibold text-gray-500 hover:text-gray-800">
                  All appointments →
                </Link>
              </div>
              {nextAppointment && advisor && nextApptDate ? (
                <div className="flex items-center gap-4">
                  <Avatar name={advisor.name} accent={advisor.accent} size={56} />
                  <div className="flex-1 min-w-0">
                    <div className="text-lg font-semibold text-gray-900 truncate">
                      {advisor.name}
                    </div>
                    <p className="text-xs text-gray-500">{advisor.title}</p>
                    <div className="mt-1.5 text-sm text-gray-700 flex items-center flex-wrap gap-x-3 gap-y-0.5">
                      <span className="inline-flex items-center gap-1">
                        <IconClock size={14} className="text-gray-400" />
                        {relativeDay(nextApptDate)} · {formatHour(nextAppointment.startHour)}–
                        {formatHour(nextAppointment.endHour)}
                      </span>
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          nextAppointment.type === "in-person"
                            ? "text-yellow-800 bg-yellow-100"
                            : "text-blue-800 bg-blue-100"
                        }`}
                      >
                        {nextAppointment.type === "in-person" ? "In-person" : "Virtual"}
                      </span>
                    </div>
                    {nextAppointment.topic && (
                      <p className="text-xs text-gray-500 mt-1.5 italic">
                        “{nextAppointment.topic}”
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-200 p-5 text-center">
                  <p className="text-sm text-gray-600">
                    No appointment booked — and registration is coming up.
                  </p>
                  <Link
                    href="/schedule"
                    className="mt-3 inline-flex items-center gap-1 text-sm font-semibold"
                    style={{ color: "#8a7a44" }}
                  >
                    Find a time <IconArrowRight size={14} />
                  </Link>
                </div>
              )}
            </section>

            {/* Degree progress preview */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <IconGraduation size={16} className="text-gray-400" />
                  Degree progress
                </h2>
                <Link href="/degree" className="text-xs font-semibold text-gray-500 hover:text-gray-800">
                  Full tracker →
                </Link>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <ProgressDial percent={progress} />
                <div className="flex-1 min-w-0 w-full">
                  <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">
                    {student.major} · {student.year}
                  </div>
                  <div className="space-y-2">
                    {REQUIREMENTS.map((r) => {
                      const pct = Math.min(
                        100,
                        Math.round(
                          ((r.creditsCompleted + r.creditsInProgress) /
                            r.creditsRequired) *
                            100,
                        ),
                      );
                      return (
                        <div key={r.id}>
                          <div className="flex justify-between text-[11px] text-gray-600 mb-0.5">
                            <span>{r.label}</span>
                            <span className="font-medium">
                              {r.creditsCompleted + r.creditsInProgress}/
                              {r.creditsRequired}
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: "#CBB983",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500">
                    <span>
                      {remainingCredits} credits to go · Grad {student.expectedGradTerm}
                    </span>
                    <span>GPA {student.gpa.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Recommendation teaser */}
            {topRec && (
              <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <IconSparkle size={16} className="text-gray-400" />
                    Recommended for next semester
                  </h2>
                  <Link href="/degree" className="text-xs font-semibold text-gray-500 hover:text-gray-800">
                    See all {RECOMMENDATIONS.length} →
                  </Link>
                </div>
                <div className="rounded-xl border border-gray-100 p-4 flex items-start gap-3">
                  <div
                    className="shrink-0 h-11 w-11 rounded-xl flex items-center justify-center text-sm font-bold"
                    style={{
                      backgroundColor: "var(--color-gold-soft)",
                      color: "#8a7a44",
                    }}
                  >
                    {topRec.course.code.split(" ")[1]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {topRec.course.code} · {topRec.course.title}
                      </h3>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Strong fit
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{topRec.reasonText}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {topRec.reasonTags.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full text-gray-600 bg-gray-100"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Quick actions */}
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2 px-1">
                Quick actions
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {QUICK_ACTIONS.map((q) => (
                  <Link
                    key={q.href}
                    href={q.href}
                    className="group flex flex-col gap-2 p-4 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 hover:shadow-md transition-all"
                  >
                    <span
                      className="inline-flex items-center justify-center h-9 w-9 rounded-xl"
                      style={{
                        backgroundColor: `${q.accent}20`,
                        color: q.accent,
                      }}
                    >
                      <q.Icon size={18} />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {q.label}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{q.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT: advisor + notifications */}
          <div className="space-y-4 lg:space-y-6">
            {advisor && (
              <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <IconUsers size={16} className="text-gray-400" />
                    Your advisor
                  </h2>
                  <Link
                    href="/advisors"
                    className="text-xs font-semibold text-gray-500 hover:text-gray-800"
                  >
                    Change →
                  </Link>
                </div>
                <div className="flex items-start gap-3">
                  <Avatar name={advisor.name} accent={advisor.accent} size={48} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900">
                      {advisor.name}
                    </div>
                    <p className="text-[11px] text-gray-500">{advisor.title}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                      {advisor.officeLocation}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Link
                    href="/messages"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100"
                  >
                    <IconChat size={14} />
                    Message
                  </Link>
                  <Link
                    href={`/advisors/${advisor.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-black"
                    style={{ backgroundColor: "var(--color-gold-tint)" }}
                  >
                    Profile
                    <IconArrowRight size={14} />
                  </Link>
                </div>
                <p className="mt-3 text-[11px] text-gray-500 leading-relaxed">
                  <strong className="text-gray-700 font-medium">Specialties:</strong>{" "}
                  {advisor.specialties.join(" · ")}
                </p>
              </section>
            )}

            {/* Reminders */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <IconLightbulb size={16} className="text-gray-400" />
                  Reminders
                </h2>
                <button
                  type="button"
                  onClick={() => setNotificationDrawerOpen(true)}
                  className="text-xs font-semibold text-gray-500 hover:text-gray-800"
                >
                  See all{unreadCount > 0 ? ` (${unreadCount})` : ""} →
                </button>
              </div>
              {upcomingNotifs.length === 0 ? (
                <p className="text-xs text-gray-500 flex items-center gap-1.5">
                  <IconCheckCircle size={14} className="text-green-600" />
                  You&apos;re all caught up.
                </p>
              ) : (
                <ul className="space-y-2">
                  {upcomingNotifs.map((n) => (
                    <li
                      key={n.id}
                      className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5"
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-sm font-semibold text-gray-800 leading-tight">
                          {n.title}
                        </span>
                        {n.date && (() => {
                          const d = parseLocalIsoDate(n.date);
                          return (
                            <span className="text-[10px] text-gray-400 shrink-0">
                              {MONTHS_SHORT[d.getMonth()]} {d.getDate()}
                            </span>
                          );
                        })()}
                      </div>
                      <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                        {n.body}
                      </p>
                      {n.actionHref && n.actionLabel && (
                        <Link
                          href={n.actionHref}
                          className="mt-1.5 inline-block text-[11px] font-semibold"
                          style={{ color: "#8a7a44" }}
                        >
                          {n.actionLabel} →
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Next steps prompt */}
            <section
              className="rounded-2xl p-5 shadow-md border"
              style={{
                borderColor: "rgba(203, 185, 131, 0.4)",
                background:
                  "linear-gradient(135deg, rgba(203,185,131,0.22), rgba(203,185,131,0.05))",
              }}
            >
              <div className="flex items-start gap-2">
                <IconTarget size={18} style={{ color: "#8a7a44" }} className="shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Suggested next step
                  </h3>
                  <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                    Based on where you are in your degree, meet with your advisor before April 30 to confirm your Fall 2026 plan. It takes most students a single 30-minute meeting.
                  </p>
                  <Link
                    href="/schedule"
                    className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold"
                    style={{ color: "#8a7a44" }}
                  >
                    Find a time <IconArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressDial({ percent }: { percent: number }) {
  const clamped = Math.max(0, Math.min(100, percent));
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - clamped / 100);
  return (
    <div className="relative shrink-0" style={{ width: 112, height: 112 }}>
      <svg width={112} height={112} viewBox="0 0 112 112">
        <circle
          cx={56}
          cy={56}
          r={radius}
          stroke="#f3f4f6"
          strokeWidth={10}
          fill="none"
        />
        <circle
          cx={56}
          cy={56}
          r={radius}
          stroke="#CBB983"
          strokeWidth={10}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 56 56)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold text-gray-900">{clamped}%</span>
        <span className="text-[10px] text-gray-500 font-medium">complete</span>
      </div>
    </div>
  );
}
