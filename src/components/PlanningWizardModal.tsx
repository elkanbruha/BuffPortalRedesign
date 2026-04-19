"use client";

import { useEffect, useState } from "react";
import { RECOMMENDATIONS } from "@/lib/mockData";
import { useAppStore } from "@/lib/store";
import {
  IconArrowRight,
  IconCheck,
  IconClose,
  IconSparkle,
} from "./icons";

type Props = {
  onClose: () => void;
};

type Goal = "graduate-on-time" | "deepen-ml" | "internship-ready" | "explore";

const GOALS: { id: Goal; title: string; desc: string }[] = [
  {
    id: "graduate-on-time",
    title: "Graduate on time",
    desc: "Stay on pace for Spring 2027 — fill required credits first.",
  },
  {
    id: "deepen-ml",
    title: "Deepen an ML / AI track",
    desc: "Build a focused sequence that reads well on grad-school apps.",
  },
  {
    id: "internship-ready",
    title: "Internship-ready by summer",
    desc: "Prioritize systems, practical software skills, interview prep.",
  },
  {
    id: "explore",
    title: "Explore something new",
    desc: "Try an interdisciplinary elective that stretches you.",
  },
];

type LoadKey = "light" | "standard" | "heavy";

const LOADS: { id: LoadKey; title: string; desc: string }[] = [
  { id: "light", title: "Light (12 credits)", desc: "Four classes, breathing room." },
  { id: "standard", title: "Standard (15 credits)", desc: "Five classes, typical CS pace." },
  { id: "heavy", title: "Heavy (18 credits)", desc: "Six classes, aggressive." },
];

const CONSTRAINTS = [
  "No 8 AM classes",
  "Tuesday/Thursday preferred",
  "Avoid Fridays",
  "Needs upper-division writing",
  "Needs a diversity Gen-Ed",
];

function planFor(goal: Goal): typeof RECOMMENDATIONS {
  switch (goal) {
    case "deepen-ml":
      return RECOMMENDATIONS.filter((r) =>
        r.reasonTags.some((t) => t.toLowerCase().includes("ml")),
      );
    case "internship-ready":
      return RECOMMENDATIONS.filter((r) =>
        r.reasonTags.some((t) =>
          t.toLowerCase().match(/systems|industry|prep/),
        ),
      );
    case "graduate-on-time":
      return RECOMMENDATIONS.filter((r) => r.fit !== "exploratory");
    case "explore":
      return RECOMMENDATIONS.filter((r) => r.fit === "exploratory" || r.course.category === "gened");
    default:
      return RECOMMENDATIONS;
  }
}

