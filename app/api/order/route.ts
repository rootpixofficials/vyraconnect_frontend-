import { NextResponse } from "next/server";
import { sendOrderNotificationEmail } from "@/lib/email";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

function saveOrderToFile(order: any) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    let orders: any[] = [];
    if (fs.existsSync(ORDERS_FILE)) {
      const content = fs.readFileSync(ORDERS_FILE, "utf-8");
      try {
        orders = JSON.parse(content);
      } catch {
        orders = [];
      }
    }

    orders.unshift({
      ...order,
      receivedAt: new Date().toISOString()
    });

    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
  } catch (err: any) {
    console.error("[ORDERS STORE ERROR]", err.message);
  }
}

export async function GET() {
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const content = fs.readFileSync(ORDERS_FILE, "utf-8");
      return NextResponse.json(JSON.parse(content));
    }
    return NextResponse.json([]);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      orderId,
      name,
      phone,
      email,
      address,
      city,
      state,
      pincode,
      notes,
      packName,
      tagsCount,
      finishName,
      vehicleType,
      plateNumber,
      price
    } = body;

    // Validate required fields
    if (!name || !phone || !address) {
      return NextResponse.json(
        { error: "Name, phone number, and delivery address are required." },
        { status: 400 }
      );
    }

    const generatedOrderId = orderId || `VYRA-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderPayload = {
      orderId: generatedOrderId,
      name,
      phone,
      email,
      address,
      city,
      state: state || "Kerala",
      pincode,
      notes,
      packName: packName || "Solo Edition",
      tagsCount: tagsCount || 1,
      finishName: finishName || "Obsidian Stealth",
      vehicleType: vehicleType || "car",
      plateNumber,
      price: price || 399
    };

    // 1. Immediately persist to database/disk so no orders are ever lost
    saveOrderToFile(orderPayload);

    // 2. Dispatch email notification to owner (vyraconnect.in@gmail.com)
    const emailResult = await sendOrderNotificationEmail(orderPayload);

    return NextResponse.json({
      success: true,
      orderId: generatedOrderId,
      emailSent: emailResult.success,
      emailDiagnostic: emailResult.messageId || emailResult.error,
      message: "Order placed successfully and saved to records."
    });
  } catch (error: any) {
    console.error("[API ORDER ERROR]", error);
    return NextResponse.json(
      { error: "Failed to process order notification", details: error.message },
      { status: 500 }
    );
  }
}
