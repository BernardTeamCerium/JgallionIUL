"use client";

import { useActionState, useEffect } from "react";
import { submitLead, type LandingState } from "./actions";
import s from "./landing.module.css";

const STATES = "AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY".split(" ");

const GUIDE_URL = "/downloads/jgallion-iul-guide.pdf";

const INTERESTS = [
  "The Free IUL Guide",
  "A Retirement / Tax Diversification Review",
  "What to Do After Maxing Out My 401(k)",
  "Business Owner Strategies",
  "Planning for Healthcare Professionals",
  "Life Insurance Protection for My Family",
];

export function LeadForm({
  cta,
  offer,
  interest,
  utm,
}: {
  cta: string;
  offer: string;
  interest: string;
  utm: Record<string, string>;
}) {
  const [state, action, pending] = useActionState<LandingState, FormData>(submitLead, {});

  // Start the guide download as soon as the form goes through; the button below is the fallback.
  useEffect(() => {
    if (!state.ok) return;
    const link = document.createElement("a");
    link.href = GUIDE_URL;
    link.download = "J-Gallion-IUL-Guide.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }, [state.ok]);

  if (state.ok) {
    return (
      <div className={s.thanks} role="status">
        <p className={s.eyebrow}>You&rsquo;re all set</p>
        <h3 className={s.thanksTitle}>Thank You{state.firstName ? `, ${state.firstName}` : ""}.</h3>
        <p>
          Your IUL Guide is downloading now. If it doesn&rsquo;t start, use the button below. Jaden will also reach
          out shortly to answer any questions. There&rsquo;s no cost and no obligation.
        </p>
        <a className={s.btnGold} href={GUIDE_URL} target="_blank" rel="noopener" download="J-Gallion-IUL-Guide.pdf">
          Download the Guide <span aria-hidden="true">↓</span>
        </a>
      </div>
    );
  }

  return (
    <form action={action} className={s.form} noValidate>
      <input type="hidden" name="offer" value={offer} />
      {Object.entries(utm).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <div className={s.hp} aria-hidden="true">
        <label>
          Website
          <input name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className={s.row2}>
        <label className={s.field}>
          First Name
          <input name="first_name" autoComplete="given-name" required />
        </label>
        <label className={s.field}>
          Last Name
          <input name="last_name" autoComplete="family-name" />
        </label>
      </div>
      <label className={s.field}>
        Email
        <input name="email" type="email" autoComplete="email" inputMode="email" required />
      </label>
      <div className={s.row2}>
        <label className={s.field}>
          Phone
          <input name="phone" type="tel" autoComplete="tel" inputMode="tel" required />
        </label>
        <label className={s.field}>
          State
          <select name="state" autoComplete="address-level1" defaultValue="">
            <option value="" disabled>
              Select
            </option>
            {STATES.map((st) => (
              <option key={st}>{st}</option>
            ))}
          </select>
        </label>
      </div>
      <label className={s.field}>
        I&rsquo;m Most Interested In
        <select name="interest" defaultValue={interest}>
          {INTERESTS.map((i) => (
            <option key={i}>{i}</option>
          ))}
        </select>
      </label>
      <label className={s.consent}>
        <input type="checkbox" name="consent" required />
        <span>
          I agree that J Gallion Financial may contact me by phone, text or email about my request, including by
          automated means. Consent is not a condition of purchase. Message and data rates may apply; reply STOP to opt
          out.
        </span>
      </label>
      {state.error && (
        <p className={s.error} role="alert">
          {state.error}
        </p>
      )}
      <button className={s.btn} type="submit" disabled={pending}>
        {pending ? "Sending…" : cta} <span aria-hidden="true">→</span>
      </button>
      <p className={s.fine}>Educational only. No cost, no obligation, no pressure.</p>
    </form>
  );
}
