import nodemailer from "nodemailer";
import { spawn } from "child_process";
import fs from "fs";

export const NOTIFICATION_RECIPIENT = "vyraconnect.in@gmail.com";
export const SENDER_EMAIL = "orders@vyraconnect.in";

interface SendMailParams {
  to?: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

/**
 * Universal mail sender for Vyra Connect
 * Supports SMTP (if configured), Nodemailer sendmail, or native Linux /usr/sbin/sendmail.
 */
export async function sendEmail({
  to = NOTIFICATION_RECIPIENT,
  subject,
  html,
  text,
  replyTo
}: SendMailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const plainText = text || html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  // 1. If SMTP credentials are configured in environment variables, use SMTP
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      const info = await transporter.sendMail({
        from: `Vyra Connect <${SENDER_EMAIL}>`,
        to,
        replyTo: replyTo || SENDER_EMAIL,
        subject,
        text: plainText,
        html
      });

      console.log("[EMAIL] Sent via SMTP successfully:", info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (smtpErr: any) {
      console.warn("[EMAIL] SMTP delivery failed, falling back to local sendmail:", smtpErr.message);
    }
  }

  // 2. Check if /usr/sbin/sendmail exists (Linux / Cloudways)
  const sendmailExists = fs.existsSync("/usr/sbin/sendmail");

  if (sendmailExists) {
    // Attempt via Nodemailer Sendmail transport
    try {
      const transporter = nodemailer.createTransport({
        sendmail: true,
        newline: "unix",
        path: "/usr/sbin/sendmail"
      });

      const info = await transporter.sendMail({
        from: `Vyra Connect <${SENDER_EMAIL}>`,
        to,
        replyTo: replyTo || SENDER_EMAIL,
        subject,
        text: plainText,
        html
      });

      console.log("[EMAIL] Sent via Nodemailer sendmail transport:", info.messageId || "ok");
      return { success: true, messageId: info.messageId || "sendmail-dispatched" };
    } catch (nmErr: any) {
      console.warn("[EMAIL] Nodemailer sendmail transport error, trying direct spawn:", nmErr.message);

      // Attempt via native child_process spawn
      try {
        const rawMessage = [
          `From: Vyra Connect <${SENDER_EMAIL}>`,
          `To: ${to}`,
          replyTo ? `Reply-To: ${replyTo}` : `Reply-To: ${SENDER_EMAIL}`,
          `Subject: ${subject}`,
          `MIME-Version: 1.0`,
          `Content-Type: text/html; charset=UTF-8`,
          ``,
          html
        ].join("\r\n");

        await new Promise<void>((resolve, reject) => {
          const child = spawn("/usr/sbin/sendmail", ["-t", "-i"]);
          child.on("error", reject);
          child.stdin.write(rawMessage);
          child.stdin.end();
          child.on("close", (code) => {
            if (code === 0) resolve();
            else reject(new Error(`sendmail process exited with code ${code}`));
          });
        });

        console.log("[EMAIL] Sent via native /usr/sbin/sendmail process");
        return { success: true, messageId: "spawn-dispatched" };
      } catch (spawnErr: any) {
        console.error("[EMAIL] Native sendmail failed:", spawnErr.message);
        return { success: false, error: spawnErr.message };
      }
    }
  }

  // 3. Fallback for Local Dev (Windows/macOS without sendmail)
  console.log(`[EMAIL DEV LOG] ---------------------------------------------`);
  console.log(`[EMAIL DEV LOG] TO: ${to}`);
  console.log(`[EMAIL DEV LOG] SUBJECT: ${subject}`);
  console.log(`[EMAIL DEV LOG] (In production on Cloudways, this sends to ${NOTIFICATION_RECIPIENT} via /usr/sbin/sendmail)`);
  console.log(`[EMAIL DEV LOG] ---------------------------------------------`);

  return { success: true, messageId: "dev-simulated" };
}

/**
 * Format and send an Official Order Confirmation Email
 */
export async function sendOrderNotificationEmail(order: {
  orderId: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
  notes?: string;
  packName: string;
  tagsCount: number;
  finishName: string;
  vehicleType: string;
  plateNumber?: string;
  price: number;
  createdAt?: string;
}) {
  const timestamp = order.createdAt || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const subject = `[NEW ORDER] Vyra Connect - ${order.name} - ₹${order.price} (${order.packName}) - #${order.orderId}`;

  const cleanPhone = order.phone.replace(/[^0-9]/g, "");
  const waLink = `https://wa.me/${cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`}?text=${encodeURIComponent(
    `Hello ${order.name}, thank you for ordering Vyra Connect (${order.orderId})! We have received your order for ${order.packName}.`
  )}`;
  const telLink = `tel:${order.phone}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>New Vyra Connect Order</title>
</head>
<body style="margin:0;padding:0;background-color:#030712;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#f3f4f6;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#030712;padding:30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background-color:#070d1e;border:1px solid #1e293b;border-radius:20px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,0.8);">
          
