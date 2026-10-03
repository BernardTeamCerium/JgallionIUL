"use server";

import { alertsConfigured, sendLeadAlerts } from "./notify";

export interface LandingState {
  ok?: boolean;
  error?: string;
  firstName?: string;
}

const field = (form: FormData, name: string) => String(form.get(name) ?? "").trim();

/**
 * Validates the lead form and forwards it to LEAD_WEBHOOK_URL as JSON, e.g. the OnRadar CRM inbound lead
 * webhook (https://<onradar host>/api/leads/<clientId>/inbound?key=<inbound key>), Zapier or GoHighLevel.
 * The URL stays on the server, so its key is never exposed to visitors.
 *
 * It also emails and/or texts the lead's details to Jaden when those alerts are configured (see notify.ts).
 * The lead counts as delivered if the webhook or any alert succeeds.
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
  const failed = { error: "Something went wrong on our end. Please try again shortly." };
  if (!url && !alertsConfigured()) {
    console.error("[lead] no LEAD_WEBHOOK_URL or lead alerts configured; lead not delivered", lead);
    return process.env.NODE_ENV === "production" ? failed : { ok: true, firstName };
  }

  const toWebhook = async () => {
    if (!url) return false;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(lead),
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
      return true;
    } catch (err) {
      console.error("[lead] webhook delivery failed", err);
      return false;
    }
  };
  const [webhookOk, alertOk] = await Promise.all([toWebhook(), alertsConfigured() ? sendLeadAlerts(lead) : false]);
  if (!webhookOk && !alertOk) {
    console.error("[lead] lead not delivered anywhere", lead);
    return failed;
  }
  return { ok: true, firstName };
}
