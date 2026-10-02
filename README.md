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
| IUL Education (default) | `/` or `/?c=guide` | Thinking about an IUL? Start here. | Get the Free Guide |
| Third Retirement Bucket | `/?c=bucket` | You have a 401(k). You have savings. What's your third bucket? | Explore Your Options |
| Future Tax Exposure | `/?c=tax` | What if taxes are higher when you retire? | Get a Retirement Review |
| Maxed Out 401(k) | `/?c=401k` | Maxed out your 401(k)? What's next? | See Additional Strategies |
| Business Owners | `/?c=owner` | Your business isn't your retirement plan. | Get the Business Owner Guide |
| Healthcare Professionals | `/?c=healthcare` | You take care of everyone else. What's your plan? | Request Information |

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

If `LEAD_WEBHOOK_URL` isn't set, `npm run dev` logs leads to the console, and production shows an error so leads aren't silently lost.

## Develop

```
npm install
cp .env.example .env.local   # set LEAD_WEBHOOK_URL
npm run dev
```

## Before launch

- Have compliance review the copy and the footer disclaimer, and add Jaden's license numbers or states if required.
- Confirm the bio in "Meet Jaden" and add a phone number or booking link if wanted.
- The thank-you message promises the IUL Guide, so set up the follow-up that delivers it (for example, a CRM email workflow).
