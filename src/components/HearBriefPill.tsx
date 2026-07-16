"use client";

import { SpeakerIcon } from "./Icons";

interface HearBriefPillProps {
  onTap: () => void;
  speaking: boolean;
}

export default function HearBriefPill({ onTap, speaking }: HearBriefPillProps) {
  return (
    <button
      onClick={onTap}
      aria-label="Hear your Hobson brief"
      className={`fixed bottom-[88px] left-1/2 -translate-x-1/2 z-40 flex items-center gap-3.5 w-[min(88%,440px)] min-h-[72px] px-5 rounded-full bg-navy-mid/95 backdrop-blur-md border transition active:scale-[0.97] ${
        speaking ? "border-gold shadow-[0_10px_30px_rgba(212,175,55,.35),0_0_0_1px_rgba(212,175,55,.3)]" : "border-gold/50 shadow-[0_10px_28px_rgba(0,0,0,.5)]"
      }`}
    >
      <span className="shrink-0 w-11 h-11 rounded-full bg-gradient-to-b from-[#f0da8a] to-gold flex items-center justify-center font-display font-bold text-navy text-lg shadow-[0_3px_8px_rgba(212,175,55,.4),inset_0_1px_0_rgba(255,255,255,.5)]">
        H
      </span>
      <span className="flex-1 text-left text-gold text-[12px] font-semibold uppercase tracking-wide leading-tight">
        {speaking ? "Speaking…" : "Tap to hear your brief"}
      </span>
      <span
        className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-gold transition ${
          speaking ? "bg-gold/20 animate-pulse" : "bg-gold/10"
        }`}
      >
        <SpeakerIcon className="w-4.5 h-4.5" />
      </span>
    </button>
  );
}