          <!-- Top Neon Accent Header -->
          <tr>
            <td style="background:linear-gradient(90deg,#2563eb,#06b6d4,#3b82f6);height:6px;"></td>
          </tr>

          <!-- Header Section -->
          <tr>
            <td style="padding:32px 32px 20px 32px;background:radial-gradient(ellipse at top,#0e1e38 0%,#070d1e 70%);border-bottom:1px solid #1e293b;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="font-size:11px;font-family:monospace;letter-spacing:2px;color:#06b6d4;text-transform:uppercase;font-weight:bold;margin-bottom:6px;">
                      ✦ OFFICIAL STORE NOTIFICATION
                    </div>
                    <h1 style="margin:0;font-size:24px;color:#ffffff;font-weight:800;letter-spacing:-0.5px;">
                      NEW HARDWARE ORDER RECEIVED
                    </h1>
                  </td>
                  <td align="right" valign="top">
                    <div style="background-color:rgba(6,182,212,0.15);border:1px solid rgba(6,182,212,0.4);border-radius:10px;padding:8px 14px;text-align:right;">
                      <div style="font-size:10px;font-family:monospace;color:#94a3b8;text-transform:uppercase;">Order ID</div>
                      <div style="font-size:14px;font-family:monospace;font-weight:bold;color:#38bdf8;">${order.orderId}</div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Order Summary Card -->
          <tr>
            <td style="padding:28px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0b1328;border:1px solid #1e293b;border-radius:16px;padding:20px;margin-bottom:24px;">
                <tr>
                  <td style="padding-bottom:12px;border-bottom:1px solid #1e293b;">
                    <div style="font-size:11px;font-family:monospace;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Selected Product</div>
                    <div style="font-size:18px;font-weight:bold;color:#ffffff;margin-top:2px;">
                      ${order.packName} <span style="font-size:13px;color:#38bdf8;font-weight:normal;">(${order.tagsCount} Smart Tag${order.tagsCount > 1 ? "s" : ""})</span>
                    </div>
                  </td>
                  <td align="right" style="padding-bottom:12px;border-bottom:1px solid #1e293b;">
                    <div style="font-size:11px;font-family:monospace;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Total Amount</div>
                    <div style="font-size:24px;font-weight:900;color:#06b6d4;margin-top:2px;">
                      ₹${order.price}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:14px;">
                    <div style="font-size:12px;color:#94a3b8;"><strong>Finish Edition:</strong> <span style="color:#ffffff;">${order.finishName}</span></div>
                    <div style="font-size:12px;color:#94a3b8;margin-top:4px;"><strong>Target Vehicle:</strong> <span style="color:#ffffff;">${order.vehicleType.toUpperCase()}</span></div>
                  </td>
                  <td align="right" style="padding-top:14px;">
                    <div style="font-size:12px;color:#94a3b8;"><strong>Shipping:</strong> <span style="color:#34d399;font-weight:bold;">EXPRESS (FREE)</span></div>
                    <div style="font-size:12px;color:#94a3b8;margin-top:4px;"><strong>Plate Preview:</strong> <span style="color:#ffffff;font-family:monospace;">${order.plateNumber || "Not specified"}</span></div>
                  </td>
                </tr>
              </table>

