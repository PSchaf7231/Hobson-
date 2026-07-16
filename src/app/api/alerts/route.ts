import { NextResponse } from "next/server";
import { getRecentAlerts } from "@/lib/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const since = Number(searchParams.get("since") ?? 0);
  return NextResponse.json({ alerts: getRecentAlerts(since) });
}
