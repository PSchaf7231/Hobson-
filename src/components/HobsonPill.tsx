"use client";

import { SpeakerIcon } from "./Icons";

interface HobsonPillProps {
  name: string;
  open: boolean;
  speaking: boolean;
  onToggle: () => void;
  onSpeak: () => void;
}

export default function HobsonPill({ name, open, speaking, onToggle, onSpeak }: HobsonPillProps) {
  return (
    <button
      onClick={onToggle}
      aria-expanded={open}
      aria-label="Hobson"
      className="relative flex items-center gap-3 w-[min(90%,460px)] min-h-[72px] px-6 rounded-full bg-gradient-to-b from-[#f3dfa0] via-[#d4af37] to-[#b8892f] border-2 border-[#8a6a20] shadow-[0_10px_28px_rgba(0,0,0,.55),inset_0_1px_0_rgba(255,255,255,.65),inset_0_-2px_5px_rgba(0,0,0,.25)] active:scale-[0.97] transition"
    >
      <span className="font-display font-bold text-navy text-xl shrink-0">H</span>
      <span className="flex-1 font-script text-navy text-[26px] leading-none truncate text-left pt-1">{name}</span>
      <span
        role="button"
        aria-label={speaking ? "Stop speaking" : "Hear brief"}
        onClick={(e) => {
          e.stopPropagation();
          onSpeak();
        }}
        className={`shrink-0 text-navy/80 hover:text-navy transition ${speaking ? "animate-pulse" : ""}`}
      >
        <SpeakerIcon className="w-5 h-5" />
      </span>
    </button>
  );
}