              <!-- Customer Details Section -->
              <h2 style="font-size:14px;color:#38bdf8;font-family:monospace;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 14px 0;">
                CUSTOMER &amp; DELIVERY DETAILS
              </h2>
              
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0b1328;border:1px solid #1e293b;border-radius:16px;padding:20px;margin-bottom:24px;">
                <tr>
                  <td style="padding-bottom:10px;width:140px;color:#94a3b8;font-size:13px;font-weight:bold;">Full Name:</td>
                  <td style="padding-bottom:10px;color:#ffffff;font-size:14px;font-weight:bold;">${order.name}</td>
                </tr>
                <tr>
                  <td style="padding-bottom:10px;color:#94a3b8;font-size:13px;font-weight:bold;">Phone / WhatsApp:</td>
                  <td style="padding-bottom:10px;color:#38bdf8;font-size:14px;font-family:monospace;font-weight:bold;">
                    ${order.phone}
                  </td>
                </tr>
                ${
                  order.email
                    ? `<tr>
                  <td style="padding-bottom:10px;color:#94a3b8;font-size:13px;font-weight:bold;">Email Address:</td>
                  <td style="padding-bottom:10px;color:#ffffff;font-size:13px;">${order.email}</td>
                </tr>`
                    : ""
                }
                <tr>
                  <td style="padding-bottom:10px;color:#94a3b8;font-size:13px;font-weight:bold;" valign="top">Delivery Address:</td>
                  <td style="padding-bottom:10px;color:#e2e8f0;font-size:13px;line-height:1.5;">${order.address}</td>
                </tr>
                <tr>
                  <td style="padding-bottom:10px;color:#94a3b8;font-size:13px;font-weight:bold;">City / District:</td>
                  <td style="padding-bottom:10px;color:#e2e8f0;font-size:13px;">${order.city || "Not provided"}</td>
                </tr>
                <tr>
                  <td style="padding-bottom:10px;color:#94a3b8;font-size:13px;font-weight:bold;">State:</td>
                  <td style="padding-bottom:10px;color:#e2e8f0;font-size:13px;">${order.state || "Kerala"}</td>
                </tr>
                <tr>
                  <td style="padding-bottom:10px;color:#94a3b8;font-size:13px;font-weight:bold;">PIN Code:</td>
                  <td style="padding-bottom:10px;color:#38bdf8;font-size:14px;font-family:monospace;font-weight:bold;">${order.pincode || "Not provided"}</td>
                </tr>
                ${
                  order.notes
                    ? `<tr>
                  <td style="color:#94a3b8;font-size:13px;font-weight:bold;" valign="top">Customer Notes:</td>
                  <td style="color:#fde047;font-size:13px;line-height:1.4;">${order.notes}</td>
                </tr>`
                    : ""
                }
              </table>

              <!-- Quick Action Buttons -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td style="padding-right:8px;" width="50%">
                    <a href="${waLink}" target="_blank" style="display:block;background-color:#16a34a;color:#ffffff;text-align:center;padding:12px 16px;border-radius:12px;text-decoration:none;font-weight:bold;font-size:13px;">
                      💬 Chat on WhatsApp
                    </a>
                  </td>
                  <td style="padding-left:8px;" width="50%">
                    <a href="${telLink}" style="display:block;background-color:#2563eb;color:#ffffff;text-align:center;padding:12px 16px;border-radius:12px;text-decoration:none;font-weight:bold;font-size:13px;">
                      📞 Call Customer
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background-color:#050a18;border-top:1px solid #1e293b;text-align:center;">
              <div style="font-size:12px;color:#64748b;font-family:monospace;">
                Recorded at: ${timestamp} IST • Vyra Connect Order Dispatch
              </div>
              <div style="font-size:11px;color:#475569;margin-top:6px;">
                Direct Store Email: <a href="mailto:${NOTIFICATION_RECIPIENT}" style="color:#06b6d4;text-decoration:none;">${NOTIFICATION_RECIPIENT}</a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return sendEmail({
    to: NOTIFICATION_RECIPIENT,
    replyTo: order.email || undefined,
    subject,
    html
  });
}

/**
 * Format and send a Contact Us / Support Inquiry Email
 */
