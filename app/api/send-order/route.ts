import { Resend } from "resend";
import { NextResponse } from "next/server";

const ADMIN_EMAIL = "mydreamearl.shop@gmail.com";
const FROM_ADDRESS = "DreamEarl <orders@mydreamearl.shop>";

type OrderPayload = {
  fullName: string;
  email: string;
  phone: string;
  productType: string;
  requirements: string;
  imageUrl: string | null;
};

function adminHtml(o: OrderPayload) {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#222">
      <h2 style="border-bottom:1px solid #eee;padding-bottom:12px">
        New Custom Order – DreamEarl
      </h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:8px 0;color:#666;width:140px">Name</td><td>${o.fullName}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Email</td><td>${o.email}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Phone</td><td>${o.phone || "Not provided"}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Product Type</td><td>${o.productType || "Not specified"}</td></tr>
      </table>
      <h3 style="margin-top:24px">Requirements</h3>
      <p style="white-space:pre-wrap;background:#f9f9f9;padding:12px;border-radius:6px">
        ${o.requirements || "No details provided"}
      </p>
      ${
        o.imageUrl
          ? `<h3>Inspiration Image</h3>
             <a href="${o.imageUrl}">
               <img src="${o.imageUrl}" alt="Inspiration" style="max-width:100%;border-radius:8px"/>
             </a>`
          : "<p style='color:#999'>No inspiration image provided.</p>"
      }
    </div>
  `;
}

function customerHtml(name: string) {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#222;text-align:center">
      <h2 style="letter-spacing:0.1em">Thank you, ${name}</h2>
      <p style="color:#555;line-height:1.7">
        We've received your custom order request and our artisans will review it shortly.<br/>
        We'll reach out within <strong>24–48 hours</strong> with a quote and timeline.
      </p>
      <p style="color:#555;line-height:1.7">
        In the meantime, feel free to reply to this email or WhatsApp us at
        <a href="https://wa.me/918830587508" style="color:#000">+91 88305 87508</a>.
      </p>
      <p style="margin-top:32px;color:#999;font-size:12px">DreamEarl · Handmade Luxury Accessories</p>
    </div>
  `;
}

export async function POST(req: Request) {
  const body = await req.json() as OrderPayload;
  const { fullName, email } = body;

  if (!fullName || !email) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await Promise.all([
      resend.emails.send({
        from: FROM_ADDRESS,
        to: ADMIN_EMAIL,
        subject: `New Custom Order from ${fullName}`,
        html: adminHtml(body),
      }),
      resend.emails.send({
        from: FROM_ADDRESS,
        to: email,
        replyTo: ADMIN_EMAIL,
        subject: "We received your custom order – DreamEarl",
        html: customerHtml(fullName),
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[send-order]", err);
    const message = err instanceof Error ? err.message : "Failed to send email";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
