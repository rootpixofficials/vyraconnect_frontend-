import { NextResponse } from "next/server";
import { sendContactInquiryEmail } from "@/lib/email";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const CONTACT_FILE = path.join(DATA_DIR, "contact_inquiries.json");

function saveContactToFile(inquiry: any) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    let items: any[] = [];
    if (fs.existsSync(CONTACT_FILE)) {
      const content = fs.readFileSync(CONTACT_FILE, "utf-8");
      try {
        items = JSON.parse(content);
      } catch {
        items = [];
      }
    }

    items.unshift({
      ...inquiry,
      receivedAt: new Date().toISOString()
    });

    fs.writeFileSync(CONTACT_FILE, JSON.stringify(items, null, 2), "utf-8");
  } catch (err: any) {
    console.error("[CONTACT STORE ERROR]", err.message);
  }
}

export async function GET() {
  try {
    if (fs.existsSync(CONTACT_FILE)) {
      const content = fs.readFileSync(CONTACT_FILE, "utf-8");
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

    const payload = {
      name,
      email,
      phone,
      subject: subject || "General Inquiry",
      message,
      origin: origin || "Website Contact Form"
    };

    // 1. Immediately persist inquiry to disk so no inquiries are ever lost
    saveContactToFile(payload);

    // 2. Dispatch email notification to owner (vyraconnect.in@gmail.com)
    const emailResult = await sendContactInquiryEmail(payload);

    return NextResponse.json({
      success: true,
      emailSent: emailResult.success,
      emailDiagnostic: emailResult.messageId || emailResult.error,
      message: "Your message has been received and saved to records."
    });
  } catch (error: any) {
    console.error("[API CONTACT ERROR]", error);
    return NextResponse.json(
      { error: "Failed to submit contact message", details: error.message },
      { status: 500 }
    );
  }
}
