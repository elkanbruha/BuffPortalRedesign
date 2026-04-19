"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import {
  IconChat,
  IconChevronLeft,
  IconInfo,
  IconSend,
} from "@/components/icons";
import { ADVISORS, advisorById } from "@/lib/mockData";
import { useAppStore } from "@/lib/store";

function formatTimestamp(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  if (sameDay) {
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function preview(body: string) {
  return body.length > 70 ? body.slice(0, 67) + "…" : body;
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="flex-1 p-6 text-sm text-gray-400">Loading messages…</div>}>
      <MessagesInner />
    </Suspense>
  );
}

function MessagesInner() {
  const { threads, sendMessage, markThreadRead } = useAppStore();
  const searchParams = useSearchParams();
  const wantedAdvisor = searchParams.get("advisor");

  const initialThreadId = useMemo(() => {
    if (wantedAdvisor) {
      const t = threads.find((th) => th.advisorId === wantedAdvisor);
      if (t) return t.id;
    }
    return threads[0]?.id ?? null;
  }, [wantedAdvisor, threads]);

  const [activeId, setActiveId] = useState<string | null>(initialThreadId);
  const [draft, setDraft] = useState("");
  const [mobileView, setMobileView] = useState<"list" | "thread">(
    initialThreadId && wantedAdvisor ? "thread" : "list",
  );
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const activeThread = threads.find((t) => t.id === activeId) || null;
  const activeAdvisor = activeThread
    ? advisorById(activeThread.advisorId)
    : null;

  useEffect(() => {
    if (activeId) markThreadRead(activeId);
  }, [activeId, markThreadRead]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [activeThread?.messages.length]);

  const send = () => {
    if (!draft.trim() || !activeId) return;
    sendMessage(activeId, draft);
    setDraft("");
  };

  const startThreadWith = (advisorId: string) => {
    const t = threads.find((th) => th.advisorId === advisorId);
    if (t) {
      setActiveId(t.id);
      setMobileView("thread");
    }
  };

  return (
    <div className="flex-1 px-4 sm:px-6 py-5 sm:py-8 max-w-[1400px] mx-auto w-full flex flex-col">
      <header className="mb-4 animate-fade-in-up">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Messages
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-1">
          Threads with your advising team
        </h1>
        <p className="text-sm text-gray-600 mt-1 max-w-2xl">
          Quick questions, documents, or the link to a Zoom meeting — whatever doesn&apos;t need a full appointment.
        </p>
      </header>

      <div className="flex-1 flex flex-col md:flex-row gap-0 md:gap-4 min-h-[560px] rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-md animate-fade-in-up" style={{ animationDelay: "60ms" }}>
        {/* Thread list */}
        <aside
          className={`md:w-80 md:shrink-0 flex flex-col border-r border-gray-200 ${
            mobileView === "thread" ? "hidden md:flex" : "flex"
          }`}
        >
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Inbox</h2>
            <span className="text-[11px] text-gray-500">
              {threads.reduce((n, t) => n + t.unreadCount, 0)} unread
            </span>
          </div>
          <ul className="flex-1 overflow-y-auto subtle-scroll">
            {threads.map((t) => {
              const adv = advisorById(t.advisorId);
              const last = t.messages[t.messages.length - 1];
              const isActive = activeId === t.id;
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveId(t.id);
                      setMobileView("thread");
                    }}
                    className={`w-full px-4 py-3 flex items-start gap-3 text-left border-b border-gray-100 ${
                      isActive
                        ? "bg-gray-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {adv && <Avatar name={adv.name} accent={adv.accent} size={36} />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-sm font-semibold text-gray-900 truncate">
                          {adv?.name ?? "Advisor"}
                        </span>
                        {last && (
                          <span className="text-[10px] text-gray-400 shrink-0">
                            {formatTimestamp(last.timestamp)}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 truncate">
                        {t.subject}
                      </p>
                      {last && (
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                          {last.from === "student" ? "You: " : ""}
                          {preview(last.body)}
                        </p>
                      )}
                    </div>
                    {t.unreadCount > 0 && (
                      <span
                        className="mt-1 h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: "#CBB983" }}
                        aria-label="Unread"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Start new message from any advisor */}
          <div className="border-t border-gray-200 p-3">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-2">
              Start new thread
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ADVISORS.filter((a) => a.id !== "adv-general").map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => startThreadWith(a.id)}
                  className="text-[11px] font-medium px-2 py-1 rounded-full text-gray-700 bg-gray-100 hover:bg-gray-200"
                >
                  {a.name.split(" ").slice(-1)[0]}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Thread detail */}
        <section
          className={`flex-1 flex flex-col bg-gray-50 ${
            mobileView === "list" ? "hidden md:flex" : "flex"
          }`}
        >
          {!activeThread && (
            <div className="flex-1 flex items-center justify-center p-6 text-sm text-gray-500 text-center">
              <div>
                <IconChat size={28} className="mx-auto text-gray-300" />
                <p className="mt-2">Pick a thread to start reading.</p>
              </div>
            </div>
          )}

          {activeThread && activeAdvisor && (
            <>
              <header className="bg-white px-4 sm:px-5 py-3 border-b border-gray-200 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileView("list")}
                  aria-label="Back to inbox"
                  className="md:hidden inline-flex items-center gap-0.5 text-xs font-medium text-gray-500"
                >
                  <IconChevronLeft size={14} /> Inbox
                </button>
                <Avatar
                  name={activeAdvisor.name}
                  accent={activeAdvisor.accent}
                  size={36}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate">
                    {activeAdvisor.name}
                  </div>
                  <p className="text-[11px] text-gray-500 truncate">
                    {activeThread.subject}
                  </p>
                </div>
              </header>

              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto subtle-scroll p-4 sm:p-5 space-y-3"
              >
                {activeThread.messages.map((m) => {
                  const mine = m.from === "student";
                  return (
                    <div
                      key={m.id}
                      className={`flex animate-slide-in-up ${mine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                          mine
                            ? "text-black rounded-br-sm"
                            : "text-gray-800 bg-white border border-gray-200 rounded-bl-sm"
                        }`}
                        style={
                          mine
                            ? { backgroundColor: "var(--color-gold-tint)" }
                            : undefined
                        }
                      >
                        <p className="leading-relaxed whitespace-pre-wrap">
                          {m.body}
                        </p>
                        <p
                          className={`text-[10px] mt-1 ${
                            mine ? "text-black/60" : "text-gray-400"
                          }`}
                        >
                          {formatTimestamp(m.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div className="flex justify-center">
                  <span className="inline-flex items-center gap-1.5 text-[10px] text-gray-400 bg-white border border-gray-200 rounded-full px-2 py-1">
                    <IconInfo size={12} /> Demo thread — responses are not actually sent
                  </span>
                </div>
              </div>

              <footer className="bg-white border-t border-gray-200 p-3 sm:p-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    send();
                  }}
                  className="flex items-end gap-2"
                >
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        send();
                      }
                    }}
                    placeholder={`Reply to ${activeAdvisor.name.split(" ").slice(-1)[0]}…`}
                    className="flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0"
                    style={{ minHeight: 40, maxHeight: 140 }}
                  />
                  <button
                    type="submit"
                    disabled={!draft.trim()}
                    aria-label="Send message"
                    className="inline-flex items-center justify-center h-10 w-10 rounded-xl text-black shadow-sm hover:shadow-md transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: "#CBB983" }}
                  >
                    <IconSend size={18} />
                  </button>
                </form>
                <p className="text-[10px] text-gray-400 mt-1.5 text-center">
                  Enter to send · Shift + Enter for a new line
                </p>
              </footer>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
