import { NextResponse } from "next/server";
import axios from "axios";

const rawBase = process.env.NEXT_PUBLIC_API_URL || "https://api.vyraconnect.in";
const BACKEND_API_BASE = rawBase.endsWith("/api") ? rawBase : `${rawBase.replace(/\/$/, "")}/api`;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = req.headers.get("authorization");

    const endpoint = `${BACKEND_API_BASE}/customer/profile/${id}`;
    const response = await axios.get(endpoint, {
      headers: authHeader ? { Authorization: authHeader } : {},
      timeout: 10000
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (err: any) {
    console.error("[PROFILE GET BY ID ERROR]", err.response?.data || err.message);
    const status = err.response?.status || 500;
    const data = err.response?.data || { error: err.message || "Failed to fetch profile" };
    return NextResponse.json(data, { status });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const authHeader = req.headers.get("authorization");

    const endpoint = `${BACKEND_API_BASE}/customer/profile/${id}`;
    const response = await axios.patch(endpoint, body, {
      headers: {
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {})
      },
      timeout: 10000
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (err: any) {
    console.error("[PROFILE UPDATE BY ID ERROR]", err.response?.data || err.message);
    const status = err.response?.status || 500;
    const data = err.response?.data || { error: err.message || "Failed to update profile" };
    return NextResponse.json(data, { status });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return PATCH(req, { params });
}
