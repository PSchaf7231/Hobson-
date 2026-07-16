import { NextResponse } from "next/server";
import { setStage } from "@/lib/store";
import type { LeadStage } from "@/lib/types";

const VALID_STAGES: LeadStage[] = [
  "Inquired on",
  "Interested in",
  "Not interested",
  "Shown",
  "Made offer",
  "Offer rejected",
  "Sent to client",
];

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json().catch(() => null);
  const stage = body?.stage;

  if (typeof stage !== "string" || !VALID_STAGES.includes(stage as LeadStage)) {
    return NextResponse.json({ error: "Invalid stage" }, { status: 400 });
  }

  const lead = setStage(params.id, stage as LeadStage);
  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  return NextResponse.json({ lead });
}
