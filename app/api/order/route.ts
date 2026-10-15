import { NextResponse } from "next/server";
import { sendOrderNotificationEmail } from "@/lib/email";

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

    // Dispatch email notification to owner (vyraconnect.in@gmail.com)
    const emailResult = await sendOrderNotificationEmail({
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
    });

    return NextResponse.json({
      success: true,
      orderId: generatedOrderId,
      emailSent: emailResult.success,
      message: "Order placed successfully and notification dispatched to mail."
    });
  } catch (error: any) {
    console.error("[API ORDER ERROR]", error);
    return NextResponse.json(
      { error: "Failed to process order notification", details: error.message },
      { status: 500 }
    );
  }
}
