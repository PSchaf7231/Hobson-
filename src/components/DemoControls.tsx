"use client";

import { useEffect, useState } from "react";
import type { Lead } from "@/lib/types";

interface Property {
  propertyId: string;
  propertyLabel: string;
}

export default function DemoControls({
  leads,
  onEvent,
}: {
  leads: Lead[];
  onEvent: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [leadId, setLeadId] = useState(leads[0]?.id ?? "");
  const [propertyId, setPropertyId] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/demo/properties")
      .then((r) => r.json())
      .then((d) => {
        setProperties(d.properties);
        setPropertyId(d.properties[0]?.propertyId ?? "");
      });
  }, []);

  async function fire(type: "view" | "share", times = 1) {
    const property = properties.find((p) => p.propertyId === propertyId);
    if (!property || !leadId) return;
    setBusy(true);
    for (let i = 0; i < times; i++) {
      await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId,
          type,
          propertyId: property.propertyId,
          propertyLabel: property.propertyLabel,
          sharedWith: type === "share" ? "a friend" : undefined,
        }),
      });
    }
    setBusy(false);
    onEvent();
  }

  return (
    <div className="mt-6 mb-4 rounded-xl border border-white/10 bg-white/[0.02]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400"
      >
        {open ? "▾" : "▸"} Demo: simulate buying-signal activity
      </button>
      {open && (
        <div className="px-4 pb-4 flex flex-col gap-2.5">
          <p className="text-[10.5px] text-slate-500 leading-relaxed">
            In production these events come from your listing site / IDX widget hitting{" "}
            <code className="text-slate-400">POST /api/events</code>. Use these to see a lead flip
            to Hot in real time, with a spoken alert.
          </p>
          <div className="flex gap-2">
            <select
              value={leadId}
              onChange={(e) => setLeadId(e.target.value)}
              className="flex-1 bg-navy-mid border border-white/10 text-white text-[11px] rounded-md px-2 py-1.5"
            >
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
            <select
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              className="flex-1 bg-navy-mid border border-white/10 text-white text-[11px] rounded-md px-2 py-1.5"
            >
              {properties.map((p) => (
                <option key={p.propertyId} value={p.propertyId}>
                  {p.propertyLabel}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              disabled={busy}
              onClick={() => fire("view", 3)}
              className="flex-1 rounded-md bg-gold/15 border border-gold/30 text-gold-light text-[10.5px] font-semibold py-2 disabled:opacity-50"
            >
              View same property 3× (24h)
            </button>
            <button
              disabled={busy}
              onClick={() => fire("share", 1)}
              className="flex-1 rounded-md bg-gold/15 border border-gold/30 text-gold-light text-[10.5px] font-semibold py-2 disabled:opacity-50"
            >
              Share with someone
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
