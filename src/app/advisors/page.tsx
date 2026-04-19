"use client";

import Link from "next/link";
import { useState } from "react";
import { ADVISORS, advisorById } from "@/lib/mockData";
import { useAppStore } from "@/lib/store";
import { Avatar } from "@/components/Avatar";
import { ChangeAdvisorModal } from "@/components/ChangeAdvisorModal";
import {
  IconArrowRight,
  IconCalendar,
  IconChat,
  IconChevronDown,
  IconInfo,
  IconMapPin,
  IconUsers,
} from "@/components/icons";

export default function AdvisorsPage() {
  const { advisorId } = useAppStore();
  const current = advisorById(advisorId);
  const [changeOpen, setChangeOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);

  return (
    <div className="flex-1 px-4 sm:px-6 py-5 sm:py-8 max-w-[1400px] mx-auto w-full">
      <header className="mb-5 sm:mb-7 animate-fade-in-up">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Advisors
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-1">
          Your advising team
        </h1>
        <p className="text-sm text-gray-600 mt-1 max-w-2xl">
          The College of Engineering&apos;s CS advising office has four advisors. You can switch at any time — the request goes to the advising office and is usually approved in two business days.
        </p>
      </header>

      {/* Current advisor banner */}
      {current && (
        <section
          className="rounded-2xl p-4 sm:p-5 mb-5 sm:mb-7 border animate-fade-in-up"
          style={{
            borderColor: "rgba(203, 185, 131, 0.4)",
            background:
              "linear-gradient(135deg, rgba(203,185,131,0.18), rgba(203,185,131,0.04))",
            animationDelay: "60ms",
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Avatar name={current.name} accent={current.accent} size={56} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#8a7a44" }}>
                Your advisor
              </p>
              <h2 className="text-lg font-semibold text-gray-900 mt-0.5">
                {current.name}
              </h2>
              <p className="text-xs text-gray-600">{current.title} · {current.officeLocation}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/advisors/${current.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 bg-white border border-gray-200 hover:border-gray-300"
              >
                View profile
                <IconArrowRight size={14} />
              </Link>
              <button
                type="button"
                onClick={() => setChangeOpen(true)}
                className="btn-press inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-black"
                style={{ backgroundColor: "#CBB983" }}
              >
                <IconUsers size={14} />
                Change advisor
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Advisor grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5 stagger-children">
        {ADVISORS.map((a) => {
          const isYours = a.id === advisorId;
          return (
            <article
              key={a.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md flex flex-col transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex items-start gap-3">
                <Avatar name={a.name} accent={a.accent} size={52} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2 flex-wrap">
                    <h3 className="text-base font-semibold text-gray-900">
                      {a.name}
                    </h3>
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
                  <p className="text-xs text-gray-600">{a.title}</p>
                  <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                    <IconMapPin size={12} />
                    {a.officeLocation}
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-700 mt-3 leading-relaxed">{a.bio}</p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {a.specialties.map((s) => (
                  <span
                    key={s}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full text-gray-600 bg-gray-100"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-3 text-[11px] text-gray-500">
                <strong className="text-gray-700 font-medium">Office hours:</strong>{" "}
                {a.officeHoursText}
              </div>

              <div className="mt-4 flex items-center gap-2 flex-wrap">
                <Link
                  href={`/advisors/${a.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 border border-gray-200 hover:border-gray-300"
                >
                  View profile
                  <IconArrowRight size={14} />
                </Link>
                <Link
                  href="/schedule"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-black"
                  style={{ backgroundColor: "var(--color-gold-tint)" }}
                >
                  <IconCalendar size={14} />
                  Schedule
                </Link>
                <Link
                  href="/messages"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100"
                >
                  <IconChat size={14} />
                  Message
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {/* Why-switch expander */}
      <section className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
        <button
          type="button"
          onClick={() => setFaqOpen((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
          aria-expanded={faqOpen}
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <IconInfo size={16} className="text-gray-400" />
            Why might I want to change advisors?
          </span>
          <IconChevronDown
            size={18}
            className={`text-gray-400 transition-transform ${faqOpen ? "rotate-180" : ""}`}
          />
        </button>
        <div className="collapse-grid" data-open={faqOpen}>
          <div className="collapse-inner">
            <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed space-y-2 border-t border-gray-100 pt-4">
              <p>
                CU lets you change academic advisors as often as you need to. It&apos;s common to switch when your interests shift — for example, a student who starts in the systems track but later pivots toward ML is often better served by an advisor who specializes in that area.
              </p>
              <p>
                Changing advisors does not reset any of your degree progress, appointment history, or notes. Your new advisor inherits your audit.
              </p>
              <p>
                If you&apos;re not sure whether to switch, try dropping in on General Advising on a weekend — it&apos;s an informal way to get a second perspective.
              </p>
            </div>
          </div>
        </div>
      </section>

      {changeOpen && (
        <ChangeAdvisorModal onClose={() => setChangeOpen(false)} />
      )}
    </div>
  );
}
