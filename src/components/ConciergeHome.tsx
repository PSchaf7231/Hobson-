"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Lead, SignalTrigger } from "@/lib/types";
import { speak } from "@/lib/voice";
import { AGENT_FULL_NAME } from "@/lib/texts";
import HobsonPill from "./HobsonPill";
import CascadeCard from "./CascadeCard";
import CallOverlay from "./CallOverlay";
import ActionSheet from "./ActionSheet";
import LeadsHome from "./LeadsHome";

const POLL_MS = 4000;

function cascadeParts(lead: Lead) {
  const trigger: SignalTrigger = lead.triggeredBy ?? "manual";
  const first = lead.name.split(" ")[0];
  const place = lead.intentTag.replace(/ - Buyer$/, "");
  const action =
    trigger === "shared"
      ? "just shared"
      : trigger === "repeat-viewing"
      ? "keeps coming back to"
      : trigger === "late-night"
      ? "was up late looking at"
      : "has been active on";
  return { first, place, action };
}

export default function ConciergeHome() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [open, setOpen] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [callTarget, setCallTarget] = useState<Lead | null>(null);
  const [textTarget, setTextTarget] = useState<Lead | null>(null);
  const lastAlertCheck = useRef<number>(Date.now());

  const refresh = useCallback(async () => {
    const res = await fetch("/api/leads");
    const data = await res.json();
    setLeads(data.leads);
  }, []);

  const checkAlerts = useCallback(async () => {
    const since = lastAlertCheck.current;
    lastAlertCheck.current = Date.now();
    const res = await fetch(`/api/alerts?since=${since}`);
    const data = await res.json();
    if (data.alerts?.length) {
      setOpen(true);
      setSpeaking(true);
      speak(data.alerts[0].spokenLine, () => setSpeaking(false));
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

  if (showDashboard) {
    return <LeadsHome onBack={() => setShowDashboard(false)} />;
  }

  const topLead = leads.find((l) => l.status === "hot") ?? leads.find((l) => l.status === "warm") ?? null;

  function speakLine() {
    if (speaking) return;
    const line = topLead
      ? (() => {
          const { first, place, action } = cascadeParts(topLead);
          return `${first} ${action} ${place}. Shall we?`;
        })()
      : "Nothing urgent yet. I'll let you know the moment something changes.";
    setSpeaking(true);
    speak(line, () => setSpeaking(false));
  }

  return (
    <div
      className="min-h-dvh w-full flex flex-col items-center px-6 pt-[calc(env(safe-area-inset-top)+72px)] pb-10"
      style={{ background: "radial-gradient(120% 90% at 50% 0%, #1a3050 0%, #0B1D33 55%)" }}
    >
      <div className="font-display font-bold text-gold text-4xl mb-8">H</div>

      <HobsonPill
        name={AGENT_FULL_NAME}
        open={open}
        speaking={speaking}
        onToggle={() => setOpen((o) => !o)}
        onSpeak={speakLine}
      />

      {open && (
        <CascadeCard
          hasLead={!!topLead}
          onCall={() => topLead && setCallTarget(topLead)}
          onText={() => topLead && setTextTarget(topLead)}
          onDetails={() => setShowDashboard(true)}
        >
          {topLead ? (
            (() => {
              const { first, place, action } = cascadeParts(topLead);
              return (
                <>
                  <span className="text-gold font-semibold">{first}</span> {action}{" "}
                  <span className="text-gold font-semibold">{place}</span>. Shall we?
                </>
              );
            })()
          ) : (
            "Nothing urgent yet — I'll flag it the moment something changes."
          )}
        </CascadeCard>
      )}

      {callTarget && (
        <CallOverlay
          name={callTarget.name}
          phone={callTarget.phone}
          onClose={() => setCallTarget(null)}
          onDialed={() => setCallTarget(null)}
        />
      )}

      {textTarget && (
        <ActionSheet
          label={textTarget.textOptions[0]?.label ?? "Text"}
          initialMessage={textTarget.textOptions[0]?.message ?? ""}
          onClose={() => setTextTarget(null)}
          onSend={(message) => {
            const digits = textTarget.phone.replace(/[^0-9+]/g, "");
            window.location.href = `sms:${digits}?&body=${encodeURIComponent(message)}`;
            setTextTarget(null);
          }}
        />
      )}
    </div>
  );
}
