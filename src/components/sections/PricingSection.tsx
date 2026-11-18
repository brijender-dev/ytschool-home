'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  PLAN_FEATURES,
  PLAN_FEATURE_INCLUSION,
  getMasteryPricingForRegion,
  getYearlySavings,
  type Cadence,
  type PlanId,
} from '../../data/plans';

function detectIsIndia() {
  if (typeof window === 'undefined') return true;
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta') return true;
    const langs = [navigator.language, ...(navigator.languages || [])]
      .filter(Boolean)
      .map((l) => l.toLowerCase());
    if (langs.some((l) => l === 'hi-in' || l.endsWith('-in'))) return true;
  } catch {
    /* ignore */
  }
  return false;
}

function PlanCard({
  planId,
  title,
  tagline,
  priceNode,
  description,
  featured,
  badge,
  featuresIntro,
  onlyIncluded,
  ctaLabel,
  ctaVariant = 'default',
  onCta,
}: {
  planId: PlanId;
  title: string;
  tagline: string;
  priceNode: React.ReactNode;
  description: string;
  featured?: boolean;
  badge?: React.ReactNode;
  featuresIntro?: string;
  onlyIncluded?: boolean;
  ctaLabel: string;
  ctaVariant?: 'default' | 'outline';
  onCta?: () => void;
}) {
  const included = PLAN_FEATURE_INCLUSION[planId];
  const viewerIncluded = PLAN_FEATURE_INCLUSION.viewer;
  const visible = onlyIncluded
    ? PLAN_FEATURES.filter((f) => {
        if (!included.has(f.id)) return false;
        // Mastery lists only extras beyond Viewer ("Everything in Viewer, plus:")
        if (planId === 'mastery') return !viewerIncluded.has(f.id);
        return true;
      })
    : PLAN_FEATURES;

  return (
    <article
      className={`relative flex flex-col rounded-2xl border p-6 ${
        featured
          ? 'border-primary bg-card shadow-md'
          : 'border-border bg-card/60'
      }`}
    >
      {badge ? <div className="absolute -top-3 right-4 flex gap-2">{badge}</div> : null}
      <div className="flex items-center gap-2">
        <h3 className="font-heading text-xl font-semibold text-foreground">{title}</h3>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{tagline}</p>
      <div className="mt-5">{priceNode}</div>
      <p className="mt-3 text-sm text-muted-foreground">{description}</p>
      {featuresIntro ? (
        <p className="mt-6 text-sm font-semibold tracking-wide text-foreground">
          {featuresIntro}
        </p>
      ) : null}
      <ul className="mt-3 space-y-2">
        {visible.map((f) => (
          <li key={f.id} className="flex items-start gap-2 text-sm text-foreground">
            <span className="mt-0.5 text-success">✓</span>
            {f.label}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onCta}
        className={`mt-6 inline-flex h-11 items-center justify-center rounded-full px-4 text-sm font-semibold transition-opacity ${
          ctaVariant === 'outline'
            ? 'border border-border bg-background text-foreground hover:bg-muted'
            : 'bg-primary text-primary-foreground hover:opacity-90'
        }`}
      >
        {ctaLabel}
      </button>
    </article>
  );
}

export function PricingSection({
  appReady,
  viewerHref,
  masteryHref,
  waitlistHref,
}: {
  appReady: boolean;
  viewerHref: string;
  masteryHref: string;
  waitlistHref: string;
}) {
  const [cadence, setCadence] = useState<Cadence>('yearly');
  const [isIndia, setIsIndia] = useState(true);

  useEffect(() => {
    setIsIndia(detectIsIndia());
  }, []);

  const pricing = useMemo(() => getMasteryPricingForRegion(isIndia), [isIndia]);
  const savings = useMemo(() => getYearlySavings(pricing), [pricing]);
  const { currencySymbol, monthly, yearly } = pricing;

  const masteryPriceNode =
    cadence === 'yearly' ? (
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold tracking-tight text-foreground">
          {currencySymbol}
          {yearly}
        </span>
        <span className="text-sm text-muted-foreground">/yr</span>
        <span className="text-sm text-muted-foreground line-through">
          {currencySymbol}
          {savings.monthlyTotal}
        </span>
      </div>
    ) : (
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold tracking-tight text-foreground">
          {currencySymbol}
          {monthly}
        </span>
        <span className="text-sm text-muted-foreground">/mo</span>
      </div>
    );

  const go = (href: string) => {
    window.location.href = href;
  };

  const freeCtaHref = appReady ? viewerHref : waitlistHref;
  const masteryCtaHref = appReady
    ? `${masteryHref}${masteryHref.includes('?') ? '&' : '?'}cadence=${cadence}`
    : waitlistHref;

  return (
    <section id="pricing" className="border-t border-border bg-background py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-foreground">Pricing</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Simple, honest pricing
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Start free. Upgrade to Mastery when YTSchool earns its place in your routine.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <div
              role="radiogroup"
              aria-label="Billing cadence"
              className="inline-flex items-center gap-1 rounded-full border border-border bg-muted p-1"
            >
              {(['monthly', 'yearly'] as Cadence[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  role="radio"
                  aria-checked={cadence === c}
                  onClick={() => setCadence(c)}
                  className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
                    cadence === c
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {c === 'monthly' ? 'Monthly' : 'Yearly'}
                </button>
              ))}
            </div>
            <span className="text-[12px] text-muted-foreground">
              Save <span className="font-semibold text-success">{savings.percent}%</span> with
              yearly billing
            </span>
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
          <PlanCard
            planId="viewer"
            title="Viewer"
            tagline="YouTube video viewing experience"
            priceNode={
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tight text-foreground">
                  {currencySymbol}0
                </span>
                <span className="text-sm text-muted-foreground">Forever</span>
              </div>
            }
            description="Watch YouTube videos for free. Perfect for casual learners exploring the platform."
            onlyIncluded
            ctaLabel={appReady ? 'Get started free' : 'Get notified'}
            ctaVariant="outline"
            onCta={() => go(freeCtaHref)}
          />
          <PlanCard
            planId="mastery"
            title="Mastery"
            tagline={
              cadence === 'yearly' ? 'Full Access for a Year' : 'Full Access for a Month'
            }
            priceNode={masteryPriceNode}
            description="Comprehensive long-term learning. Ideal for professional growth and mastery."
            featured
            badge={
              <>
                {cadence === 'yearly' && (
                  <span className="rounded-full bg-success px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
                    {savings.percent}% OFF
                  </span>
                )}
                <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground">
                  Popular
                </span>
              </>
            }
            featuresIntro="Everything in Viewer, plus:"
            onlyIncluded
            ctaLabel={appReady ? 'Subscribe to Mastery' : 'Reserve early access'}
            onCta={() => go(masteryCtaHref)}
          />
        </div>
      </div>
    </section>
  );
}
