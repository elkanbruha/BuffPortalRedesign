"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  IconArrowRight,
  IconChevronDown,
  IconInfo,
  IconSearch,
  RESOURCE_ICONS,
} from "@/components/icons";
import { FAQS, RESOURCES, type Resource } from "@/lib/mockData";

const CATEGORIES: {
  key: "all" | Resource["category"];
  label: string;
}[] = [
  { key: "all", label: "All" },
  { key: "academic", label: "Academic" },
  { key: "tutoring", label: "Tutoring" },
  { key: "career", label: "Career" },
  { key: "wellness", label: "Wellness" },
  { key: "financial", label: "Financial" },
];

const CATEGORY_ACCENT: Record<Resource["category"], string> = {
  academic: "#CBB983",
  tutoring: "#60a5fa",
  career: "#4ade80",
  wellness: "#f472b6",
  financial: "#a78bfa",
};

function ResourceCard({ r }: { r: Resource }) {
  const Icon = RESOURCE_ICONS[r.icon];
  const accent = CATEGORY_ACCENT[r.category];
  return (
    <a
      href={r.href}
      className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col"
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className="inline-flex items-center justify-center h-10 w-10 rounded-xl"
          style={{ backgroundColor: `${accent}22`, color: accent }}
        >
          <Icon size={20} />
        </span>
        <span
          className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full text-gray-600 bg-gray-100"
        >
          {r.category}
        </span>
      </div>
      <h3 className="mt-3 text-sm font-semibold text-gray-900">{r.title}</h3>
      <p className="mt-1 text-xs text-gray-600 leading-relaxed flex-1">
        {r.description}
      </p>
      <span
        className="mt-3 inline-flex items-center gap-1 text-xs font-semibold group-hover:gap-2 transition-all"
        style={{ color: "#8a7a44" }}
      >
        Open <IconArrowRight size={12} />
      </span>
    </a>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full py-4 flex items-center justify-between gap-3 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-gray-900">{q}</span>
        <IconChevronDown
          size={18}
          className={`text-gray-400 transition-transform shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div className="collapse-grid" data-open={open}>
        <div className="collapse-inner">
          <div className="pb-4 text-sm text-gray-600 leading-relaxed">{a}</div>
        </div>
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]["key"]>(
    "all",
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RESOURCES.filter((r) => {
      if (category !== "all" && r.category !== category) return false;
      if (!q) return true;
      return (
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
      );
    });
  }, [query, category]);

  return (
    <div className="flex-1 px-4 sm:px-6 py-5 sm:py-8 max-w-[1400px] mx-auto w-full">
      <header className="mb-5 sm:mb-7 animate-fade-in-up">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Resources
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-1">
          Things that aren&apos;t your advisor
        </h1>
        <p className="text-sm text-gray-600 mt-1 max-w-2xl">
          The survey said students Google academic questions before checking here. We pulled everything worth bookmarking — tutoring, writing, wellness, financial aid, scholarships — into one place.
        </p>
      </header>

      {/* Search + filters */}
      <section className="mb-5 sm:mb-6 space-y-3 animate-fade-in-up" style={{ animationDelay: "60ms" }}>
        <div className="relative">
          <IconSearch
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search — e.g. 'writing', 'transfer credit', 'scholarships'"
            className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 text-sm placeholder-gray-400 bg-white shadow-sm focus:outline-none focus:border-gray-300"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => {
            const active = c.key === category;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setCategory(c.key)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                  active
                    ? "text-black border-transparent"
                    : "text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
                style={{
                  backgroundColor: active ? "#CBB983" : "white",
                }}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Resource grid */}
      <section className="mb-7 sm:mb-10">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
            <IconInfo size={18} className="mx-auto text-gray-300" />
            <p className="mt-2">
              No resources match. Try clearing the search or category filter.
            </p>
          </div>
        ) : (
          <div
            key={`${category}-${query}`}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 stagger-children"
          >
            {filtered.map((r) => (
              <ResourceCard key={r.id} r={r} />
            ))}
          </div>
        )}
      </section>

      {/* FAQ */}
      <section className="rounded-2xl border border-gray-200 bg-white shadow-md animate-fade-in-up" style={{ animationDelay: "180ms" }}>
        <header className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">
            Frequently asked
          </h2>
          <p className="text-[11px] text-gray-500">
            The same questions Google gets — with CU-specific answers.
          </p>
        </header>
        <div className="px-5">
          {FAQS.map((f) => (
            <FaqItem key={f.id} q={f.question} a={f.answer} />
          ))}
        </div>
      </section>

      <aside
        className="mt-6 rounded-2xl border p-5 flex items-start gap-3"
        style={{
          borderColor: "rgba(203, 185, 131, 0.4)",
          background: "linear-gradient(135deg, rgba(203,185,131,0.12), #ffffff)",
        }}
      >
        <IconInfo size={18} style={{ color: "#8a7a44" }} className="shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900">
            Still can&apos;t find it?
          </h3>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
            Message your advisor or drop in on General Advising on a weekend. Most questions that aren&apos;t on this page are 5-minute answers.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link
              href="/messages"
              className="inline-flex items-center gap-1 text-xs font-semibold"
              style={{ color: "#8a7a44" }}
            >
              Open messages <IconArrowRight size={12} />
            </Link>
            <Link
              href="/schedule"
              className="inline-flex items-center gap-1 text-xs font-semibold"
              style={{ color: "#8a7a44" }}
            >
              Book a time <IconArrowRight size={12} />
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