export function PlanningWizardModal({ onClose }: Props) {
  const { pushToast } = useAppStore();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<Goal>("graduate-on-time");
  const [load, setLoad] = useState<LoadKey>("standard");
  const [constraints, setConstraints] = useState<string[]>([]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const plan = planFor(goal);
  const stepCount = 4;

  const next = () => setStep((s) => Math.min(s + 1, stepCount - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const finish = () => {
    pushToast({
      kind: "success",
      title: "Draft plan saved",
      body: "Your advisor will see it when you next meet.",
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[55] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/40 animate-fade-in-up"
        onClick={onClose}
      />
      <div className="relative w-full sm:max-w-xl bg-white rounded-t-2xl sm:rounded-2xl shadow-xl animate-fade-in-up overflow-hidden flex flex-col max-h-[92vh]">
        <header className="px-5 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-start gap-2">
            <IconSparkle size={18} style={{ color: "#8a7a44" }} />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Planning wizard
              </h2>
              <p className="text-xs text-gray-500">
                Step {step + 1} of {stepCount} — answer three questions, get a draft plan.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex items-center justify-center h-8 w-8 rounded-md text-gray-500 hover:bg-gray-100"
          >
            <IconClose size={18} />
          </button>
        </header>

        {/* Progress steps */}
        <div className="px-5 py-2 border-b border-gray-100 flex gap-2">
          {Array.from({ length: stepCount }, (_, i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full"
              style={{
                backgroundColor: i <= step ? "#CBB983" : "#e5e7eb",
              }}
            />
          ))}
        </div>

        <div className="px-5 py-5 overflow-y-auto subtle-scroll flex-1">
          {step === 0 && (
            <section>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                What&apos;s your main goal for next semester?
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Pick one. We&apos;ll prioritize recommendations that match.
              </p>
              <ul className="space-y-2">
                {GOALS.map((g) => (
                  <li key={g.id}>
                    <button
                      type="button"
                      onClick={() => setGoal(g.id)}
                      className={`w-full text-left rounded-xl border p-3 transition-all ${
                        goal === g.id
                          ? "border-[#CBB983] shadow-sm"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      style={{
                        backgroundColor:
                          goal === g.id ? "var(--color-gold-soft)" : "white",
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-gray-900">
                          {g.title}
                        </span>
                        {goal === g.id && (
                          <IconCheck size={16} style={{ color: "#8a7a44" }} />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">{g.desc}</p>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {step === 1 && (
            <section>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                How heavy a course load?
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Rough guideline — we&apos;ll show plans at this credit count.
              </p>
              <ul className="space-y-2">
                {LOADS.map((l) => (
                  <li key={l.id}>
                    <button
                      type="button"
                      onClick={() => setLoad(l.id)}
                      className={`w-full text-left rounded-xl border p-3 transition-all ${
                        load === l.id
                          ? "border-[#CBB983] shadow-sm"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      style={{
                        backgroundColor:
                          load === l.id ? "var(--color-gold-soft)" : "white",
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-gray-900">
                          {l.title}
                        </span>
                        {load === l.id && (
                          <IconCheck size={16} style={{ color: "#8a7a44" }} />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">{l.desc}</p>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {step === 2 && (
            <section>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Any constraints?
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Select any that apply — we&apos;ll flag recommendations that don&apos;t match.
              </p>
              <ul className="space-y-1.5">
                {CONSTRAINTS.map((c) => {
                  const on = constraints.includes(c);
                  return (
                    <li key={c}>
                      <label
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border cursor-pointer ${
                          on
                            ? "border-[#CBB983]"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        style={{
                          backgroundColor: on ? "var(--color-gold-soft)" : "white",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={(e) =>
                            setConstraints((prev) =>
                              e.target.checked
                                ? [...prev, c]
                                : prev.filter((x) => x !== c),
                            )
                          }
                          className="accent-[#CBB983]"
                        />
                        <span className="text-sm text-gray-800">{c}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {step === 3 && (
            <section>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Your draft plan
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Based on your goal and constraints. Bring this to your next advising meeting.
              </p>
              <ul className="space-y-2">
                {plan.slice(0, 5).map((r) => (
                  <li
                    key={r.id}
                    className="rounded-xl border border-gray-200 p-3 flex items-start gap-3"
                  >
                    <div
                      className="shrink-0 h-10 w-10 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{
                        backgroundColor: "var(--color-gold-soft)",
                        color: "#8a7a44",
                      }}
                    >
                      {r.course.code.split(" ")[1]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900">
                        {r.course.code} · {r.course.title}
                      </div>
                      <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                        {r.reasonText}
                      </p>
                    </div>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full text-gray-600 bg-gray-100 shrink-0">
                      {r.course.credits} cr
                    </span>
                  </li>
                ))}
              </ul>
              {constraints.length > 0 && (
                <p className="mt-3 text-[11px] text-gray-500">
                  Applied constraints: {constraints.join(" · ")}
                </p>
              )}
            </section>
          )}
        </div>

        <footer className="px-5 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={step === 0 ? onClose : back}
            className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            {step === 0 ? "Cancel" : "Back"}
          </button>
          {step < stepCount - 1 ? (
            <button
              type="button"
              onClick={next}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-black"
              style={{ backgroundColor: "#CBB983" }}
            >
              Next <IconArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={finish}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-black"
              style={{ backgroundColor: "#CBB983" }}
            >
              <IconCheck size={16} /> Save draft
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
