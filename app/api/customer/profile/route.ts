import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.vyraconnect.in/api";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const mobile = searchParams.get("mobile");
    const authHeader = req.headers.get("authorization");

    const endpoint = id ? `${BACKEND_API_BASE}/customer/profile/${id}` : `${BACKEND_API_BASE}/customer/profile`;
    const response = await axios.get(endpoint, {
      params: { id, mobile },
      headers: authHeader ? { Authorization: authHeader } : {},
      timeout: 10000
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (err: any) {
    console.error("[PROFILE GET ERROR]", err.response?.data || err.message);
    const status = err.response?.status || 500;
    const data = err.response?.data || { error: err.message || "Failed to fetch profile" };
    return NextResponse.json(data, { status });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id") || body.id || body.customerId;
    const authHeader = req.headers.get("authorization");

    const endpoint = id ? `${BACKEND_API_BASE}/customer/profile/${id}` : `${BACKEND_API_BASE}/customer/profile`;
    const response = await axios.patch(endpoint, body, {
      headers: {
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {})
      },
      timeout: 10000
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (err: any) {
    console.error("[PROFILE UPDATE ERROR]", err.response?.data || err.message);
    const status = err.response?.status || 500;
    const data = err.response?.data || { error: err.message || "Failed to update profile" };
    return NextResponse.json(data, { status });
  }
}

export async function PUT(req: Request) {
  return PATCH(req);
}
