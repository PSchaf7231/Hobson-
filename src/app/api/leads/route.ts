import { NextResponse } from "next/server";
import { addLead, getLeads, getStats } from "@/lib/store";

export async function GET() {
  const leads = getLeads();
  const stats = getStats(leads);
  return NextResponse.json({ leads, stats });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body.name !== "string" || !body.name.trim() || typeof body.phone !== "string" || !body.phone.trim()) {
    return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
  }

  const lead = addLead({
    name: body.name.trim(),
    phone: body.phone.trim(),
    location: typeof body.location === "string" && body.location.trim() ? body.location.trim() : "Unknown area",
    priceRange: typeof body.priceRange === "string" ? body.priceRange.trim() : undefined,
  });

  return NextResponse.json({ lead }, { status: 201 });
}