export async function sendContactInquiryEmail(contact: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  origin?: string;
  createdAt?: string;
}) {
  const timestamp = contact.createdAt || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const subject = `[CONTACT INQUIRY] Vyra Connect - ${contact.name}: ${contact.subject || "Customer Inquiry"}`;

  const cleanPhone = contact.phone ? contact.phone.replace(/[^0-9]/g, "") : "";
  const waLink = cleanPhone
    ? `https://wa.me/${cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`}?text=${encodeURIComponent(
        `Hello ${contact.name}, this is Vyra Connect Support responding to your inquiry regarding: "${contact.subject}".`
      )}`
    : null;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Vyra Connect Contact Inquiry</title>
</head>
<body style="margin:0;padding:0;background-color:#030712;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#f3f4f6;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#030712;padding:30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background-color:#070d1e;border:1px solid #1e293b;border-radius:20px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,0.8);">
          
          <!-- Top Accent Header (Blue & Purple for Contact Us Pattern) -->
          <tr>
            <td style="background:linear-gradient(90deg,#6366f1,#3b82f6,#06b6d4);height:6px;"></td>
          </tr>

          <!-- Header Section -->
          <tr>
            <td style="padding:32px 32px 20px 32px;background:radial-gradient(ellipse at top,#111b33 0%,#070d1e 70%);border-bottom:1px solid #1e293b;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="font-size:11px;font-family:monospace;letter-spacing:2px;color:#818cf8;text-transform:uppercase;font-weight:bold;margin-bottom:6px;">
                      ✦ WEBSITE CONTACT US FORM
                    </div>
                    <h1 style="margin:0;font-size:24px;color:#ffffff;font-weight:800;letter-spacing:-0.5px;">
                      NEW CUSTOMER INQUIRY
                    </h1>
                  </td>
                  <td align="right" valign="top">
                    <span style="background-color:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.4);border-radius:10px;padding:6px 12px;font-size:11px;font-family:monospace;color:#a5b4fc;font-weight:bold;">
                      ${contact.origin || "Contact Page"}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Sender Details Card -->
          <tr>
            <td style="padding:28px 32px;">
              <h2 style="font-size:13px;color:#818cf8;font-family:monospace;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 14px 0;">
                SENDER INFORMATION
              </h2>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0b1328;border:1px solid #1e293b;border-radius:16px;padding:20px;margin-bottom:24px;">
                <tr>
                  <td style="padding-bottom:10px;width:130px;color:#94a3b8;font-size:13px;font-weight:bold;">Sender Name:</td>
                  <td style="padding-bottom:10px;color:#ffffff;font-size:14px;font-weight:bold;">${contact.name}</td>
                </tr>
                <tr>
                  <td style="padding-bottom:10px;color:#94a3b8;font-size:13px;font-weight:bold;">Email Address:</td>
                  <td style="padding-bottom:10px;color:#38bdf8;font-size:14px;">
                    <a href="mailto:${contact.email}" style="color:#38bdf8;text-decoration:none;">${contact.email}</a>
                  </td>
                </tr>
                ${
                  contact.phone
                    ? `<tr>
                  <td style="padding-bottom:10px;color:#94a3b8;font-size:13px;font-weight:bold;">Phone / WhatsApp:</td>
                  <td style="padding-bottom:10px;color:#e2e8f0;font-size:14px;font-family:monospace;">${contact.phone}</td>
                </tr>`
                    : ""
                }
                <tr>
                  <td style="color:#94a3b8;font-size:13px;font-weight:bold;">Subject:</td>
                  <td style="color:#f8fafc;font-size:14px;font-weight:600;">${contact.subject}</td>
                </tr>
              </table>

              <!-- Message Body -->
              <h2 style="font-size:13px;color:#818cf8;font-family:monospace;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 14px 0;">
                MESSAGE CONTENT
              </h2>

              <div style="background-color:#040814;border:1px solid #1e293b;border-left:4px solid #6366f1;border-radius:12px;padding:20px;margin-bottom:24px;color:#f1f5f9;font-size:14px;line-height:1.7;white-space:pre-wrap;">
${contact.message}
              </div>

              <!-- Quick Action Buttons -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
                <tr>
                  <td style="padding-right:8px;" width="${waLink ? "50%" : "100%"}">
                    <a href="mailto:${contact.email}?subject=Re: ${encodeURIComponent(contact.subject)}" style="display:block;background-color:#3b82f6;color:#ffffff;text-align:center;padding:12px 16px;border-radius:12px;text-decoration:none;font-weight:bold;font-size:13px;">
                      ✉ Reply via Email
                    </a>
                  </td>
                  ${
                    waLink
                      ? `<td style="padding-left:8px;" width="50%">
                    <a href="${waLink}" target="_blank" style="display:block;background-color:#16a34a;color:#ffffff;text-align:center;padding:12px 16px;border-radius:12px;text-decoration:none;font-weight:bold;font-size:13px;">
                      💬 Chat on WhatsApp
                    </a>
                  </td>`
                      : ""
                  }
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background-color:#050a18;border-top:1px solid #1e293b;text-align:center;">
              <div style="font-size:12px;color:#64748b;font-family:monospace;">
                Received on: ${timestamp} IST • Vyra Connect Web Support
              </div>
              <div style="font-size:11px;color:#475569;margin-top:6px;">
                Direct Inbox: <a href="mailto:${NOTIFICATION_RECIPIENT}" style="color:#818cf8;text-decoration:none;">${NOTIFICATION_RECIPIENT}</a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return sendEmail({
    to: NOTIFICATION_RECIPIENT,
    replyTo: contact.email,
    subject,
    html
  });
}
