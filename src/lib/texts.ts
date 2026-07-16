import type { Lead, SignalTrigger, TextOption } from "./types";

const AGENT_NAME = "Paul";

function firstName(name: string) {
  return name.split(" ")[0];
}

export function generateHobsonNote(
  lead: Pick<Lead, "name">,
  trigger: SignalTrigger,
  propertyLabel?: string
): string {
  const first = firstName(lead.name);
  switch (trigger) {
    case "repeat-viewing":
      return `${first} has looked at ${
        propertyLabel ?? "the same property"
      } three times in the last day. That's not browsing — that's a decision forming. One call closes this loop.`;
    case "shared":
      return `${first} just shared ${
        propertyLabel ?? "a listing"
      } with someone else. People only do that when they're already picturing themselves living there.`;
    case "late-night":
      return `${first} was active after midnight, looking at ${
        propertyLabel ?? "listings"
      }. Anyone browsing at that hour has a reason. Reach out before lunch.`;
    default:
      return `${first} has been active recently and is worth a check-in today.`;
  }
}

// Three labeled quick actions, not three tones of the same message — each is
// a distinct next step the agent can send with one tap.
export function generateTextOptions(
  lead: Pick<Lead, "name" | "location">,
  trigger: SignalTrigger,
  propertyLabel?: string
): TextOption[] {
  const first = firstName(lead.name);
  const place = propertyLabel ?? `homes in ${lead.location}`;

  return [
    {
      label: "Send available inventory",
      message: `${first}, it's ${AGENT_NAME}. Since you've been looking at ${place}, I pulled a few comparable homes that are currently available — want me to send them over?`,
    },
    {
      label: "Offer private viewing",
      message: `Hi ${first} — ${AGENT_NAME} here. I can set up a private showing of ${place} whenever works for you, no pressure. Want me to grab a time?`,
    },
    {
      label: "Follow up on layout",
      message: `${first}, following up — Hobson mentioned you've been focused on ${place}. Happy to walk you through the floor plan and layout details whenever you have a few minutes.`,
    },
  ];
}
