import { NextResponse } from "next/server";
import axios from "axios";

const rawBase = process.env.NEXT_PUBLIC_API_URL || "https://api.vyraconnect.in";
const BACKEND_API_BASE = rawBase.endsWith("/api") ? rawBase : `${rawBase.replace(/\/$/, "")}/api`;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || searchParams.get("id");
    const mobile = searchParams.get("mobile");
    const authHeader = req.headers.get("authorization");

    const endpoint = userId ? `${BACKEND_API_BASE}/user/${userId}` : `${BACKEND_API_BASE}/user`;
    const response = await axios.get(endpoint, {
      params: { userId, mobile },
      headers: authHeader ? { Authorization: authHeader } : {},
      timeout: 10000
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (err: any) {
    console.error("[USER GET ERROR]", err.response?.data || err.message);
    const status = err.response?.status || 500;
    const data = err.response?.data || { error: err.message || "Failed to fetch user" };
    return NextResponse.json(data, { status });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const response = await axios.post(`${BACKEND_API_BASE}/user`, body, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (err: any) {
    console.error("[USER POST ERROR]", err.response?.data || err.message);
    const status = err.response?.status || 500;
    const data = err.response?.data || { error: err.message || "Failed to execute user action" };
    return NextResponse.json(data, { status });
  }
}
