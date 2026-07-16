import { NextResponse } from "next/server";
import { listDemoProperties } from "@/lib/store";

export async function GET() {
  return NextResponse.json({ properties: listDemoProperties() });
}
