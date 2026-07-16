import type {
  ContactType,
  HobsonAlert,
  Lead,
  LeadCreateInput,
  LeadEventInput,
  LeadStage,
  ShareEvent,
  SignalTrigger,
  ViewEvent,
} from "./types";
import { generateHobsonNote, generateTextOptions } from "./texts";

const DAY_MS = 24 * 60 * 60 * 1000;
const REPEAT_VIEW_THRESHOLD = 3;

// In-memory store for the MVP. Survives for the life of the server process —
// swap for a real DB (Postgres/Vercel KV) once there's a CRM to back it with.
const leads = new Map<string, Lead>();
const alerts: HobsonAlert[] = [];

function baseLead(overrides: Partial<Lead> & Pick<Lead, "id" | "name" | "phone" | "location" | "priceRange" | "intentTag" | "stage" | "activitySummary" | "createdAt" | "lastActiveAt">): Lead {
  return {
    thumbnailInitials: initials(overrides.name),
    status: "new",
    hobsonNote: "",
    textOptions: [],
    triggeredBy: null,
    viewEvents: [],
    shareEvents: [],
    becameHotAt: null,
    lastContactType: null,
    lastContactedAt: null,
    ...overrides,
  };
}

function seed() {
  const now = Date.now();

  const jennifer = baseLead({
    id: "jennifer-martinez",
    name: "Jennifer Martinez",
    phone: "(561) 482-9201",
    location: "Delray Beach",
    priceRange: "$1.2M–$1.8M",
    intentTag: "14 Boca Bridges Way - Buyer",
    stage: "Shown",
    activitySummary: "8 homes viewed · asked about pools · filtered Boca Bridges · active 2h ago",
    lastActiveAt: now - 1000 * 60 * 60 * 2,
    createdAt: now - 1000 * 60 * 60 * 24 * 6,
  });

  const marcus = baseLead({
    id: "marcus-thompson",
    name: "Marcus Thompson",
    phone: "(561) 334-7788",
    location: "Boca Raton",
    priceRange: "$2M–$3M",
    intentTag: "9 Boca Bridges Court - Buyer",
    stage: "Interested in",
    activitySummary: "Visited at midnight · asked about Boca Bridges · 5 homes viewed · 2 saved",
    lastActiveAt: now - 1000 * 60 * 60 * 9,
    createdAt: now - 1000 * 60 * 60 * 24 * 2,
  });

  const isabella = baseLead({
    id: "isabella-rossi",
    name: "Isabella Rossi",
    phone: "(561) 902-4471",
    location: "Palm Beach",
    priceRange: "$4.5M–$6M",
    intentTag: "212 Ocean Blvd - Buyer",
    stage: "Interested in",
    activitySummary: "Shared listing with a friend · 6 homes viewed · asked about dock access",
    lastActiveAt: now - 1000 * 60 * 30,
    createdAt: now - 1000 * 60 * 60 * 24 * 1,
  });

  const sophia = baseLead({
    id: "sophia-chen",
    name: "Sophia Chen",
    phone: "(561) 771-2298",
    location: "Highland Beach",
    priceRange: "$1.8M–$2.4M",
    intentTag: "The Sabbia Penthouse - Buyer",
    stage: "Inquired on",
    activitySummary: "2 homes viewed · saved 1 · asked about HOA fees · active 5h ago",
    lastActiveAt: now - 1000 * 60 * 60 * 5,
    createdAt: now - 1000 * 60 * 60 * 24 * 3,
    status: "warm",
    triggeredBy: "manual",
    hobsonNote: generateHobsonNote({ name: "Sophia Chen" }, "manual"),
    textOptions: generateTextOptions({ name: "Sophia Chen", location: "Highland Beach" }, "manual", "The Sabbia Penthouse"),
  });

  const david = baseLead({
    id: "david-whitfield",
    name: "David Whitfield",
    phone: "(561) 448-6620",
    location: "Manalapan",
    priceRange: "$6M–$9M",
    intentTag: "8 Ocean Estates Dr - Buyer",
    stage: "Inquired on",
    activitySummary: "Just inquired · no site activity yet",
    lastActiveAt: now - 1000 * 60 * 60 * 30,
    createdAt: now - 1000 * 60 * 60 * 20,
    hobsonNote: "David just came in through the estate inquiry form — no browsing history yet, but waterfront buyers at this price point move fast once they engage. Worth a personal welcome call.",
    textOptions: generateTextOptions({ name: "David Whitfield", location: "Manalapan" }, "manual", "8 Ocean Estates Dr"),
  });

  for (const l of [jennifer, marcus, isabella, sophia, david]) {
    leads.set(l.id, l);
  }

  // Feed seeded activity through the real signal engine so status/copy come
  // from the same rule every future lead uses — nothing here is hardcoded.
  const jenniferViews: ViewEvent[] = [
    { propertyId: "boca-bridges-14", propertyLabel: "14 Boca Bridges Way", at: now - 1000 * 60 * 60 * 20 },
    { propertyId: "boca-bridges-14", propertyLabel: "14 Boca Bridges Way", at: now - 1000 * 60 * 60 * 10 },
    { propertyId: "boca-bridges-14", propertyLabel: "14 Boca Bridges Way", at: now - 1000 * 60 * 60 * 2 },
  ];
  for (const v of jenniferViews) {
    recordEvent({ leadId: jennifer.id, type: "view", propertyId: v.propertyId, propertyLabel: v.propertyLabel }, v.at);
  }

  recordEvent(
    { leadId: marcus.id, type: "view", propertyId: "boca-bridges-9", propertyLabel: "9 Boca Bridges Court" },
    now - 1000 * 60 * 60 * 9
  );

  recordEvent(
    {
      leadId: isabella.id,
      type: "share",
      propertyId: "ocean-blvd-212",
      propertyLabel: "212 Ocean Blvd",
      sharedWith: "a friend",
    },
    now - 1000 * 60 * 30
  );
}

