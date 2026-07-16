"use client";

import { useState } from "react";

interface AddLeadModalProps {
  onClose: () => void;
  onCreated: () => void;
}

export default function AddLeadModal({ onClose, onCreated }: AddLeadModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError("Name and phone are required.");
      return;
    }
    setSaving(true);
    setError(null);
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, location, priceRange }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Couldn't add lead.");
      return;
    }
    onCreated();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[110] bg-black/70 flex items-end sm:items-center justify-center animate-fadeIn">
      <form
        onSubmit={submit}
        className="w-full sm:max-w-sm bg-navy-mid border border-white/10 rounded-t-2xl sm:rounded-2xl p-5 shadow-card"
      >
        <div className="text-white font-display font-bold text-lg mb-4">Add a lead</div>

        <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">Name *</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Doe"
          className="w-full mb-3 bg-navy border border-white/10 text-white text-sm rounded-lg px-3 py-2.5 outline-none focus:border-gold/50"
        />

        <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">Phone *</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="(555) 123-4567"
          className="w-full mb-3 bg-navy border border-white/10 text-white text-sm rounded-lg px-3 py-2.5 outline-none focus:border-gold/50"
        />

        <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">Area</label>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Delray Beach"
          className="w-full mb-3 bg-navy border border-white/10 text-white text-sm rounded-lg px-3 py-2.5 outline-none focus:border-gold/50"
        />

        <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">
          Price range
        </label>
        <input
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          placeholder="$1M–$1.5M"
          className="w-full mb-4 bg-navy border border-white/10 text-white text-sm rounded-lg px-3 py-2.5 outline-none focus:border-gold/50"
        />

        {error && <div className="text-red-400 text-xs mb-3">{error}</div>}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-white/10 text-slate-300 text-sm font-semibold py-2.5"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-lg bg-gradient-to-b from-[#f0da8a] to-gold text-navy font-bold text-sm py-2.5 disabled:opacity-60"
          >
            {saving ? "Adding…" : "Add Lead"}
          </button>
        </div>
      </form>
    </div>
  );
}
