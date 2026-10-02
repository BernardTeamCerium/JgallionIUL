import type { Metadata } from "next";
import { LeadForm } from "./LeadForm";
import s from "./landing.module.css";

export const metadata: Metadata = {
  title: "Thinking About an IUL? Start Here · J Gallion Financial",
  description:
    "Get a simple guide to understand how Indexed Universal Life works, from Jaden Gallion, insurance professional at J Gallion Financial.",
  openGraph: {
    title: "Thinking About an IUL? Start Here.",
    description: "Get a simple guide to understand how Indexed Universal Life works.",
    images: ["/images/guide.webp"],
  },
};

/**
 * Ad variants: each Meta campaign links to /?c=<key> so the headline matches the ad that was clicked.
 * Copy is from the J Gallion IUL Marketing Creative Playbook.
 */
const VARIANTS = {
  guide: {
    eyebrow: "The IUL Guide",
    lines: [["Thinking about"], ["an ", "IUL?"], ["Start here."]],
    sub: "Get a simple guide to understand how Indexed Universal Life works: what it may provide, and where its limitations are.",
    cta: "Get the Free Guide",
    interest: "The free IUL Guide",
  },
  bucket: {
    eyebrow: "The third bucket",
    lines: [["You have a 401(k)."], ["You have savings."], ["What’s your ", "third bucket?"]],
    sub: "Your 401(k) doesn’t have to be your entire retirement strategy. Discover another approach to protection and long-term planning.",
    cta: "Explore Your Options",
    interest: "The free IUL Guide",
  },
  tax: {
    eyebrow: "Tax diversification",
    lines: [["What if taxes"], ["", "are higher"], ["when you retire?"]],
    sub: "Retirement planning isn’t only about how much you accumulate. It’s also about how your assets may be taxed when you need income.",
    cta: "Get a Retirement Review",
    interest: "A retirement / tax diversification review",
  },
  "401k": {
    eyebrow: "Beyond the 401(k)",
    lines: [["Maxed out"], ["your 401(k)?"], ["", "What’s next?"]],
    sub: "Already funding your employer plan consistently? Explore additional long-term strategies for protection and accumulation.",
    cta: "See Additional Strategies",
    interest: "What to do after maxing out my 401(k)",
  },
  owner: {
    eyebrow: "For business owners",
    lines: [["Your business"], ["isn’t your"], ["", "retirement plan."]],
    sub: "Build assets and protection outside the company you’re building, with strategies that may complement the value of your business.",
    cta: "Get the Business Owner Guide",
    interest: "Business owner strategies",
  },
  healthcare: {
    eyebrow: "For healthcare professionals",
    lines: [["You take care"], ["of everyone else."], ["What’s ", "your plan?"]],
    sub: "Retirement and protection planning for nurses, clinicians and healthcare professionals balancing demanding careers and family.",
    cta: "Request Information",
    interest: "Planning for healthcare professionals",
  },
} as const;

type VariantKey = keyof typeof VARIANTS;

const SEVEN = [
  {
    t: "It’s life insurance first",
    d: "An IUL is permanent life insurance with a death benefit. It is not a stock-market investment, and it should start with a real need for protection.",
  },
  {
    t: "How index crediting works",
    d: "Your cash value isn’t invested in the market directly. Interest is credited based on the performance of an index, such as the S&P 500®, over a set period.",
  },
  {
    t: "Caps and participation rates",
    d: "Upside is limited. Caps and participation rates set how much of an index gain is credited, and the insurer can change them over time.",
  },
  {
    t: "Floors protect against index losses",
    d: "Many policies have a 0% floor, so a down year for the index isn’t credited as a loss. Policy charges are still deducted in those years.",
  },
  {
    t: "Policy charges matter",
    d: "Cost of insurance, administrative fees and rider charges reduce cash value, especially in the early years. Understand them before you commit.",
  },
  {
    t: "Loans give access, with trade-offs",
    d: "You can borrow against cash value, but loans accrue interest and reduce the death benefit. A poorly managed loan can cause a policy to lapse.",
  },
  {
    t: "Many values aren’t guaranteed",
    d: "Illustrations are hypothetical. Results depend on how the policy is funded, credited and reviewed over time, so it needs ongoing attention.",
  },
];

