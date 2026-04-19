"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ADVISORS,
  SEED_APPOINTMENTS,
  SEED_NOTIFICATIONS,
  SEED_THREADS,
  STUDENT,
  type Appointment,
  type AppointmentType,
  type AvailabilitySlot,
  type Notification,
  type Thread,
} from "./mockData";
import { localIsoDate } from "./dateUtils";

type Toast = {
  id: string;
  kind: "success" | "info" | "error";
  title: string;
  body?: string;
};

type BookingDraft = {
  slot: AvailabilitySlot;
  date: Date;
};

type StoreValue = {
  // Student + advisor
  student: typeof STUDENT;
  advisorId: string;
  setAdvisorId: (id: string, reason?: string) => void;

  // Appointments
  appointments: Appointment[];
  nextAppointment: Appointment | null;
  bookAppointment: (
    slot: AvailabilitySlot,
    date: Date,
    topic?: string,
  ) => Appointment;
  cancelAppointment: (id: string) => void;

  // Notifications
  notifications: Notification[];
  unreadCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  dismissNotification: (id: string) => void;

  // Messages
  threads: Thread[];
  sendMessage: (threadId: string, body: string) => void;
  markThreadRead: (threadId: string) => void;

  // Toasts
  toasts: Toast[];
  pushToast: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;

  // UI state
  notificationDrawerOpen: boolean;
  setNotificationDrawerOpen: (open: boolean) => void;
  bookingDraft: BookingDraft | null;
  setBookingDraft: (draft: BookingDraft | null) => void;
};

const AppStoreContext = createContext<StoreValue | null>(null);

function uid(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [advisorId, setAdvisorIdState] = useState<string>(STUDENT.advisorId);
  const [appointments, setAppointments] = useState<Appointment[]>(
    SEED_APPOINTMENTS,
  );
  const [notifications, setNotifications] = useState<Notification[]>(
    SEED_NOTIFICATIONS,
  );
  const [threads, setThreads] = useState<Thread[]>(SEED_THREADS);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [bookingDraft, setBookingDraft] = useState<BookingDraft | null>(null);

  const pushToast = useCallback((t: Omit<Toast, "id">) => {
    const id = uid("toast");
    setToasts((prev) => [...prev, { ...t, id }]);
    // Auto-dismiss after 4.5s
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const bookAppointment = useCallback(
    (slot: AvailabilitySlot, date: Date, topic?: string): Appointment => {
      const appt: Appointment = {
        id: uid("appt"),
        advisorId: slot.advisorId,
        date: localIsoDate(date),
        startHour: slot.startHour,
        endHour: slot.endHour,
        type: slot.type as AppointmentType,
        topic,
        status: "upcoming",
      };
      setAppointments((prev) => [...prev, appt]);
      const advisor = ADVISORS.find((a) => a.id === slot.advisorId);
      pushToast({
        kind: "success",
        title: "Appointment booked",
        body: `${advisor?.name ?? "Advisor"} · ${date.toDateString().slice(0, 10)}`,
      });
      return appt;
    },
    [pushToast],
  );

  const cancelAppointment = useCallback(
    (id: string) => {
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, status: "cancelled" as const } : a,
        ),
      );
      pushToast({ kind: "info", title: "Appointment cancelled" });
    },
    [pushToast],
  );

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const sendMessage = useCallback((threadId: string, body: string) => {
    if (!body.trim()) return;
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? {
              ...t,
              messages: [
                ...t.messages,
                {
                  id: uid("msg"),
                  from: "student" as const,
                  body: body.trim(),
                  timestamp: new Date().toISOString(),
                },
              ],
            }
          : t,
      ),
    );
  }, []);

  const markThreadRead = useCallback((threadId: string) => {
    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, unreadCount: 0 } : t)),
    );
  }, []);

  const setAdvisorId = useCallback(
    (id: string, reason?: string) => {
      setAdvisorIdState(id);
      const advisor = ADVISORS.find((a) => a.id === id);
      pushToast({
        kind: "success",
        title: "Advisor updated",
        body: advisor
          ? `Your advisor is now ${advisor.name}.`
          : "Your advisor has been updated.",
      });
      // reason currently only used for the toast body in the future; left as-is
      void reason;
    },
    [pushToast],
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const nextAppointment = useMemo<Appointment | null>(() => {
    const todayIso = localIsoDate(new Date());
    const candidates = appointments
      .filter((a) => a.status === "upcoming" && a.date >= todayIso)
      .sort((a, b) =>
        a.date === b.date ? a.startHour - b.startHour : a.date.localeCompare(b.date),
      );
    return candidates[0] ?? null;
  }, [appointments]);

  const value: StoreValue = {
    student: STUDENT,
    advisorId,
    setAdvisorId,
    appointments,
    nextAppointment,
    bookAppointment,
    cancelAppointment,
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    dismissNotification,
    threads,
    sendMessage,
    markThreadRead,
    toasts,
    pushToast,
    dismissToast,
    notificationDrawerOpen,
    setNotificationDrawerOpen,
    bookingDraft,
    setBookingDraft,
  };

  return (
    <AppStoreContext.Provider value={value}>
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) {
    throw new Error("useAppStore must be used inside <AppProvider>");
  }
  return ctx;
}
