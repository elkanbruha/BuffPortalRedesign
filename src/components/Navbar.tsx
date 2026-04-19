"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { Avatar } from "./Avatar";
import { NotificationBell } from "./NotificationBell";
import {
  IconBook,
  IconCalendar,
  IconChat,
  IconClose,
  IconGraduation,
  IconHome,
  IconMenu,
  IconUsers,
} from "./icons";

type NavLink = {
  href: string;
  label: string;
  Icon: typeof IconHome;
  match: RegExp;
};

const LINKS: NavLink[] = [
  { href: "/", label: "Dashboard", Icon: IconHome, match: /^\/$/ },
  { href: "/schedule", label: "Schedule", Icon: IconCalendar, match: /^\/schedule/ },
  { href: "/advisors", label: "Advisors", Icon: IconUsers, match: /^\/advisors/ },
  { href: "/degree", label: "Degree", Icon: IconGraduation, match: /^\/degree/ },
  { href: "/messages", label: "Messages", Icon: IconChat, match: /^\/messages/ },
  { href: "/resources", label: "Resources", Icon: IconBook, match: /^\/resources/ },
];

function isActive(path: string, match: RegExp) {
  return match.test(path);
}

export function Navbar() {
  const pathname = usePathname() || "/";
  const { student } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileOpen]);

  const closeDrawer = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-40 bg-black border-b border-gray-800 shadow-sm">
      <nav className="flex items-center justify-between px-4 sm:px-6 h-14 sm:h-16">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/buffalo-logo.png"
              alt="CU Buffs Logo"
              width={36}
              height={36}
              className="h-8 w-8 sm:h-9 sm:w-9 object-contain"
              priority
            />
            <span className="text-sm sm:text-base font-semibold text-white tracking-tight">
              CU Buffs Advising
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-0.5">
          {LINKS.map((l) => {
            const active = isActive(pathname, l.match);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? "text-white bg-gray-900"
                    : "text-gray-300 hover:text-white hover:bg-gray-900"
                }`}
              >
                <l.Icon size={16} />
                {l.label}
                {active && (
                  <span
                    className="absolute -bottom-[13px] left-3 right-3 h-[2px] rounded-full"
                    style={{ backgroundColor: "#CBB983" }}
                    aria-hidden
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <NotificationBell />
          <button
            type="button"
            className="hidden md:inline-flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-full hover:bg-gray-900"
            aria-label="Account menu"
          >
            <Avatar name={student.name} accent="gold" size={28} />
            <span className="text-xs font-medium text-gray-200">
              {student.name.split(" ")[0]}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md text-gray-300 hover:text-white hover:bg-gray-900"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <IconClose size={20} /> : <IconMenu size={22} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-14 z-40 bg-black/40" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute top-0 left-0 right-0 bg-black text-gray-100 shadow-lg border-b border-gray-800 animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-3 py-3 flex items-center gap-2 border-b border-gray-800">
              <Avatar name={student.name} accent="gold" size={36} />
              <div>
                <div className="text-sm font-semibold text-white">
                  {student.name}
                </div>
                <div className="text-[11px] text-gray-400">
                  {student.major} · {student.year}
                </div>
              </div>
            </div>
            <ul className="py-2">
              {LINKS.map((l) => {
                const active = isActive(pathname, l.match);
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={closeDrawer}
                      className={`flex items-center gap-3 px-4 py-3 text-sm ${
                        active
                          ? "bg-gray-900 text-white"
                          : "text-gray-200 hover:bg-gray-900"
                      }`}
                    >
                      <l.Icon size={18} />
                      {l.label}
                      {active && (
                        <span
                          className="ml-auto h-2 w-2 rounded-full"
                          style={{ backgroundColor: "#CBB983" }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
