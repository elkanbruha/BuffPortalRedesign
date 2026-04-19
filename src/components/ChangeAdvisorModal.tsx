"use client";

import { useEffect, useState } from "react";
import { ADVISORS } from "@/lib/mockData";
import { useAppStore } from "@/lib/store";
import { Avatar } from "./Avatar";
import { IconCheck, IconClose, IconUsers } from "./icons";

type Props = {
  onClose: () => void;
};

const REASONS = [
  "I want a different specialty",
  "I don't feel supported by my current advisor",
  "My degree path changed",
  "Scheduling is easier with someone else",
  "Other",
];

export function ChangeAdvisorModal({ onClose }: Props) {
  const { advisorId, setAdvisorId } = useAppStore();
  const [selected, setSelected] = useState<string | null>(null);
  const [reason, setReason] = useState<string>(REASONS[0]);
  const [note, setNote] = useState("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const candidates = ADVISORS.filter(
    (a) => a.id !== advisorId && a.id !== "adv-general",
  );

  const confirm = () => {
    if (!selected) return;
    setAdvisorId(selected, reason === "Other" ? note : reason);
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
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-xl animate-fade-in-up overflow-hidden flex flex-col max-h-[90vh]">
        <header className="px-5 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-start gap-2">
            <IconUsers size={18} className="text-gray-500 mt-0.5" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Change your advisor
              </h2>
              <p className="text-xs text-gray-500">
                This request is reviewed by the advising office — usually approved within 2 business days.
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

        <div className="px-5 py-4 space-y-4 overflow-y-auto subtle-scroll">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
              Pick a new advisor
            </h3>
            <ul className="space-y-2">
              {candidates.map((a) => {
                const active = selected === a.id;
                return (
                  <li key={a.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(a.id)}
                      className={`w-full text-left rounded-xl border p-3 flex items-start gap-3 transition-all ${
                        active
                          ? "border-[#CBB983] shadow-sm"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      style={{
                        backgroundColor: active ? "var(--color-gold-soft)" : "white",
                      }}
                    >
                      <Avatar name={a.name} accent={a.accent} size={40} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-sm font-semibold text-gray-900">
                            {a.name}
                          </span>
                          {active && (
                            <span
                              className="inline-flex items-center gap-1 text-[10px] font-semibold"
                              style={{ color: "#8a7a44" }}
                            >
                              <IconCheck size={12} /> Selected
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">{a.title}</p>
                        <p className="text-[11px] text-gray-500 mt-1">
                          {a.specialties.join(" · ")}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
              Reason
            </h3>
            <div className="space-y-1.5">
              {REASONS.map((r) => (
                <label
                  key={r}
                  className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="reason"
                    value={r}
                    checked={reason === r}
                    onChange={() => setReason(r)}
                    className="accent-[#CBB983]"
                  />
                  {r}
                </label>
              ))}
            </div>
            {reason === "Other" && (
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="Briefly describe why…"
                className="mt-2 w-full px-3 py-2 rounded-lg border border-gray-200 text-sm placeholder-gray-400 focus:outline-none"
              />
            )}
          </div>
        </div>

        <footer className="px-5 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-2 shrink-0">
          <p className="text-[11px] text-gray-500">
            You can switch back any time — this isn&apos;t permanent.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!selected}
              onClick={confirm}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-black disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#CBB983" }}
            >
              <IconCheck size={16} />
              Confirm change
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
