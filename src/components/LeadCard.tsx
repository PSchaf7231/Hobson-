"use client";

import { useState } from "react";
import type { Lead, LeadStage } from "@/lib/types";
import { timeAgo } from "@/lib/time";
import PhoneIcon from "./PhoneIcon";
import ActionSheet from "./ActionSheet";

const STAGES: LeadStage[] = [
  "Inquired on",
  "Interested in",
  "Not interested",
  "Shown",
  "Made offer",
  "Offer rejected",
  "Sent to client",
];

interface LeadCardProps {
  lead: Lead;
  onStageChange: (stage: LeadStage) => void;
  onCall: () => void;
  onTextSent: (message: string) => void;
}

const STATUS_STYLES: Record<Lead["status"], string> = {
  hot: "bg-red-500/20 text-red-400",
  warm: "bg-orange-500/20 text-orange-400",
  new: "bg-slate-500/20 text-slate-300",
};

export default function LeadCard({ lead, onStageChange, onCall, onTextSent }: LeadCardProps) {
  const [openOption, setOpenOption] = useState<number | null>(null);
  const [ignoreOpen, setIgnoreOpen] = useState(false);

  const contacted = Boolean(lead.lastContactedAt);

  function toggleIgnore() {
    setIgnoreOpen((cur) => !cur);
  }

  function handleSend(message: string) {
    const digits = lead.phone.replace(/[^0-9+]/g, "");
    window.location.href = `sms:${digits}?&body=${encodeURIComponent(message)}`;
    onTextSent(message);
    setOpenOption(null);
  }

  return (
    <div
      className={`bg-card rounded-2xl border border-white/5 shadow-card p-4 mb-4 transition-opacity ${
        contacted ? "opacity-60" : "opacity-100"
      }`}
    >
      {/* header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-white font-bold text-[15px] truncate">{lead.name}</h3>
            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide shrink-0 ${STATUS_STYLES[lead.status]}`}>
              {lead.status}
            </span>
            {contacted && (
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide shrink-0 bg-emerald-500/20 text-emerald-400">
                Contacted
              </span>
            )}
          </div>
          <div className="text-gold-light text-[11.5px] mt-1 truncate">{lead.intentTag}</div>
        </div>
        <div className="text-[10px] text-slate-400 whitespace-nowrap pt-1 shrink-0">{timeAgo(lead.lastActiveAt)}</div>
      </div>

      {/* Hobson's insight */}
      <p className="text-white/80 text-[12px] leading-relaxed mt-3 italic">
        <span className="text-gold font-semibold not-italic">Hobson says: </span>
        {lead.hobsonNote}
      </p>

      <div className="text-[11px] text-slate-400 leading-relaxed mt-2">{lead.activitySummary}</div>

      {contacted && lead.lastContactedAt && (
        <div className="text-[10.5px] text-emerald-400 font-semibold mt-2">
          {lead.lastContactType === "call" ? "Called" : "Texted"} {timeAgo(lead.lastContactedAt)}
        </div>
      )}

      {/* quick-action text buttons */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        {lead.textOptions.map((opt, i) => (
          <button
            key={opt.label}
            onClick={() => setOpenOption(i)}
            className="rounded-lg border border-gold/25 bg-gold/5 hover:bg-gold/10 text-gold-light text-[10.5px] font-semibold px-2 py-2.5 text-center leading-tight transition active:scale-[0.97]"
          >
            {opt.label}
          </button>
        ))}
      </div>

      {openOption !== null && (
        <ActionSheet
          label={lead.textOptions[openOption].label}
          initialMessage={lead.textOptions[openOption].message}
          onClose={() => setOpenOption(null)}
          onSend={handleSend}
        />
      )}

      {/* stage + call */}
      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/5">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-[9px] font-bold uppercase tracking-wide text-slate-400 shrink-0">Stage</span>
          <select
            value={lead.stage}
            onChange={(e) => onStageChange(e.target.value as LeadStage)}
            className="flex-1 min-w-0 bg-gold/10 border border-gold/25 text-gold-light text-[11px] font-semibold rounded-md px-2 py-1.5"
          >
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onCall}
          aria-label={`Call ${lead.name}`}
          className="shrink-0 w-14 h-14 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 shadow-[0_8px_20px_-4px_rgba(16,185,129,.55),inset_0_1px_0_rgba(255,255,255,.4)] flex items-center justify-center active:scale-95 transition"
        >
          <PhoneIcon className="w-6 h-6 text-white" />
        </button>
      </div>

      <button
        onClick={toggleIgnore}
        className="mt-2 text-[10px] font-bold uppercase tracking-wide text-slate-500 hover:text-slate-300"
      >
        Ignore
      </button>

      {ignoreOpen && (
        <div className="mt-2 rounded-lg bg-gold/10 px-3 py-2 text-[11px] text-gold italic animate-fadeIn">
          One tap. {lead.name.split(" ")[0]} is showing real signal and you still haven&apos;t reached out. That commission won&apos;t spend itself.
        </div>
      )}
    </div>
  );
}
