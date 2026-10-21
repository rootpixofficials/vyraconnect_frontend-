import { NextResponse } from "next/server";
import axios from "axios";

const rawBase = process.env.NEXT_PUBLIC_API_URL || "https://api.vyraconnect.in";
const BACKEND_API_BASE = rawBase.endsWith("/api") ? rawBase : `${rawBase.replace(/\/$/, "")}/api`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const response = await axios.post(`${BACKEND_API_BASE}/auth/otp/send`, body, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (err: any) {
    console.error("[OTP SEND ERROR]", err.response?.data || err.message);
    const status = err.response?.status || 500;
    const data = err.response?.data || { error: err.message || "Failed to send OTP" };
    return NextResponse.json(data, { status });
  }
}
