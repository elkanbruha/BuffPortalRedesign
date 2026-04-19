"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PlanningWizardModal } from "@/components/PlanningWizardModal";
import { ProgressRing } from "@/components/ProgressRing";
import {
  IconArrowRight,
  IconChevronDown,
  IconCheckCircle,
  IconClock,
  IconGraduation,
  IconInfo,
  IconSparkle,
  IconTarget,
} from "@/components/icons";
import {
  ALL_COURSES,
  RECOMMENDATIONS,
  REQUIREMENTS,
  STUDENT,
  type Course,
  type DegreeRequirement,
  type Recommendation,
  overallProgress,
  requirementPercent,
} from "@/lib/mockData";

function statusLabel(s: Course["status"]) {
  if (s === "completed") return { text: "Completed", bg: "#dcfce7", fg: "#166534" };
  if (s === "in-progress") return { text: "In progress", bg: "#dbeafe", fg: "#1d4ed8" };
  return { text: "Planned", bg: "#f3f4f6", fg: "#374151" };
}


function CourseRow({ c }: { c: Course }) {
  const s = statusLabel(c.status);
  return (
    <li className="grid grid-cols-[1fr_auto] gap-x-3 items-start py-2 border-b border-gray-100 last:border-b-0">
      <div className="min-w-0">
        <div className="text-sm font-semibold text-gray-900 truncate">
          {c.code} · {c.title}
        </div>
        <div className="text-[11px] text-gray-500 mt-0.5">
          {c.term} · {c.credits} credits
          {c.grade ? ` · Grade ${c.grade}` : ""}
        </div>
      </div>
      <span
        className="text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
        style={{ backgroundColor: s.bg, color: s.fg }}
      >
        {s.text}
      </span>
    </li>
  );
}

