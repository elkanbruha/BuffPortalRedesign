"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { MONTHS_SHORT } from "@/lib/dateUtils";
import type { Notification, NotificationKind } from "@/lib/mockData";
import {
  IconAlert,
  IconBell,
  IconCalendar,
  IconCheck,
  IconClose,
  IconLightbulb,
  IconMessage,
} from "./icons";

const KIND_CONFIG: Record<
  NotificationKind,
  { color: string; bg: string; Icon: typeof IconBell }
> = {
  reminder: { color: "#8a7a44", bg: "rgba(203, 185, 131, 0.18)", Icon: IconCalendar },
  alert: { color: "#b91c1c", bg: "rgba(220, 38, 38, 0.12)", Icon: IconAlert },
  message: { color: "#2563eb", bg: "rgba(96, 165, 250, 0.18)", Icon: IconMessage },
  tip: { color: "#ca8a04", bg: "rgba(234, 179, 8, 0.18)", Icon: IconLightbulb },
  deadline: { color: "#a21caf", bg: "rgba(168, 85, 247, 0.18)", Icon: IconCalendar },
};

function formatDate(iso: string) {
  const d = new Date(iso + (iso.includes("T") ? "" : "T00:00:00"));
  if (Number.isNaN(d.getTime())) return iso;
  return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`;
}

function NotificationItem({ n }: { n: Notification }) {
  const { dismissNotification, markNotificationRead, setNotificationDrawerOpen } =
    useAppStore();
  const cfg = KIND_CONFIG[n.kind];
  const Icon = cfg.Icon;
  return (
    <div
      className={`relative rounded-xl border p-3 flex gap-3 transition-colors ${
        n.read
          ? "border-gray-200 bg-white"
          : "border-gray-200 bg-white shadow-sm"
      }`}
    >
      {!n.read && (
        <span
          className="absolute top-3 right-3 h-2 w-2 rounded-full"
          style={{ backgroundColor: "#CBB983" }}
          aria-label="Unread"
        />
      )}
      <div
        className="shrink-0 h-9 w-9 rounded-full flex items-center justify-center"
        style={{ backgroundColor: cfg.bg, color: cfg.color }}
      >
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <h4 className="text-sm font-semibold text-gray-800 leading-tight">
            {n.title}
          </h4>
          <span className="text-[10px] text-gray-400 shrink-0">
            {formatDate(n.date)}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1 leading-snug">{n.body}</p>
        <div className="mt-2 flex items-center gap-3">
          {n.actionHref && n.actionLabel && (
            <Link
              href={n.actionHref}
              onClick={() => {
                markNotificationRead(n.id);
                setNotificationDrawerOpen(false);
              }}
              className="text-xs font-semibold"
              style={{ color: "#8a7a44" }}
            >
              {n.actionLabel} →
            </Link>
          )}
          <button
            type="button"
            onClick={() => dismissNotification(n.id)}
            className="text-xs font-medium text-gray-400 hover:text-gray-600 ml-auto"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

export function NotificationDrawer() {
  const {
    notifications,
    notificationDrawerOpen,
    setNotificationDrawerOpen,
    markAllNotificationsRead,
    unreadCount,
  } = useAppStore();

  useEffect(() => {
    if (!notificationDrawerOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNotificationDrawerOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [notificationDrawerOpen, setNotificationDrawerOpen]);

  if (!notificationDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50" aria-modal="true" role="dialog">
      <div
        className="absolute inset-0 bg-black/30 animate-fade-in-up"
        onClick={() => setNotificationDrawerOpen(false)}
      />
      <aside className="absolute top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-xl flex flex-col animate-slide-in-right">
        <header className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Notifications</h2>
            <p className="text-xs text-gray-500">
              {unreadCount > 0
                ? `${unreadCount} unread`
                : "You're all caught up."}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllNotificationsRead}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <IconCheck size={14} />
                Mark all read
              </button>
            )}
            <button
              type="button"
              onClick={() => setNotificationDrawerOpen(false)}
              aria-label="Close notifications"
              className="inline-flex items-center justify-center h-8 w-8 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            >
              <IconClose size={18} />
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto subtle-scroll p-3 space-y-2">
          {notifications.length === 0 ? (
            <div className="text-center text-sm text-gray-400 py-10">
              Nothing to see here.
            </div>
          ) : (
            notifications.map((n) => <NotificationItem key={n.id} n={n} />)
          )}
        </div>
      </aside>
    </div>
  );
}
