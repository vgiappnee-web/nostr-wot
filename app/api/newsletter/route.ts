import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

interface NewsletterData {
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: NewsletterData = await request.json();
    const { email } = body;

    // Validate email
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check for Resend API key
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return NextResponse.json(
        { error: "Email service not configured. Please try again later." },
        { status: 500 }
      );
    }

    const contactEmail = process.env.CONTACT_EMAIL || "contact@nostr-wot.com";

    // Send notification email
    const resend = new Resend(resendApiKey);

    // Notification to admin
    const { error: notifyError } = await resend.emails.send({
      from: "Nostr WoT <noreply@resend.dev>",
      to: contactEmail,
      subject: "[Newsletter] New Subscriber",
      html: `
        <h2>New Newsletter Subscriber</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Date:</strong> ${new Date().toISOString()}</p>
        <hr />
        <p style="color: #666; font-size: 12px;">
          This subscriber signed up via the Nostr WoT website.
        </p>
      `,
      text: `
New Newsletter Subscriber

Email: ${email}
Date: ${new Date().toISOString()}

---
This subscriber signed up via the Nostr WoT website.
      `,
    });

    if (notifyError) {
      console.error("Resend notification error:", notifyError);
      return NextResponse.json(
        { error: "Failed to subscribe. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
