import { Resend } from "resend";
import type { CustomRequest } from "@/lib/customRequests/types";

const ADMIN_EMAIL = "mydreamearl.shop@gmail.com";
const FROM_ADDRESS = "DreamEarl <orders@mydreamearl.shop>";

// Best-effort — a missing/invalid RESEND_API_KEY (or any send failure) must never
// block the status update itself. Kept in its own module so route tests can mock
// it instead of risking a real network call if RESEND_API_KEY happens to be set.
export async function sendCustomRequestDeclineEmail(
  request: CustomRequest,
  reason: string,
): Promise<void> {
  if (!request.email || !process.env.RESEND_API_KEY) return;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: request.email,
      replyTo: ADMIN_EMAIL,
      subject: "An update on your custom request – DreamEarl",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#222">
          <h2 style="letter-spacing:0.05em">Hi ${request.full_name ?? "there"},</h2>
          <p style="color:#555;line-height:1.7">
            Thank you for sharing your custom ${request.product_type.toLowerCase()} request with us.
            After careful review, we're unfortunately not able to take this one on.
          </p>
          <p style="color:#555;line-height:1.7;background:#f9f9f9;padding:12px;border-radius:6px">
            ${reason}
          </p>
          <p style="color:#555;line-height:1.7">
            We'd still love to help you with something else — feel free to reply to this email
            or submit a new custom request with any adjustments.
          </p>
          <p style="margin-top:32px;color:#999;font-size:12px">DreamEarl · Handmade Luxury Accessories</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("[custom-requests] decline email failed", err);
  }
}
