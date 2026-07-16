"use client";

import { useState } from "react";

interface ActionSheetProps {
  label: string;
  initialMessage: string;
  onClose: () => void;
  onSend: (message: string) => void;
}

export default function ActionSheet({ label, initialMessage, onClose, onSend }: ActionSheetProps) {
  const [message, setMessage] = useState(initialMessage);

  function send() {
    onSend(message);
  }

  return (
    <div className="fixed inset-0 z-[105] flex items-end justify-center animate-fadeIn">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full sm:max-w-sm bg-navy-mid border-t sm:border border-gold/30 rounded-t-2xl sm:rounded-2xl sm:mb-6 p-4 shadow-card">
        <div className="w-10 h-1 rounded-full bg-white/15 mx-auto mb-3 sm:hidden" />
        <div className="text-gold text-[9.5px] font-bold uppercase tracking-wider mb-2">
          Hobson&apos;s Suggested Text · {label}
        </div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className="w-full bg-navy border border-white/10 rounded-xl p-3 text-white/90 text-[13px] leading-relaxed outline-none focus:border-gold/50 resize-none"
        />
        <p className="text-slate-500 text-[10px] mt-1.5">Edit freely — Hobson drafted this, you send it.</p>
        <div className="flex gap-2 mt-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-white/10 text-slate-300 text-sm font-semibold py-2.5"
          >
            Cancel
          </button>
          <button
            onClick={send}
            disabled={!message.trim()}
            className="flex-[2] rounded-lg bg-gradient-to-b from-[#f0da8a] to-gold text-navy font-bold text-sm py-2.5 shadow-glow disabled:opacity-50"
          >
            Send Message →
          </button>
        </div>
      </div>
    </div>
  );
}
