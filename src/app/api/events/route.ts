import { NextResponse } from "next/server";
import { recordEvent } from "@/lib/store";
import type { LeadEventInput } from "@/lib/types";

// The real integration point: a property-listing site, IDX widget, or share
// button posts here whenever a lead views or shares a property. The signal
// engine in lib/store.ts decides whether that flips the lead to "hot".
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (
    !body ||
    typeof body.leadId !== "string" ||
    (body.type !== "view" && body.type !== "share") ||
    typeof body.propertyId !== "string" ||
    typeof body.propertyLabel !== "string"
  ) {
    return NextResponse.json({ error: "Invalid event payload" }, { status: 400 });
  }

  const input: LeadEventInput = {
    leadId: body.leadId,
    type: body.type,
    propertyId: body.propertyId,
    propertyLabel: body.propertyLabel,
    sharedWith: typeof body.sharedWith === "string" ? body.sharedWith : undefined,
  };

  try {
    const { lead, alert } = recordEvent(input);
    return NextResponse.json({ lead, alert });
  } catch {
    return NextResponse.json({ error: "Unknown lead" }, { status: 404 });
  }
}
