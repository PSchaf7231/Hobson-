"use client";

import type { ReactNode } from "react";
import { ChatIcon } from "./Icons";
import PhoneIcon from "./PhoneIcon";

interface CascadeCardProps {
  children: ReactNode;
  hasLead: boolean;
  onCall: () => void;
  onText: () => void;
  onDetails: () => void;
}

export default function CascadeCard({ children, hasLead, onCall, onText, onDetails }: CascadeCardProps) {
  return (
    <div className="w-[min(90%,460px)] mt-3 rounded-2xl border border-gold/40 bg-navy-mid/95 backdrop-blur-md shadow-[0_16px_40px_rgba(0,0,0,.55)] px-6 py-6 flex flex-col items-center text-center animate-fadeIn">
      <div className="text-gold text-base mb-3">✦</div>

      <p className="text-[15px] text-white/90 leading-relaxed font-display">{children}</p>

      {hasLead && (
        <>
          <div className="w-16 h-px bg-gold/30 my-5" />
          <div className="flex gap-10">
            <div className="flex flex-col items-center gap-1.5">
              <button
                onClick={onCall}
                aria-label="Call"
                className="w-14 h-14 rounded-full border-2 border-gold text-gold flex items-center justify-center active:scale-95 transition"
              >
                <PhoneIcon className="w-5 h-5" />
              </button>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold">Call</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <button
                onClick={onText}
                aria-label="Text"
                className="w-14 h-14 rounded-full border-2 border-gold text-gold flex items-center justify-center active:scale-95 transition"
              >
                <ChatIcon className="w-5 h-5" />
              </button>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold">Text</span>
            </div>
          </div>
        </>
      )}

      <button
        onClick={onDetails}
        className="mt-6 text-[10px] font-semibold uppercase tracking-widest text-slate-400 hover:text-gold transition"
      >
        Details →
      </button>
    </div>
  );
}
