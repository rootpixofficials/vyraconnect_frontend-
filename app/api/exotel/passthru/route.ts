import { NextResponse } from "next/server";

export async function HEAD() {
  return new Response(null, { status: 200 });
}

export async function GET() {
  return NextResponse.json({ status: "ok", message: "Passthru ready" });
}

export async function POST() {
  return NextResponse.json({ status: "ok", message: "Passthru verified" });
}
