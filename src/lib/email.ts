import { Resend } from "resend";

type InquiryData = {
  name: string;
  email: string;
  company: string;
  phone?: string;
  productInterest?: string;
  message: string;
};

export async function sendInquiryNotification(
  data: InquiryData
): Promise<{ success: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;
  const fromEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";

  if (!apiKey || !adminEmail) {
    return { success: false };
  }

  try {
    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: `Laemthong Website <${fromEmail}>`,
      to: adminEmail,
      subject: `New Inquiry from ${data.name} — ${data.company}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #dc2626; padding-bottom: 8px;">
            New Contact Inquiry
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #666; width: 140px; vertical-align: top;">Name</td>
              <td style="padding: 8px 12px;">${escapeHtml(data.name)}</td>
            </tr>
            <tr style="background: #f9f9f9;">
              <td style="padding: 8px 12px; font-weight: bold; color: #666; vertical-align: top;">Email</td>
              <td style="padding: 8px 12px;">
                <a href="mailto:${escapeHtml(data.email)}" style="color: #dc2626;">${escapeHtml(data.email)}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #666; vertical-align: top;">Company</td>
              <td style="padding: 8px 12px;">${escapeHtml(data.company)}</td>
            </tr>
            ${data.phone ? `
            <tr style="background: #f9f9f9;">
              <td style="padding: 8px 12px; font-weight: bold; color: #666; vertical-align: top;">Phone</td>
              <td style="padding: 8px 12px;">${escapeHtml(data.phone)}</td>
            </tr>
            ` : ""}
            ${data.productInterest ? `
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #666; vertical-align: top;">Product Interest</td>
              <td style="padding: 8px 12px;">${escapeHtml(data.productInterest)}</td>
            </tr>
            ` : ""}
            <tr style="background: #f9f9f9;">
              <td style="padding: 8px 12px; font-weight: bold; color: #666; vertical-align: top;">Message</td>
              <td style="padding: 8px 12px; white-space: pre-wrap;">${escapeHtml(data.message)}</td>
            </tr>
          </table>
          <p style="margin-top: 24px; color: #999; font-size: 12px;">
            Sent from the Laemthong website contact form
          </p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send inquiry notification:", error);
    return { success: false };
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
