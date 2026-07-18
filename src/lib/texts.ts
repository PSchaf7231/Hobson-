import type { Lead, SignalTrigger, TextOption } from "./types";

const AGENT_NAME = "Paul";
export const AGENT_FULL_NAME = "Paul Schafranick";

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
      message: `Hi ${first}, it's ${AGENT_NAME}. Saw you checking out ${place} — want me to send a few similar homes that are available now?`,
    },
    {
      label: "Offer private viewing",
      message: `Hi ${first}, it's ${AGENT_NAME}. Want to see ${place} in person? Happy to set up a private showing whenever works.`,
    },
    {
      label: "Follow up on layout",
      message: `Hi ${first}, it's ${AGENT_NAME}. Noticed you've been eyeing ${place} — want me to walk you through the layout sometime?`,
    },
  ];
}
