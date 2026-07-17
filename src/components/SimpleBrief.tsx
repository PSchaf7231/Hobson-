"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Lead } from "@/lib/types";
import { briefLineFor } from "@/lib/brief";
import { speak, stopSpeaking } from "@/lib/voice";
import { MenuIcon, MessageIcon, ProfileIcon } from "./Icons";
import PhoneIcon from "./PhoneIcon";
import ActionSheet from "./ActionSheet";
import HobsonPill from "./HobsonPill";

const POLL_MS = 5000;
const AGENT_DISPLAY_NAME = "Paul Schafranick";

export default function SimpleBrief() {
  const [lead, setLead] = useState<Lead | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [chooserOpen, setChooserOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function refresh() {
      const res = await fetch("/api/leads");
      const data = await res.json();
      if (!cancelled) {
        const top = (data.leads as Lead[])[0] ?? null;
        setLead(top);
      }
    }
    refresh();
    const interval = setInterval(refresh, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const briefLine = lead ? briefLineFor(lead) : "Good morning. Nothing urgent yet — I'll let you know the moment something changes.";
  const allCaughtUp = lead ? Boolean(lead.lastContactedAt) : true;

  function hear() {
    speak(briefLine, () => setSpeaking(false));
    setSpeaking(true);
  }

  function toggleVoice(e: React.MouseEvent) {
    e.stopPropagation();
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    hear();
  }

  function dial() {
    if (!lead) return;
    window.location.href = `tel:${lead.phone.replace(/[^0-9+]/g, "")}`;
    fetch(`/api/leads/${lead.id}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "call" }),
    });
  }

  function openChooser() {
    setChooserOpen(true);
  }

  function chooseOption(i: number) {
    setSelectedOption(i);
  }

  function sendMessage(message: string) {
    if (!lead) return;
    const digits = lead.phone.replace(/[^0-9+]/g, "");
    window.location.href = `sms:${digits}?&body=${encodeURIComponent(message)}`;
    fetch(`/api/leads/${lead.id}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "text" }),
    });
    setSelectedOption(null);
    setChooserOpen(false);
  }

  return (
    <div
      className="min-h-dvh w-full flex flex-col items-center justify-center relative px-6"
      style={{ background: "radial-gradient(120% 90% at 50% 0%, #1a3050 0%, #0B1D33 55%)" }}
    >
      {!expanded ? (
        <div
          role="button"
          tabIndex={0}
          onClick={() => setExpanded(true)}
          onKeyDown={(e) => e.key === "Enter" && setExpanded(true)}
          style={{ width: "min(94%, 400px)" }}
          className="active:scale-[0.97] transition cursor-pointer"
        >
          <HobsonPill name={AGENT_DISPLAY_NAME} onToggleVoice={toggleVoice} />
        </div>
      ) : (
        <div style={{ width: "min(94%, 460px)" }} className="flex flex-col items-center animate-fadeIn">
          <div className="w-full flex items-center justify-between mb-10">
            <Link href="/dashboard" aria-label="More info" className="text-gold-light">
              <MenuIcon className="w-7 h-7" />
            </Link>
            <ProfileIcon className="w-7 h-7 text-gold-light" />
          </div>

          <div className="font-display font-bold text-gold text-8xl mb-4">H</div>
          <div className="text-gold text-base font-bold tracking-[3px] uppercase mb-2">Hobson&apos;s Morning Brief</div>
          <div className="text-gold/50 text-sm mb-10">✦</div>

          <div className="w-full border border-gold/50 rounded-2xl px-7 py-10 mb-12 text-center">
            <div className="text-gold/60 text-lg mb-5">✦</div>
            <p className="text-white/90 text-xl leading-relaxed">
              {allCaughtUp ? "All caught up — nothing urgent right now. I'll let you know the moment something changes." : briefLine}
            </p>
          </div>

          {!allCaughtUp && lead && (
            <div className="flex items-center gap-20">
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={dial}
                  aria-label={`Call ${lead.name}`}
                  className="w-[104px] h-[104px] rounded-full border-2 border-gold flex items-center justify-center active:scale-95 transition"
                >
                  <PhoneIcon className="w-10 h-10 text-gold" />
                </button>
                <span className="text-gold text-sm font-bold tracking-widest uppercase">Call</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={openChooser}
                  aria-label={`Text ${lead.name}`}
                  className="w-[104px] h-[104px] rounded-full border-2 border-gold flex items-center justify-center active:scale-95 transition"
                >
                  <MessageIcon className="w-10 h-10 text-gold" />
                </button>
                <span className="text-gold text-sm font-bold tracking-widest uppercase">Text</span>
              </div>
            </div>
          )}

          <button onClick={hear} className="mt-12 text-gold-light/70 text-sm uppercase tracking-wide">
            🔊 Hear this brief aloud
          </button>

          <Link href="/dashboard" className="mt-4 text-slate-500 text-sm uppercase tracking-wide">
            More info →
          </Link>
        </div>
      )}

      {chooserOpen && selectedOption === null && lead && (
        <div className="fixed inset-0 z-[105] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/70" onClick={() => setChooserOpen(false)} />
          <div className="relative w-full sm:max-w-sm bg-navy-mid border-t sm:border border-gold/30 rounded-t-2xl sm:rounded-2xl sm:mb-6 p-4">
            <div className="text-gold text-[9.5px] font-bold uppercase tracking-wider mb-3">
              Choose a message for {lead.name.split(" ")[0]}
            </div>
            <div className="flex flex-col gap-2">
              {lead.textOptions.map((opt, i) => (
                <button
                  key={opt.label}
                  onClick={() => chooseOption(i)}
                  className="text-left rounded-lg border border-gold/25 bg-gold/5 px-3 py-2.5"
                >
                  <div className="text-gold-light text-[11.5px] font-semibold">{opt.label}</div>
                  <div className="text-slate-400 text-[10.5px] mt-0.5 truncate">{opt.message}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setChooserOpen(false)}
              className="w-full mt-3 rounded-lg border border-white/10 text-slate-300 text-sm font-semibold py-2.5"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {selectedOption !== null && lead && (
        <ActionSheet
          label={lead.textOptions[selectedOption].label}
          initialMessage={lead.textOptions[selectedOption].message}
          onClose={() => setSelectedOption(null)}
          onSend={sendMessage}
        />
      )}
    </div>
  );
}
