"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Lead, LeadStage } from "@/lib/types";
import { speak } from "@/lib/voice";
import LeadCard from "./LeadCard";
import CallOverlay from "./CallOverlay";
import BottomNav from "./BottomNav";
import DemoControls from "./DemoControls";
import GlobalHeader, { type FilterKey } from "./GlobalHeader";
import AddLeadModal from "./AddLeadModal";

interface Stats {
  hotToday: number;
  activeLeads: number;
  newThisWeek: number;
}

const POLL_MS = 4000;
const DAY_MS = 24 * 60 * 60 * 1000;
const FOLLOW_UP_STAGES: LeadStage[] = ["Inquired on", "Interested in", "Shown"];

export default function LeadsHome() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats>({ hotToday: 0, activeLeads: 0, newThisWeek: 0 });
  const [callTarget, setCallTarget] = useState<Lead | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [addLeadOpen, setAddLeadOpen] = useState(false);
  const lastAlertCheck = useRef<number>(Date.now());

  const refresh = useCallback(async () => {
    const res = await fetch("/api/leads");
    const data = await res.json();
    setLeads(data.leads);
    setStats(data.stats);
  }, []);

  const checkAlerts = useCallback(async () => {
    const since = lastAlertCheck.current;
    lastAlertCheck.current = Date.now();
    const res = await fetch(`/api/alerts?since=${since}`);
    const data = await res.json();
    if (data.alerts?.length) {
      speak(data.alerts[0].spokenLine);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(() => {
      refresh();
      checkAlerts();
    }, POLL_MS);
    return () => clearInterval(interval);
  }, [refresh, checkAlerts]);

  async function handleStageChange(id: string, stage: LeadStage) {
    setLeads((cur) => cur.map((l) => (l.id === id ? { ...l, stage } : l)));
    await fetch(`/api/leads/${id}/stage`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage }),
    });
  }

  async function markContacted(id: string, type: "call" | "text") {
    const at = Date.now();
    setLeads((cur) => cur.map((l) => (l.id === id ? { ...l, lastContactType: type, lastContactedAt: at } : l)));
    await fetch(`/api/leads/${id}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
  }

  function hearBrief() {
    const hot = leads.filter((l) => l.status === "hot");
    const names = hot.map((l) => l.name.split(" ")[0]).join(" and ");
    const line = hot.length
      ? `Good morning. You have ${leads.length} leads worth a look today. ${names} ${
          hot.length === 1 ? "is" : "are"
        } the most worth acting on. I'd start there.`
      : `Good morning. Nothing urgent yet — I'll let you know the moment something changes.`;
    speak(line);
  }

  const visibleLeads = useMemo(() => {
    const now = Date.now();
    let list = leads;

    switch (filter) {
      case "new":
        list = list.filter((l) => now - l.createdAt <= 7 * DAY_MS);
        break;
      case "active":
        list = list.filter((l) => l.status === "hot" || l.status === "warm");
        break;
      case "followup":
        list = list.filter((l) => FOLLOW_UP_STAGES.includes(l.stage));
        break;
      default:
        break;
    }

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.location.toLowerCase().includes(q) ||
          l.intentTag.toLowerCase().includes(q) ||
          l.hobsonNote.toLowerCase().includes(q)
      );
    }

    return list;
  }, [leads, filter, search]);

  return (
    <div
      className="min-h-dvh w-full flex flex-col relative"
      style={{ background: "radial-gradient(120% 90% at 50% 0%, #1a3050 0%, #0B1D33 55%)" }}
    >
      <GlobalHeader
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
        hotCount={stats.hotToday}
        onAddLead={() => setAddLeadOpen(true)}
      />

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-28">
        {/* morning brief */}
        <button
          onClick={hearBrief}
          className="w-full text-left relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-navy-light to-navy-mid p-4 mb-[18px] shadow-card"
        >
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold to-transparent" />
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-b from-[#f0da8a] to-gold flex items-center justify-center font-display font-bold text-navy text-[15px] shrink-0 shadow-[0_3px_8px_rgba(212,175,55,.4),inset_0_1px_0_rgba(255,255,255,.5)]">
              H
            </div>
            <div className="flex-1">
              <div className="text-[10.5px] font-bold text-gold tracking-wide uppercase">
                Hobson · Morning Brief · tap to hear
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Today, 8:00 AM</div>
            </div>
          </div>
          <div className="text-[12.5px] text-white/85 leading-relaxed">
            Good morning. You have <strong className="text-gold">{stats.hotToday} leads worth acting on today</strong>.{" "}
            {leads
              .filter((l) => l.status === "hot")
              .slice(0, 2)
              .map((l) => l.name.split(" ")[0])
              .join(" and ") || "Nobody's spiked yet"}
            {stats.hotToday > 0 ? " showed the strongest signal. I'd start there. Shall we?" : " — I'll flag it the moment something changes."}
          </div>
        </button>

        {/* stats row */}
        <div className="flex gap-2.5 mb-[18px]">
          <StatCard value={stats.hotToday} label="Hot Today" />
          <StatCard value={stats.activeLeads} label="Active Leads" />
          <StatCard value={stats.newThisWeek} label="New This Week" />
        </div>

        <div className="text-[9.5px] font-bold tracking-[2px] uppercase text-slate-400 mb-2.5 ml-1">
          Act Now — Hobson Says So
        </div>

        {visibleLeads.length === 0 && (
          <div className="text-center text-slate-500 text-[12px] py-10">
            No leads match this view yet.
          </div>
        )}

        {visibleLeads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onStageChange={(stage) => handleStageChange(lead.id, stage)}
            onCall={() => setCallTarget(lead)}
            onTextSent={() => markContacted(lead.id, "text")}
          />
        ))}

        <DemoControls leads={leads} onEvent={refresh} />
      </div>

      <BottomNav active="Leads" />

      {callTarget && (
        <CallOverlay
          name={callTarget.name}
          phone={callTarget.phone}
          onClose={() => setCallTarget(null)}
          onDialed={() => markContacted(callTarget.id, "call")}
        />
      )}

      {addLeadOpen && <AddLeadModal onClose={() => setAddLeadOpen(false)} onCreated={refresh} />}
    </div>
  );
}

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex-1 bg-card rounded-xl px-2 py-3 text-center border border-white/5 shadow-[0_6px_16px_-6px_rgba(0,0,0,.45),inset_0_1px_0_rgba(255,255,255,.06)]">
      <div className="font-display font-bold text-gold text-[20px]">{value}</div>
      <div className="text-[8.5px] font-semibold tracking-wide uppercase text-slate-400 mt-0.5">{label}</div>
    </div>
  );
}
