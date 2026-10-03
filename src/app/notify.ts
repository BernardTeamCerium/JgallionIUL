/**
 * New-lead alerts to Jaden, by email (Resend) and/or text (Twilio). Each channel is on only when its
 * settings are present, so the site works with either, both or neither.
 *
 * Email: RESEND_API_KEY + LEAD_NOTIFY_EMAIL. EMAIL_FROM is optional; without it the alert is sent from
 *   Resend's test sender, which can only deliver to the email address the Resend account was created with.
 * Text:  TWILIO_ACCOUNT_SID + TWILIO_AUTH_TOKEN + TWILIO_FROM (a Twilio number) + LEAD_NOTIFY_PHONE.
 */

type Lead = Record<string, string>;

const env = (k: string) => process.env[k]?.trim() || "";

const emailOn = () => Boolean(env("RESEND_API_KEY") && env("LEAD_NOTIFY_EMAIL"));
const textOn = () =>
  Boolean(env("TWILIO_ACCOUNT_SID") && env("TWILIO_AUTH_TOKEN") && env("TWILIO_FROM") && env("LEAD_NOTIFY_PHONE"));

/** True when at least one alert channel is configured. */
export const alertsConfigured = () => emailOn() || textOn();

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const fullName = (lead: Lead) => `${lead.first_name} ${lead.last_name}`.trim();

async function emailAlert(lead: Lead) {
  const rows = Object.entries(lead).filter(([, v]) => v);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${env("RESEND_API_KEY")}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: env("EMAIL_FROM") || "J Gallion Leads <onboarding@resend.dev>",
      to: env("LEAD_NOTIFY_EMAIL").split(",").map((s) => s.trim()).filter(Boolean),
      reply_to: lead.email,
      subject: `New IUL lead: ${fullName(lead)}`,
      html: `<div style="font-family:Arial,sans-serif;font-size:14px;color:#0f172a;">
<p style="margin:0 0 12px;font-size:16px;"><b>New lead from the IUL landing page</b></p>
<table style="border-collapse:collapse;">${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:5px 16px 5px 0;color:#64748b;vertical-align:top;">${esc(k)}</td><td style="padding:5px 0;">${esc(v)}</td></tr>`,
        )
        .join("")}</table>
<p style="margin:14px 0 0;color:#64748b;">Reply to this email to write to ${esc(lead.first_name)} directly.</p></div>`,
      text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
}

async function textAlert(lead: Lead) {
  const sid = env("TWILIO_ACCOUNT_SID");
  const body = [
    `New IUL lead: ${fullName(lead)}`,
    lead.phone,
    lead.email,
    lead.state && `State: ${lead.state}`,
    lead["Interested in"] && `Interest: ${lead["Interested in"]}`,
    `Source: ${lead.source}`,
  ]
    .filter(Boolean)
    .join("\n");
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(sid)}/Messages.json`, {
    method: "POST",
    headers: {
      authorization: `Basic ${Buffer.from(`${sid}:${env("TWILIO_AUTH_TOKEN")}`).toString("base64")}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ To: env("LEAD_NOTIFY_PHONE"), From: env("TWILIO_FROM"), Body: body }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Twilio responded ${res.status}: ${await res.text()}`);
}

/** Sends every configured alert. Resolves true if at least one was delivered. */
export async function sendLeadAlerts(lead: Lead): Promise<boolean> {
  const jobs: [string, Promise<void>][] = [];
  if (emailOn()) jobs.push(["email", emailAlert(lead)]);
  if (textOn()) jobs.push(["text", textAlert(lead)]);
  const results = await Promise.allSettled(jobs.map(([, p]) => p));
  results.forEach((r, i) => {
    if (r.status === "rejected") console.error(`[lead] ${jobs[i][0]} alert failed`, r.reason);
  });
  return results.some((r) => r.status === "fulfilled");
}