function RequirementSection({
  req,
  defaultOpen,
  index,
}: {
  req: DegreeRequirement;
  defaultOpen: boolean;
  index: number;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const pct = requirementPercent(req);
  const remaining = Math.max(
    req.creditsRequired - req.creditsCompleted - req.creditsInProgress,
    0,
  );
  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-md overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full px-5 py-4 text-left flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors"
        aria-expanded={open}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-base font-semibold text-gray-900">
              {req.label}
            </h3>
            <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
              {req.creditsCompleted + req.creditsInProgress}/{req.creditsRequired} cr
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{req.description}</p>
          <div className="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full animate-fill-bar"
              style={
                {
                  backgroundColor: "#CBB983",
                  ["--bar-target" as const]: `${Math.min(pct, 100)}%`,
                  animationDelay: `${400 + index * 120}ms`,
                } as React.CSSProperties
              }
            />
          </div>
          <div className="mt-1.5 flex items-center gap-3 text-[11px] text-gray-500">
            <span className="inline-flex items-center gap-1">
              <IconCheckCircle size={12} className="text-green-600" />
              {req.creditsCompleted} completed
            </span>
            {req.creditsInProgress > 0 && (
              <span className="inline-flex items-center gap-1">
                <IconClock size={12} className="text-blue-500" />
                {req.creditsInProgress} in progress
              </span>
            )}
            {remaining > 0 && (
              <span className="inline-flex items-center gap-1 text-gray-500">
                <IconTarget size={12} />
                {remaining} to go
              </span>
            )}
          </div>
        </div>
        <IconChevronDown
          size={20}
          className={`text-gray-400 transition-transform shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div className="collapse-grid" data-open={open}>
        <div className="collapse-inner">
          <div className="px-5 pb-5 pt-1">
            {req.courses.length === 0 ? (
              <p className="text-xs text-gray-500 italic">
                No courses applied yet — the wizard can suggest some.
              </p>
            ) : (
              <ul>
                {req.courses.map((c) => (
                  <CourseRow key={`${c.code}-${c.term}`} c={c} />
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function RecommendationCard({ r }: { r: Recommendation }) {
  const fitStyles = {
    strong: { bg: "#dcfce7", fg: "#15803d", label: "Strong fit" },
    good: { bg: "#dbeafe", fg: "#1d4ed8", label: "Good fit" },
    exploratory: { bg: "#fef3c7", fg: "#92400e", label: "Exploratory" },
  }[r.fit];
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-md flex flex-col transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start gap-3">
        <div
          className="shrink-0 h-12 w-12 rounded-xl flex items-center justify-center text-sm font-bold"
          style={{
            backgroundColor: "var(--color-gold-soft)",
            color: "#8a7a44",
          }}
        >
          {r.course.code.split(" ")[1]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-gray-900">
              {r.course.code}
            </h3>
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: fitStyles.bg, color: fitStyles.fg }}
            >
              {fitStyles.label}
            </span>
          </div>
          <p className="text-sm text-gray-700 leading-snug">{r.course.title}</p>
        </div>
      </div>
      <p className="text-xs text-gray-600 mt-3 leading-relaxed flex-1">
        {r.reasonText}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {r.reasonTags.map((t) => (
          <span
            key={t}
            className="text-[10px] font-medium px-2 py-0.5 rounded-full text-gray-600 bg-gray-100"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="mt-3 text-[11px] text-gray-500 flex items-center justify-between">
        <span>{r.course.credits} credits · {r.course.term}</span>
        <button
          type="button"
          className="inline-flex items-center gap-1 font-semibold"
          style={{ color: "#8a7a44" }}
        >
          Add to plan <IconArrowRight size={12} />
        </button>
      </div>
    </article>
  );
}

export default function DegreePage() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const progress = overallProgress();
  const inProgressCourses = useMemo(
    () => ALL_COURSES.filter((c) => c.status === "in-progress"),
    [],
  );

  return (
    <div className="flex-1 px-4 sm:px-6 py-5 sm:py-8 max-w-[1400px] mx-auto w-full">
      <header className="mb-5 sm:mb-7 flex flex-wrap items-end justify-between gap-3 animate-fade-in-up">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Degree
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-1">
            Your degree tracker
          </h1>
          <p className="text-sm text-gray-600 mt-1 max-w-2xl">
            Always up-to-date from the registrar. Expand a section to see which courses count where.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setWizardOpen(true)}
          className="btn-press inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-black shadow-sm hover:shadow-md transition-shadow"
          style={{ backgroundColor: "#CBB983" }}
        >
          <IconSparkle size={16} />
          Build my semester plan
        </button>
      </header>

      {/* Hero: ring + stats */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-md mb-5 sm:mb-6 animate-fade-in-up" style={{ animationDelay: "60ms" }}>
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-center lg:items-start">
          <ProgressRing
            percent={progress}
            size={180}
            stroke={14}
            label="toward graduation"
          />
          <div className="flex-1 min-w-0 w-full">
            <h2 className="text-lg font-semibold text-gray-900">
              {STUDENT.major}
            </h2>
            <p className="text-xs text-gray-500">
              Started {STUDENT.startTerm} · Expected graduation {STUDENT.expectedGradTerm}
            </p>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 stagger-children">
              <Stat label="Credits earned" value={`${STUDENT.totalCreditsCompleted}`} />
              <Stat label="In progress" value={`${STUDENT.totalCreditsInProgress}`} />
              <Stat label="Remaining" value={`${STUDENT.totalCreditsRequired - STUDENT.totalCreditsCompleted - STUDENT.totalCreditsInProgress}`} />
              <Stat label="Cumulative GPA" value={STUDENT.gpa.toFixed(2)} />
            </div>

            {inProgressCourses.length > 0 && (
              <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/50 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <IconClock size={14} className="text-blue-600" />
                  <span className="text-xs font-semibold uppercase tracking-wide text-blue-900">
                    Spring 2026 in progress
                  </span>
                </div>
                <ul className="text-xs text-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {inProgressCourses.map((c) => (
                    <li
                      key={c.code}
                      className="flex items-center gap-2 truncate"
                    >
                      <span className="h-1 w-1 rounded-full bg-blue-500 shrink-0" />
                      <span className="truncate">
                        {c.code} · {c.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <section className="mb-5 sm:mb-7 animate-fade-in-up" style={{ animationDelay: "120ms" }}>
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 flex items-center gap-2">
            <IconSparkle size={14} />
            Recommended for Fall 2026
          </h2>
          <button
            type="button"
            onClick={() => setWizardOpen(true)}
            className="text-xs font-semibold text-gray-500 hover:text-gray-800"
          >
            Run the wizard →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 stagger-children">
          {RECOMMENDATIONS.map((r) => (
            <RecommendationCard key={r.id} r={r} />
          ))}
        </div>
      </section>

      {/* Requirements */}
      <section className="space-y-3 animate-fade-in-up" style={{ animationDelay: "180ms" }}>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 flex items-center gap-2">
          <IconGraduation size={14} />
          Requirements
        </h2>
        {REQUIREMENTS.map((r, idx) => (
          <RequirementSection key={r.id} req={r} defaultOpen={idx === 0} index={idx} />
        ))}
      </section>

      <aside
        className="mt-6 rounded-2xl border p-5 flex items-start gap-3"
        style={{
          borderColor: "rgba(203, 185, 131, 0.4)",
          background: "linear-gradient(135deg, rgba(203,185,131,0.12), #ffffff)",
        }}
      >
        <IconInfo size={18} style={{ color: "#8a7a44" }} className="shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900">
            Audit looks off?
          </h3>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
            If a course you completed isn&apos;t showing in the right bucket, your advisor can fix it during a 15-minute check-in. It&apos;s faster than it sounds.
          </p>
          <Link
            href="/schedule"
            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold"
            style={{ color: "#8a7a44" }}
          >
            Book a fix-up <IconArrowRight size={12} />
          </Link>
        </div>
      </aside>

      {wizardOpen && (
        <PlanningWizardModal onClose={() => setWizardOpen(false)} />
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3">
      <div className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">
        {label}
      </div>
      <div className="text-xl font-semibold text-gray-900 mt-0.5 leading-none">
        {value}
      </div>
    </div>
  );
}