function countRecentSamePropertyViews(events: ViewEvent[], propertyId: string, at: number) {
  return events.filter((e) => e.propertyId === propertyId && at - e.at <= DAY_MS).length;
}

function isLateNight(at: number) {
  const hour = new Date(at).getHours();
  return hour >= 0 && hour < 6;
}

function recomputeStatus(lead: Lead, at: number): { status: Lead["status"]; trigger: SignalTrigger | null; propertyLabel?: string } {
  if (lead.shareEvents.length > 0) {
    const latest = lead.shareEvents[lead.shareEvents.length - 1];
    return { status: "hot", trigger: "shared", propertyLabel: latest.propertyLabel };
  }

  for (const v of lead.viewEvents) {
    if (countRecentSamePropertyViews(lead.viewEvents, v.propertyId, at) >= REPEAT_VIEW_THRESHOLD) {
      return { status: "hot", trigger: "repeat-viewing", propertyLabel: v.propertyLabel };
    }
  }

  const recentLateNight = lead.viewEvents.find((v) => isLateNight(v.at) && at - v.at <= DAY_MS);
  if (recentLateNight) {
    return { status: "warm", trigger: "late-night", propertyLabel: recentLateNight.propertyLabel };
  }

  if (lead.viewEvents.length > 0 && at - lead.lastActiveAt <= 2 * DAY_MS) {
    return { status: "warm", trigger: lead.triggeredBy, propertyLabel: undefined };
  }

  return { status: lead.status === "hot" || lead.status === "warm" ? lead.status : "new", trigger: lead.triggeredBy };
}

