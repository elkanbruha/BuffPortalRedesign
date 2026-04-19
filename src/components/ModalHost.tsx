"use client";

import { useAppStore } from "@/lib/store";
import { BookingModal } from "./BookingModal";

export function ModalHost() {
  const { bookingDraft } = useAppStore();
  if (!bookingDraft) return null;
  return <BookingModal />;
}
