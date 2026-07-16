import type { Lead } from "./types";

const HOUR_MS = 60 * 60 * 1000;
const STALE_HOURS = 20;

function reasonClause(lead: Lead): string {
  switch (lead.triggeredBy) {
    case "repeat-viewing":
      return `they looked at ${lead.intentTag.replace(/ - Buyer$/, "")} three times in the last 24 hours`;
    case "shared":
      return "they shared it with a friend";
    case "late-night":
      return "they were browsing it late last night";
    default:
      return "they've been active recently and worth a check-in";
  }
}

export function buildBriefLine(lead: Lead): string {
  return `I think it's a good idea to call or text ${lead.name} as ${reasonClause(lead)}.`;
}

const LAZY_JOKES = [
  "One might say opportunity, much like a fine tea, is best enjoyed when hot. Just a thought, of course.",
  "I do hope your day has been productive. Perhaps not *too* productive, as to overlook certain pressing matters?",
  "The early bird catches the worm. Though I suppose a well-rested bird might simply order takeout.",
  "I've been contemplating the virtues of patience. Even I have my limits when it comes to untapped potential.",
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function briefLineFor(lead: Lead, now: number = Date.now()): string {
  const staleMs = now - (lead.becameHotAt ?? lead.createdAt);
  const isStale = !lead.lastContactedAt && staleMs > STALE_HOURS * HOUR_MS;
  if (isStale) {
    return LAZY_JOKES[hashString(lead.id) % LAZY_JOKES.length];
  }
  return buildBriefLine(lead);
}
