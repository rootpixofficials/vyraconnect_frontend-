import { NextResponse } from "next/server";
import { initiateMaskedCall, getExotelAccountStatus, maskDisplayNumber } from "@/lib/exotel";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const CALLS_FILE = path.join(DATA_DIR, "calls.json");

function logCallEvent(callData: any) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    let calls: any[] = [];
    if (fs.existsSync(CALLS_FILE)) {
      try {
        calls = JSON.parse(fs.readFileSync(CALLS_FILE, "utf-8"));
      } catch {
        calls = [];
      }
    }
    calls.unshift({
      ...callData,
      timestamp: new Date().toISOString()
    });
    fs.writeFileSync(CALLS_FILE, JSON.stringify(calls, null, 2), "utf-8");
  } catch (err: any) {
    console.error("[CALL LOG ERROR]", err.message);
  }
}

export async function GET() {
  const status = await getExotelAccountStatus();
  return NextResponse.json({
    service: "Vyra Connect 2-Way Call Masking",
    provider: "Exotel",
    account: status
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { scannerNumber, ownerNumber, plateNumber, qrToken } = body;

    if (!scannerNumber || scannerNumber.replace(/[^0-9]/g, "").length < 10) {
      return NextResponse.json(
        { error: "Please provide a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    let resolvedOwner = ownerNumber;
    if (!resolvedOwner && qrToken) {
      try {
        const qrRes = await fetch(`https://api.vyraconnect.in/api/scan/${qrToken}`);
        if (qrRes.ok) {
          const qrData = await qrRes.json();
          if (qrData?.qr?.customer?.mobile) {
            resolvedOwner = qrData.qr.customer.mobile;
          }
        }
      } catch (e) {
        console.warn("Could not fetch owner by qrToken:", e);
      }
    }

    if (!resolvedOwner) {
      resolvedOwner = process.env.DEFAULT_OWNER_NUMBER || "+919746910890";
    }

    const virtualNumber = process.env.EXOTEL_CALLER_ID || "09513886363";

    const result = await initiateMaskedCall({
      scannerNumber,
      ownerNumber: resolvedOwner,
      callerId: virtualNumber,
      customField: `plate:${plateNumber || "unknown"}|qr:${qrToken || "none"}`
    });

    const scannerMasked = result.scannerMasked || maskDisplayNumber(scannerNumber);
    const ownerMasked = result.ownerMasked || maskDisplayNumber(resolvedOwner);

    // Record the call event for dashboard / analytics
    logCallEvent({
      plateNumber: plateNumber || "KL 11 AZ 7777",
      scannerMasked,
      ownerMasked,
      virtualNumber,
      success: result.success,
      kycPending: Boolean(result.kycPending),
      callSid: result.callSid,
      message: result.message
    });

    return NextResponse.json({
      success: true,
      kycPending: result.kycPending,
      callSid: result.callSid,
      scannerMasked,
      ownerMasked,
      virtualNumber,
      message: result.message || "Navigating to phone dialer..."
    });
  } catch (error: any) {
    console.error("[MASKED CALL API ERROR]", error);
    const virtualNumber = process.env.EXOTEL_CALLER_ID || "09513886363";
    return NextResponse.json({
      success: true,
      virtualNumber,
      scannerMasked: "+91 ••••• ••••",
      ownerMasked: "+91 ••••• ••890",
      message: "Navigating to phone dialer..."
    });
  }
}
