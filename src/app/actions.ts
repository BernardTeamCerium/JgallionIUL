"use server";

import { headers } from "next/headers";
import { emailConfigured, sendGuideEmail, sendLeadAlert } from "./email";

export interface LandingState {
  ok?: boolean;
  error?: string;
  firstName?: string;
  /** True when the guide was emailed to the lead. */
  emailed?: boolean;
}

const field = (form: FormData, name: string) => String(form.get(name) ?? "").trim();

/**
 * Validates the lead form and forwards it to LEAD_WEBHOOK_URL as JSON, e.g. the OnRadar CRM inbound lead
 * webhook (https://<onradar host>/api/leads/<clientId>/inbound?key=<inbound key>), Zapier or GoHighLevel.
 * The URL stays on the server, so its key is never exposed to visitors.
 *
 * When Resend is configured (RESEND_API_KEY + EMAIL_FROM), it also emails the lead the IUL Guide and, if
 * LEAD_NOTIFY_EMAIL is set, emails the lead's details to Jaden. Either the webhook or the notify email must
 * be set in production so leads aren't lost.
 */
export async function submitLead(_prev: LandingState, form: FormData): Promise<LandingState> {
  // Honeypot: real visitors never see this field.
  if (field(form, "company_website")) return { ok: true };

  const firstName = field(form, "first_name");
  const email = field(form, "email");
  const phone = field(form, "phone");
  if (!firstName) return { error: "Please enter your first name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Please enter a valid email address." };
  if (phone.replace(/\D/g, "").length < 10) return { error: "Please enter a 10-digit phone number." };
  if (!form.get("consent")) return { error: "Please check the box so Jaden can contact you." };

  const lead: Record<string, string> = {
    first_name: firstName,
    last_name: field(form, "last_name"),
    email,
    phone,
    state: field(form, "state"),
    source: field(form, "utm_source") || "Landing page",
    "Interested in": field(form, "interest"),
    "Landing page offer": field(form, "offer"),
    "Contact consent": `Yes (${new Date().toISOString()})`,
  };
  for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
    const v = field(form, k);
    if (v) lead[k] = v;
  }

  const url = process.env.LEAD_WEBHOOK_URL;
  const alertConfigured = emailConfigured() && Boolean(process.env.LEAD_NOTIFY_EMAIL);
  const failed = { error: "Something went wrong on our end. Please try again shortly." };

  if (!url && !alertConfigured) {
    console.error("[lead] neither LEAD_WEBHOOK_URL nor LEAD_NOTIFY_EMAIL is set; lead not delivered", lead);
    if (process.env.NODE_ENV === "production") return failed;
  }
  if (url) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(lead),
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    } catch (err) {
      console.error("[lead] delivery failed", err, lead);
      return failed;
    }
  }

  if (!emailConfigured()) return { ok: true, firstName };

  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const siteUrl = `${h.get("x-forwarded-proto") || "https"}://${host}`;
  const [guide, alert] = await Promise.allSettled([
    sendGuideEmail({ firstName, email }, siteUrl),
    sendLeadAlert(lead),
  ]);
  if (guide.status === "rejected") console.error("[lead] guide email failed", guide.reason);
  if (alert.status === "rejected") {
    console.error("[lead] lead alert email failed", alert.reason, lead);
    // With no webhook, the alert email is the only record of the lead.
    if (!url) return failed;
  }
  return { ok: true, firstName, emailed: guide.status === "fulfilled" };
}
