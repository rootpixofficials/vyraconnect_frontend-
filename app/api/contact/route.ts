import { NextResponse } from "next/server";
import { sendContactInquiryEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, phone, subject, message, origin } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email address, and message are required." },
        { status: 400 }
      );
    }

    // Basic email format check
    if (!email.includes("@") || !email.includes(".")) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Dispatch email notification to owner (vyraconnect.in@gmail.com)
    const emailResult = await sendContactInquiryEmail({
      name,
      email,
      phone,
      subject: subject || "General Inquiry",
      message,
      origin: origin || "Website Contact Form"
    });

    return NextResponse.json({
      success: true,
      emailSent: emailResult.success,
      message: "Your message has been sent successfully. We will contact you shortly."
    });
  } catch (error: any) {
    console.error("[API CONTACT ERROR]", error);
    return NextResponse.json(
      { error: "Failed to submit contact message", details: error.message },
      { status: 500 }
    );
  }
}
