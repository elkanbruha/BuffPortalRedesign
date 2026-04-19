"use client";

import { useAppStore } from "@/lib/store";
import { IconBell } from "./icons";

export function NotificationBell() {
  const { unreadCount, setNotificationDrawerOpen } = useAppStore();
  return (
    <button
      type="button"
      aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
      onClick={() => setNotificationDrawerOpen(true)}
      className="relative inline-flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full text-gray-300 hover:text-white hover:bg-gray-900 transition-colors"
    >
      <IconBell size={20} />
      {unreadCount > 0 && (
        <span
          className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-semibold text-black flex items-center justify-center animate-pulse-dot"
          style={{ backgroundColor: "#CBB983" }}
          aria-hidden
        >
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  );
}