const BUCKETS = [
  { k: "Bucket 1", t: "Your 401(k)", d: "Tax-deferred growth and often an employer match. Withdrawals in retirement are generally taxed as income." },
  { k: "Bucket 2", t: "Your savings", d: "Liquid and accessible for emergencies and near-term goals, with growth that’s taxed along the way." },
  {
    k: "Bucket 3",
    t: "An insurance strategy",
    d: "Properly structured permanent life insurance can add a death benefit plus cash value that may be accessed later.",
  },
];

const TAX = [
  { t: "Tax now", d: "Savings, CDs and brokerage accounts. Growth is generally taxed as you go." },
  { t: "Tax later", d: "401(k)s and traditional IRAs. Contributions are often pre-tax, and withdrawals are taxed as income." },
  {
    t: "Tax-advantaged",
    d: "Roth accounts and properly structured life insurance, where qualifying distributions or policy loans may be received income-tax-free.",
  },
];

const AUDIENCES = [
  { t: "Maxed-out 401(k) savers", d: "You’re already funding your employer plan and want to know what else is available." },
  { t: "Business owners", d: "Much of your net worth is tied up in your company. Build something outside it." },
  { t: "Healthcare professionals", d: "You care for everyone else. Make a plan for your own future, too." },
  { t: "Families", d: "You want lasting protection for the people who depend on you, with long-term flexibility." },
];

const FAQ = [
  {
    q: "Is an IUL an investment?",
    a: "No. An IUL is a life insurance policy. Its cash value earns interest linked to an index, but your money is not invested in the stock market, and you don’t own shares of the index.",
  },
  {
    q: "Can I lose money in an IUL?",
    a: "Index crediting typically has a floor, so a market decline isn’t credited as a loss. However, policy charges continue to be deducted, so cash value can decline, especially if the policy is underfunded or loans aren’t managed.",
  },
  {
    q: "Who is an IUL a good fit for?",
    a: "It may fit people who need permanent life insurance, have a long time horizon, and can fund the policy consistently. It isn’t right for everyone, and it shouldn’t replace an emergency fund or employer match.",
  },
  {
    q: "What does the review cost?",
    a: "Nothing. The guide and the conversation are educational and free, with no obligation to buy anything.",
  },
];

const PILLARS = [
  { t: "Build protection", icon: "shield" },
  { t: "Pursue growth", icon: "sprout" },
  { t: "Create opportunity", icon: "coins" },
] as const;

