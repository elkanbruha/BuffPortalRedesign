"use client";

import { useAppStore } from "@/lib/store";
import { IconCheckCircle, IconClose, IconInfo, IconAlert } from "./icons";

const KIND_STYLES: Record<
  "success" | "info" | "error",
  { bar: string; Icon: typeof IconCheckCircle; iconColor: string }
> = {
  success: { bar: "#16a34a", Icon: IconCheckCircle, iconColor: "#16a34a" },
  info: { bar: "#60a5fa", Icon: IconInfo, iconColor: "#2563eb" },
  error: { bar: "#dc2626", Icon: IconAlert, iconColor: "#dc2626" },
};

export function ToastContainer() {
  const { toasts, dismissToast } = useAppStore();
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 w-[calc(100vw-2rem)] sm:w-[340px]">
      {toasts.map((t) => {
        const cfg = KIND_STYLES[t.kind];
        const Icon = cfg.Icon;
        return (
          <div
            key={t.id}
            role="status"
            className="relative bg-white rounded-xl border border-gray-200 shadow-lg pl-4 pr-10 py-3 flex items-start gap-3 animate-fade-in-up"
            style={{ borderLeft: `3px solid ${cfg.bar}` }}
          >
            <span className="mt-0.5 shrink-0" style={{ color: cfg.iconColor }}>
              <Icon size={18} />
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900">{t.title}</div>
              {t.body && (
                <div className="text-xs text-gray-600 mt-0.5">{t.body}</div>
              )}
            </div>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => dismissToast(t.id)}
              className="absolute top-1.5 right-1.5 inline-flex items-center justify-center h-7 w-7 text-gray-400 hover:text-gray-700 rounded"
            >
              <IconClose size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
