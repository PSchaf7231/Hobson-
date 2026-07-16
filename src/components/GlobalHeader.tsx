"use client";

import { BellIcon, FilterIcon, PlusIcon, SearchIcon } from "./Icons";

export type FilterKey = "all" | "new" | "active" | "followup";

const TABS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All Leads" },
  { key: "new", label: "New" },
  { key: "active", label: "Active" },
  { key: "followup", label: "Follow-Up" },
];

interface GlobalHeaderProps {
  search: string;
  onSearchChange: (v: string) => void;
  filter: FilterKey;
  onFilterChange: (f: FilterKey) => void;
  hotCount: number;
  onAddLead: () => void;
}

export default function GlobalHeader({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  hotCount,
  onAddLead,
}: GlobalHeaderProps) {
  return (
    <div className="sticky top-0 z-40 bg-navy/95 backdrop-blur-md border-b border-white/5 shrink-0">
      {/* brand row */}
      <div className="flex items-center justify-between px-5 pt-[calc(env(safe-area-inset-top)+10px)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[9px] bg-gradient-to-b from-[#f0da8a] to-gold flex items-center justify-center font-display font-bold text-navy text-base shadow-[0_3px_8px_rgba(212,175,55,.4),inset_0_1px_0_rgba(255,255,255,.5)]">
            H
          </div>
          <div className="font-display font-bold text-white text-[17px]">
            Hobson <span className="text-gold">Concierge</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button aria-label="Notifications" className="relative w-8 h-8 flex items-center justify-center text-slate-300">
            <BellIcon className="w-5 h-5" />
            {hotCount > 0 && (
              <span className="absolute top-0 right-0 w-[15px] h-[15px] rounded-full bg-red-500 text-white text-[8.5px] font-bold flex items-center justify-center">
                {hotCount}
              </span>
            )}
          </button>
          <button
            onClick={onAddLead}
            aria-label="Add lead"
            className="w-8 h-8 rounded-full bg-gradient-to-b from-[#f0da8a] to-gold flex items-center justify-center text-navy shadow-[0_3px_8px_rgba(212,175,55,.4),inset_0_1px_0_rgba(255,255,255,.5)] active:scale-95 transition"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* search bar */}
      <div className="px-5 pb-3">
        <div className="relative flex items-center bg-card border border-white/10 rounded-xl px-3 py-2.5">
          <SearchIcon className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search leads, properties, or insights..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-slate-500 text-[12.5px] px-2.5"
          />
          <button aria-label="Advanced filters" className="text-slate-400 hover:text-gold-light shrink-0 pl-1">
            <FilterIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* status filter tabs */}
      <div className="flex gap-2 px-5 pb-3 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => {
          const isActive = filter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onFilterChange(tab.key)}
              className={`relative shrink-0 px-3.5 py-1.5 rounded-full text-[11.5px] font-semibold whitespace-nowrap transition ${
                isActive ? "bg-gold text-navy" : "bg-white/5 text-slate-300 border border-white/10"
              }`}
            >
              {tab.label}
              {tab.key === "new" && hotCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