export function recordEvent(input: LeadEventInput, at: number = Date.now()): { lead: Lead; alert: HobsonAlert | null } {
  if (leads.size === 0) seed();
  const lead = leads.get(input.leadId);
  if (!lead) throw new Error(`Unknown lead: ${input.leadId}`);

  if (input.type === "view") {
    const event: ViewEvent = { propertyId: input.propertyId, propertyLabel: input.propertyLabel, at };
    lead.viewEvents.push(event);
    lead.intentTag = `${input.propertyLabel} - Buyer`;
  } else {
    const event: ShareEvent = {
      propertyId: input.propertyId,
      propertyLabel: input.propertyLabel,
      sharedWith: input.sharedWith,
      at,
    };
    lead.shareEvents.push(event);
  }

  lead.lastActiveAt = at;
  // Fresh activity means the agent should notice it again.
  lead.lastContactType = null;
  lead.lastContactedAt = null;

  const wasHot = lead.status === "hot";
  const { status, trigger, propertyLabel } = recomputeStatus(lead, at);
  lead.status = status;

  let alert: HobsonAlert | null = null;

  // Always regenerate copy on fresh activity, even when no rule promoted the
  // lead to hot/warm — an activity update with no trigger still deserves an
  // up-to-date note, so this must never depend on `trigger` being truthy.
  const effectiveTrigger = trigger ?? lead.triggeredBy ?? "manual";
  lead.triggeredBy = effectiveTrigger;
  lead.hobsonNote = generateHobsonNote(lead, effectiveTrigger, propertyLabel);
  lead.textOptions = generateTextOptions(lead, effectiveTrigger, propertyLabel);

  if (status === "hot" && trigger) {
    lead.becameHotAt = wasHot ? lead.becameHotAt ?? at : at;

    if (!wasHot) {
      const spokenLine = `${lead.name} would be a good lead to call or text.`;
      alert = { leadId: lead.id, name: lead.name, phone: lead.phone, trigger, spokenLine, at };
      alerts.unshift(alert);
    }
  }

  leads.set(lead.id, lead);
  return { lead, alert };
}

export function markContacted(id: string, type: ContactType): Lead | undefined {
  if (leads.size === 0) seed();
  const lead = leads.get(id);
  if (!lead) return undefined;
  lead.lastContactType = type;
  lead.lastContactedAt = Date.now();
  leads.set(id, lead);
  return lead;
}

export function getLeads(): Lead[] {
  if (leads.size === 0) seed();
  return [...leads.values()].sort((a, b) => {
    const rank = (l: Lead) => {
      if (l.lastContactedAt) return 3;
      if (l.status === "hot") return 0;
      if (l.status === "warm") return 1;
      return 2;
    };
    const ra = rank(a);
    const rb = rank(b);
    if (ra !== rb) return ra - rb;
    return b.lastActiveAt - a.lastActiveAt;
  });
}

export function getLead(id: string): Lead | undefined {
  if (leads.size === 0) seed();
  return leads.get(id);
}

export function setStage(id: string, stage: LeadStage): Lead | undefined {
  if (leads.size === 0) seed();
  const lead = leads.get(id);
  if (!lead) return undefined;
  lead.stage = stage;
  leads.set(id, lead);
  return lead;
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

function slugify(name: string) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  let id = base || "lead";
  let n = 1;
  while (leads.has(id)) {
    id = `${base}-${++n}`;
  }
  return id;
}

export function addLead(input: LeadCreateInput): Lead {
  if (leads.size === 0) seed();
  const now = Date.now();
  const lead = baseLead({
    id: slugify(input.name),
    name: input.name,
    phone: input.phone,
    location: input.location,
    priceRange: input.priceRange || "Not specified",
    intentTag: `${input.location} - Buyer`,
    stage: "Inquired on",
    activitySummary: "Just added · no activity tracked yet",
    lastActiveAt: now,
    createdAt: now,
    hobsonNote: "Freshly added — I'll flag this one the moment they show real signal.",
    textOptions: generateTextOptions({ name: input.name, location: input.location }, "manual"),
  });
  leads.set(lead.id, lead);
  return lead;
}

export function getStats(leadList: Lead[]) {
  const now = Date.now();
  return {
    hotToday: leadList.filter((l) => l.status === "hot").length,
    activeLeads: leadList.length,
    newThisWeek: leadList.filter((l) => now - l.createdAt <= 7 * DAY_MS).length,
  };
}

export function getRecentAlerts(sinceMs: number): HobsonAlert[] {
  return alerts.filter((a) => a.at >= sinceMs);
}

export function listDemoProperties() {
  return [
    { propertyId: "boca-bridges-14", propertyLabel: "14 Boca Bridges Way" },
    { propertyId: "delray-ocean-2", propertyLabel: "2 Delray Ocean Ave" },
    { propertyId: "boca-bridges-9", propertyLabel: "9 Boca Bridges Court" },
  ];
}
