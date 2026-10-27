import { NextRequest, NextResponse } from "next/server";

export async function HEAD() {
  return new Response(null, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  });
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const backendUrl = `https://api.vyraconnect.in/api/exotel/connect${url.search}`;
    
    const backendRes = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Accept": req.headers.get("accept") || "application/json"
      },
      cache: "no-store"
    });

    const data = await backendRes.json();
    return NextResponse.json(data, {
      status: backendRes.status,
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    });
  } catch (error: any) {
    console.error("[EXOTEL CONNECT PROXY ERROR]", error);
    // Bulletproof fallback
    const fallbackTarget = "09746910890";
    return NextResponse.json({
      select: "first",
      people: { number: [fallbackTarget] },
      dial_whom: fallbackTarget,
      destination: { numbers: [fallbackTarget] },
      record: false,
      time_limit: 90,
      max_conversation_duration: 90,
      timeout: 25
    }, {
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" }
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      body = await req.json().catch(() => ({}));
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData().catch(() => null);
      if (formData) {
        body = Object.fromEntries(formData.entries());
      }
    }

    const backendRes = await fetch("https://api.vyraconnect.in/api/exotel/connect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(body),
      cache: "no-store"
    });

    const data = await backendRes.json();
    return NextResponse.json(data, {
      status: backendRes.status,
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    });
  } catch (error: any) {
    console.error("[EXOTEL CONNECT PROXY POST ERROR]", error);
    const fallbackTarget = "09746910890";
    return NextResponse.json({
      select: "first",
      people: { number: [fallbackTarget] },
      dial_whom: fallbackTarget,
      destination: { numbers: [fallbackTarget] },
      record: false,
      time_limit: 90,
      max_conversation_duration: 90,
      timeout: 25
    }, {
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" }
    });
  }
}
