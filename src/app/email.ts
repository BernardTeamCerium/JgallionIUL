/**
 * Sends email through Resend's REST API (https://resend.com/docs/api-reference/emails/send-email).
 * Configure with RESEND_API_KEY and EMAIL_FROM; the sending domain must be verified in Resend.
 */

const GUIDE_PATH = "/downloads/jgallion-iul-guide.pdf";

export const emailConfigured = () => Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);

async function send(message: { to: string; subject: string; html: string; text: string; replyTo?: string }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to: [message.to],
      subject: message.subject,
      html: message.html,
      text: message.text,
      ...(message.replyTo ? { reply_to: message.replyTo } : {}),
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Emails the lead a link to the IUL Guide. `siteUrl` is the origin the form was submitted from. */
export async function sendGuideEmail(lead: { firstName: string; email: string }, siteUrl: string) {
  const guide = siteUrl + GUIDE_PATH;
  const name = esc(lead.firstName);
  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#f4f2ec;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f2ec;padding:32px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e8e5dd;font-family:'Helvetica Neue',Arial,sans-serif;color:#0f172a;">
  <tr><td style="background:#0a0f19;padding:24px 32px;">
    <img src="${siteUrl}/brand/jg-mark.png" width="40" height="38" alt="" style="vertical-align:middle;border:0;">
    <span style="vertical-align:middle;margin-left:10px;font-family:Georgia,'Times New Roman',serif;font-size:17px;letter-spacing:2px;color:#ffffff;">J GALLION FINANCIAL</span>
  </td></tr>
  <tr><td style="padding:36px 32px 8px;">
    <p style="margin:0 0 6px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#a07d3e;font-weight:bold;">Your Complimentary Guide</p>
    <h1 style="margin:0 0 18px;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.2;color:#0f172a;">Here&rsquo;s your IUL Guide, ${name}.</h1>
    <p style="margin:0 0 14px;font-size:16px;line-height:1.6;color:#334155;">Thanks for your interest. The guide walks through the seven things to understand before using an Indexed Universal Life policy in a retirement strategy: what it may provide, and where its limits are.</p>
    <p style="margin:0 0 26px;font-size:16px;line-height:1.6;color:#334155;">Read it at your own pace and note any questions. When you&rsquo;re ready, just reply to this email and I&rsquo;ll set up a short, no-pressure conversation.</p>
    <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border-radius:999px;background:#c9a65a;">
      <a href="${guide}" style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:#0a0f19;text-decoration:none;">Download the Guide</a>
    </td></tr></table>
    <p style="margin:26px 0 0;font-size:16px;line-height:1.6;color:#334155;">Jaden Gallion<br><span style="font-size:13px;color:#64748b;">Insurance Professional, J Gallion Financial</span></p>
  </td></tr>
  <tr><td style="padding:24px 32px 28px;">
    <p style="margin:0;border-top:1px solid #e8e5dd;padding-top:16px;font-size:11px;line-height:1.5;color:#94a3b8;">You&rsquo;re receiving this email because you requested the IUL Guide. For educational purposes only. J Gallion Financial and Jaden Gallion provide insurance products and do not provide tax or legal advice. Indexed Universal Life is a life insurance product, not a security or stock-market investment.</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
  const text = `Here's your IUL Guide, ${lead.firstName}.

Thanks for your interest. Download the guide here:
${guide}

Read it at your own pace and note any questions. When you're ready, just reply to this email and I'll set up a short, no-pressure conversation.

Jaden Gallion
Insurance Professional, J Gallion Financial

You're receiving this email because you requested the IUL Guide. For educational purposes only. J Gallion Financial and Jaden Gallion provide insurance products and do not provide tax or legal advice.`;

  await send({
    to: lead.email,
    subject: "Your IUL Guide from J Gallion Financial",
    html,
    text,
    replyTo: process.env.EMAIL_REPLY_TO || undefined,
  });
}

/** Emails the new lead's details to LEAD_NOTIFY_EMAIL (e.g. Jaden), with reply-to set to the lead. */
export async function sendLeadAlert(lead: Record<string, string>) {
  const to = process.env.LEAD_NOTIFY_EMAIL;
  if (!to) return;
  const rows = Object.entries(lead).filter(([, v]) => v);
  await send({
    to,
    subject: `New IUL lead: ${lead.first_name} ${lead.last_name}`.trim(),
    html: `<table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse;">${rows
      .map(([k, v]) => `<tr><td style="padding:4px 14px 4px 0;color:#64748b;">${esc(k)}</td><td style="padding:4px 0;">${esc(v)}</td></tr>`)
      .join("")}</table>`,
    text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
    replyTo: lead.email,
  });
}
