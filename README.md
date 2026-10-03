# J Gallion Financial: IUL landing page

Lead-capture landing page for **Jaden Gallion, Insurance Professional at J Gallion Financial**, built for the Indexed Universal Life (IUL) Meta ad campaigns. The copy comes from the *J Gallion IUL Marketing Creative Playbook*. The look matches jgallionfinancial.com and jadengallion.com (deep navy, brass and gold, Playfair Display with Plus Jakarta Sans, and the JG monogram) and the ad creative in [`ads/`](ads). Logo files and the color palette are in [`brand/`](brand).

Built with Next.js 15 and deployed to Netlify (see `netlify.toml`).

## Deploy to Netlify

The lead form runs on the server, so the site has to be **built by Netlify**. Dragging a folder onto Netlify's "Deploy manually" box won't work for this site.

- **From GitHub (recommended):** in Netlify choose *Add new site → Import an existing project*, pick this repo and branch. Netlify reads `netlify.toml` and runs the Next.js build automatically.
- **From a zip, without GitHub:** unzip the source, then run `npx netlify-cli deploy --build --prod` in that folder.

Either way, set `LEAD_WEBHOOK_URL` (and optionally `SITE_URL`) under *Site configuration → Environment variables* before going live.

## Ad variants (message match)

Each ad links to the page with `?c=` so the headline and button match the ad that was clicked. The form also records any `utm_*` parameters.

| Campaign | Link | Headline | Button |
|---|---|---|---|
| IUL Education (default) | `/` or `/?c=guide` | Thinking About an IUL? Start Here. | Get the Free Guide |
| Third Retirement Bucket | `/?c=bucket` | You Have a 401(k). You Have Savings. What's Your Third Bucket? | Explore Your Options |
| Future Tax Exposure | `/?c=tax` | What If Taxes Are Higher When You Retire? | Get a Retirement Review |
| Maxed Out 401(k) | `/?c=401k` | Maxed Out Your 401(k)? What's Next? | See Additional Strategies |
| Business Owners | `/?c=owner` | Your Business Isn't Your Retirement Plan. | Get the Business Owner Guide |
| Healthcare Professionals | `/?c=healthcare` | You Take Care of Everyone Else. What's Your Plan? | Request Information |

Example: `https://<site>/?c=401k&utm_source=facebook&utm_campaign=maxed-401k`

## Page sections

1. Hero with the lead form (the IUL Guide offer)
2. 7 things to understand before using an IUL
3. The third bucket (401(k), savings, insurance strategy)
4. Tax diversification (tax now, tax later, tax-advantaged)
5. Who we work with
6. Meet Jaden, and how it works in 3 steps
7. FAQ
8. Final call to action, plus a compliance footer

## Where leads go

The form is handled on the server (`src/app/actions.ts`). It validates the fields, checks a hidden honeypot field to catch spam, and POSTs the lead as JSON to **`LEAD_WEBHOOK_URL`**. Because the URL stays on the server, its key is never shown to visitors.

To send leads to OnRadar CRM, set it to the client's inbound lead webhook:

```
LEAD_WEBHOOK_URL=https://<onradar host>/api/leads/<clientId>/inbound?key=<inbound key>
```

The lead includes `first_name`, `last_name`, `email`, `phone`, `state`, `source` (from `utm_source`, otherwise "Landing page"), the visitor's interest, the offer, a timestamped contact consent, and any UTM parameters. Any webhook that accepts JSON (Zapier, Make, GoHighLevel inbound webhook) also works.

## Get an email or text for every lead

Each new lead can also be emailed and/or texted to Jaden (`src/app/notify.ts`). Set these under Netlify → *Site configuration → Environment variables*, then redeploy.

**Email (Resend):**
1. Sign up at [resend.com](https://resend.com) with the email address that should receive leads, and create an API key (*API Keys → Create*, "Sending access").
2. Set `RESEND_API_KEY` to the key and `LEAD_NOTIFY_EMAIL` to that same email address.

That's all that's needed: alerts come from Resend's test sender (`onboarding@resend.dev`), which can deliver to the account's own email address. To send to other addresses (comma-separated) or from your own domain, verify the domain in Resend (*Domains*) and set `EMAIL_FROM`, e.g. `J Gallion Leads <leads@jgallionfinancial.com>`. Replying to an alert writes to the lead.

**Text (Twilio):**
1. Sign up at [twilio.com](https://twilio.com) and buy a phone number (toll-free numbers are simplest).
2. Complete Twilio's verification for that number. US carriers require this before texts are delivered (toll-free verification or A2P 10DLC registration), and it can take a few days.
3. Set `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` (Twilio Console home page), `TWILIO_FROM` (the Twilio number, e.g. `+18885550123`) and `LEAD_NOTIFY_PHONE` (your cell, e.g. `+15555550123`).

A lead counts as delivered if the webhook or any alert succeeds. If none of `LEAD_WEBHOOK_URL`, email alerts or text alerts are set, `npm run dev` logs leads to the console, and production shows an error so leads aren't silently lost.

## Develop

```
npm install
cp .env.example .env.local   # set LEAD_WEBHOOK_URL
npm run dev
```

## The IUL Guide (PDF)

The lead magnet is `public/downloads/jgallion-iul-guide.pdf` (12 pages, US Letter), built from [`guide/iul-guide.html`](guide/iul-guide.html) with the brand fonts in `guide/fonts/`. To edit it, change the HTML and rebuild with `npx -y -p playwright node guide/build.js`, or open the HTML in Chrome and *Print → Save as PDF* (Letter, no margins, background graphics on).

## Before launch

- Have compliance review the page copy, the IUL Guide and the disclaimers, and add Jaden's license numbers or states if required.
- Confirm the bio in "Meet Jaden" and add a phone number or booking link if wanted.
- After submitting, the IUL Guide (`/downloads/jgallion-iul-guide.pdf`) downloads automatically, with a download button as a fallback. No email or text is needed to deliver it.