function Icon({ name }: { name: "shield" | "sprout" | "coins" }) {
  const common = { width: 34, height: 34, viewBox: "0 0 32 32", fill: "none", stroke: "currentColor", strokeWidth: 1.5, "aria-hidden": true } as const;
  if (name === "shield")
    return (
      <svg {...common}>
        <path d="M16 3 5 7v8c0 7 5 12 11 14 6-2 11-7 11-14V7L16 3Z" strokeLinejoin="round" />
        <path d="M11 20v-3M15 20v-5M19 20v-7" strokeLinecap="round" />
      </svg>
    );
  if (name === "sprout")
    return (
      <svg {...common}>
        <path d="M16 28V15M16 15c0-5 3-8 9-8 0 6-3 9-9 8ZM16 18c0-4-3-7-8-7 0 5 3 8 8 7ZM9 28h14" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  return (
    <svg {...common}>
      <ellipse cx="11" cy="21" rx="6" ry="2.2" />
      <path d="M5 21v4c0 1.2 2.7 2.2 6 2.2s6-1 6-2.2v-4" />
      <ellipse cx="21" cy="8" rx="6" ry="2.2" />
      <path d="M15 8v15c0 1.2 2.7 2.2 6 2.2s6-1 6-2.2V8M15 13c0 1.2 2.7 2.2 6 2.2s6-1 6-2.2M15 18c0 1.2 2.7 2.2 6 2.2s6-1 6-2.2" />
    </svg>
  );
}

function Wordmark({ light }: { light?: boolean }) {
  return (
    <span className={`${s.wordmark} ${light ? s.wordmarkLight : ""}`} aria-label="J Gallion Financial">
      <span className={s.wmTop}>J GALLION</span>
      <span className={s.wmBottom}>FINANCIAL</span>
    </span>
  );
}

export default async function JGallionLanding({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const one = (k: string) => (Array.isArray(sp[k]) ? sp[k]![0] : sp[k]) ?? "";
  const key = (one("c") in VARIANTS ? one("c") : "guide") as VariantKey;
  const v = VARIANTS[key];
  const utm = Object.fromEntries(
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]
      .map((k) => [k, one(k).slice(0, 120)])
      .filter(([, val]) => val),
  );
  const offer = `${v.eyebrow} (${key})`;

  return (
    <div className={s.page}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Jost:wght@400;500;600&display=swap"
        precedence="default"
      />

      <header className={s.header}>
        <div className={s.wrap}>
          <Wordmark />
          <a className={s.btnSmall} href="#get-started">
            Get Started
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className={s.hero}>
        <div className={`${s.wrap} ${s.heroGrid}`}>
          <div className={s.heroCopy}>
            <p className={s.eyebrow}>{v.eyebrow}</p>
            <span className={s.rule} />
            <h1 className={s.headline}>
              {v.lines.map((parts, i) => (
                <span key={i} className={s.hLine}>
                  {parts[0]}
                  {parts[1] && <span className={s.gold}>{parts[1]}</span>}
                </span>
              ))}
            </h1>
            <span className={s.rule} />
            <p className={s.lede}>{v.sub}</p>
            <ul className={s.pillars}>
              {PILLARS.map((p) => (
                <li key={p.t}>
                  <span className={s.pillarIcon}>
                    <Icon name={p.icon} />
                  </span>
                  {p.t}
                </li>
              ))}
            </ul>
            <div className={s.agent}>
              <img src="/images/jaden.webp" alt="" width={56} height={56} />
              <div>
                <strong>Jaden Gallion</strong>
                <span>Insurance Professional · J Gallion Financial</span>
              </div>
            </div>
          </div>

          <div className={s.card} id="get-started">
            <div className={s.cardHead}>
              <img src="/images/guide.webp" alt="The IUL Guide book cover" width={88} height={110} />
              <div>
                <p className={s.eyebrow}>Complimentary</p>
                <h2 className={s.cardTitle}>Get the IUL Guide</h2>
                <p className={s.cardSub}>7 things to understand before using an IUL in a retirement strategy.</p>
              </div>
            </div>
            <LeadForm cta={v.cta} offer={offer} interest={v.interest} utm={utm} />
          </div>
        </div>
      </section>

      {/* 7 things */}
      <section className={s.section}>
        <div className={s.wrap}>
          <div className={s.sectionHead}>
            <p className={s.eyebrow}>Inside the guide</p>
            <h2 className={s.h2}>
              7 things to understand <span className={s.gold}>before</span> using an IUL
            </h2>
            <p className={s.sectionSub}>
              Indexed Universal Life is often misunderstood. Here&rsquo;s a preview of what the guide walks through, in
              plain English.
            </p>
          </div>
          <ol className={s.seven}>
            {SEVEN.map((item, i) => (
              <li key={item.t}>
                <span className={s.num}>{String(i + 1).padStart(2, "0")}</span>
                <h3>{item.t}</h3>
                <p>{item.d}</p>
              </li>
            ))}
            <li className={s.sevenCta}>
              <h3>Get all seven, explained.</h3>
              <p>Download the full guide free and keep it for your next conversation with your family or advisor.</p>
              <a className={s.btnGhost} href="#get-started">
                {v.cta} <span aria-hidden="true">→</span>
              </a>
            </li>
          </ol>
        </div>
      </section>

      {/* Third bucket */}
      <section className={`${s.section} ${s.alt}`}>
        <div className={`${s.wrap} ${s.split}`}>
          <img className={s.splitImg} src="/images/buckets.webp" alt="Three blocks labelled 401(k), Savings and IUL" />
          <div>
            <p className={s.eyebrow}>The third bucket</p>
            <h2 className={s.h2}>
              You have a 401(k). You have savings. <span className={s.gold}>What&rsquo;s your third bucket?</span>
            </h2>
            <p className={s.body}>
              Your 401(k) doesn&rsquo;t have to be your entire retirement strategy. Some people use properly structured
              permanent life insurance as another component of a long-term financial plan.
            </p>
            <ul className={s.buckets}>
              {BUCKETS.map((b) => (
                <li key={b.k}>
                  <span className={s.bucketKey}>{b.k}</span>
                  <strong>{b.t}</strong>
                  <span>{b.d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Taxes */}
      <section className={s.section}>
        <div className={`${s.wrap} ${s.split} ${s.splitRev}`}>
          <div>
            <p className={s.eyebrow}>Tax diversification</p>
            <h2 className={s.h2}>
              What if taxes are <span className={s.gold}>higher</span> when you retire?
            </h2>
            <p className={s.body}>
              Retirement planning isn&rsquo;t only about how much you accumulate. It&rsquo;s also about how different
              assets may be treated when you eventually need income. Is your retirement income diversified by tax
              treatment?
            </p>
            <ul className={s.tax}>
              {TAX.map((t) => (
                <li key={t.t}>
                  <strong>{t.t}</strong>
                  <span>{t.d}</span>
                </li>
              ))}
            </ul>
            <a className={s.btn} href="#get-started">
              Get a Retirement Review <span aria-hidden="true">→</span>
            </a>
          </div>
          <img className={s.splitImg} src="/images/tax.webp" alt="Three books labelled Tax Now, Tax Later and Tax Diversified" />
        </div>
      </section>

      {/* Who it's for */}
      <section className={`${s.section} ${s.navy}`}>
        <div className={s.wrap}>
          <div className={s.sectionHead}>
            <p className={s.eyebrow}>Who we work with</p>
            <h2 className={s.h2}>
              Planning built around <span className={s.gold}>your</span> situation
            </h2>
          </div>
          <ul className={s.audiences}>
            {AUDIENCES.map((a) => (
              <li key={a.t}>
                <h3>{a.t}</h3>
                <p>{a.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Meet Jaden */}
      <section className={s.section}>
        <div className={`${s.wrap} ${s.meet}`}>
          <img className={s.portrait} src="/images/jaden.webp" alt="Jaden Gallion" width={600} height={520} />
          <div>
            <p className={s.eyebrow}>Meet your guide</p>
            <h2 className={s.h2}>Jaden Gallion</h2>
            <p className={s.role}>Insurance Professional · J Gallion Financial</p>
            <p className={s.body}>
              Jaden helps families, professionals and business owners understand how life insurance strategies like
              Indexed Universal Life may fit alongside the retirement accounts they already have.
            </p>
            <p className={s.body}>
              His approach is education first: how a policy works, what it costs, what isn&rsquo;t guaranteed, and
              whether it makes sense for you at all. You&rsquo;ll get straight answers and no pressure.
            </p>
            <ol className={s.steps}>
              <li>
                <strong>Get the guide</strong>
                <span>Learn the basics on your own time.</span>
              </li>
              <li>
                <strong>Have a conversation</strong>
                <span>A short, no-cost educational review.</span>
              </li>
              <li>
                <strong>Decide what fits</strong>
                <span>Move forward only if it makes sense.</span>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={`${s.section} ${s.alt}`}>
        <div className={`${s.wrap} ${s.narrow}`}>
          <div className={s.sectionHead}>
            <p className={s.eyebrow}>Common questions</p>
            <h2 className={s.h2}>Straight answers</h2>
          </div>
          <div className={s.faq}>
            {FAQ.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={s.final}>
        <div className={`${s.wrap} ${s.narrow}`}>
          <h2 className={s.h2}>
            Strategy today. <span className={s.gold}>A brighter tomorrow.</span>
          </h2>
          <p>Get your complimentary IUL Guide and see whether Indexed Universal Life belongs in your plan.</p>
          <a className={s.btnGold} href="#get-started">
            {v.cta} <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <footer className={s.footer}>
        <div className={s.wrap}>
          <Wordmark light />
          <p>
            For educational purposes only. J Gallion Financial and Jaden Gallion provide insurance products and do not
            provide tax or legal advice; consult a qualified tax or legal professional about your situation. Indexed
            Universal Life is a life insurance product, not a security or stock-market investment. Policy features,
            caps, participation rates and charges vary by carrier and product, and many policy values are not
            guaranteed. Policy loans and withdrawals reduce cash value and death benefit, may cause the policy to lapse,
            and may have tax consequences. Guarantees are based on the claims-paying ability of the issuing insurer.
            Coverage is subject to underwriting and approval. S&amp;P 500® is a registered trademark of S&amp;P Dow Jones
            Indices LLC.
          </p>
          <p>© {new Date().getFullYear()} J Gallion Financial. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
