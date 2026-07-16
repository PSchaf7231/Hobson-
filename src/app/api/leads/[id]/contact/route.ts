import { NextResponse } from "next/server";
import { markContacted } from "@/lib/store";
import type { ContactType } from "@/lib/types";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json().catch(() => null);
  const type = body?.type;

  if (type !== "call" && type !== "text") {
    return NextResponse.json({ error: "type must be 'call' or 'text'" }, { status: 400 });
  }

  const lead = markContacted(params.id, type as ContactType);
  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  return NextResponse.json({ lead });
}
