'use client';

import { useMemo, useState } from 'react';
import {
  MASTERY_PRICING,
  PLAN_FEATURES,
  PLAN_FEATURE_INCLUSION,
  getYearlySavings,
  type Cadence,
  type PlanId,
} from '../../data/plans';

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
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
  ctaLoading,
  ctaDisabled,
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
  ctaLoading?: boolean;
  ctaDisabled?: boolean;
}) {
  const included = PLAN_FEATURE_INCLUSION[planId];
  const visible = onlyIncluded
    ? PLAN_FEATURES.filter((f) => included.has(f.id))
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
        <p className="mt-5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
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
        disabled={ctaDisabled || ctaLoading}
        onClick={onCta}
        className={`mt-6 inline-flex h-11 items-center justify-center rounded-full px-4 text-sm font-semibold transition-opacity disabled:opacity-60 ${
          ctaVariant === 'outline'
            ? 'border border-border bg-background text-foreground hover:bg-muted'
            : 'bg-primary text-primary-foreground hover:opacity-90'
        }`}
      >
        {ctaLoading ? 'Processing…' : ctaLabel}
      </button>
    </article>
  );
}

export function PricingSection({
  appUrl,
  homeApiUrl,
  razorpayKeyId,
  enableCheckout = false,
}: {
  appUrl: string;
  homeApiUrl: string;
  razorpayKeyId: string;
  enableCheckout?: boolean;
}) {
  const [cadence, setCadence] = useState<Cadence>('yearly');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const savings = useMemo(() => getYearlySavings(MASTERY_PRICING), []);
  const { currencySymbol, monthly, yearly } = MASTERY_PRICING;

  const masteryPriceNode =
    cadence === 'yearly' ? (
      <div>
        <div className="text-sm text-muted-foreground line-through">
          {currencySymbol}
          {savings.monthlyTotal}
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold tracking-tight text-foreground">
            {currencySymbol}
            {yearly}
          </span>
          <span className="text-sm text-muted-foreground">/yr</span>
        </div>
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

  const startCheckout = async () => {
    setError(null);
    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Enter a valid email so we can link your Mastery plan.');
      return;
    }
    if (!enableCheckout) {
      window.location.href = `${appUrl}/login?next=/billing&upgrade=mastery&cadence=${cadence}`;
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${homeApiUrl.replace(/\/$/, '')}/v1/checkout/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmed,
          planId: 'mastery',
          cadence,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { message?: string } | null;
        throw new Error(body?.message || 'Could not start checkout.');
      }
      const order = (await res.json()) as {
        orderId: string;
        amount: number;
        currency: string;
        keyId: string;
        email: string;
      };

      const ok = await loadRazorpayScript();
      if (!ok || !window.Razorpay) {
        throw new Error('Razorpay failed to load. Please try again.');
      }

      const rzp = new window.Razorpay({
        key: order.keyId || razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: 'YTSchool',
        description: `Mastery (${cadence})`,
        order_id: order.orderId,
        prefill: { email: order.email },
        theme: { color: '#1a1a1a' },
        handler: () => {
          window.location.href = `/checkout/success?order_id=${encodeURIComponent(order.orderId)}`;
        },
        modal: {
          ondismiss: () => {
            window.location.href = '/checkout/cancel';
          },
        },
      });
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed.');
    } finally {
      setLoading(false);
    }
  };

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

          {enableCheckout ? (
            <div className="mx-auto mt-6 max-w-md text-left">
              <label htmlFor="checkout-email" className="text-sm font-medium text-foreground">
                Email for Mastery checkout
              </label>
              <input
                id="checkout-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
              {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
            </div>
          ) : null}
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
            ctaLabel="Get started free"
            ctaVariant="outline"
            onCta={() => {
              window.location.href = `${appUrl}/login?next=/my-learning`;
            }}
          />
          <PlanCard
            planId="mastery"
            title="Mastery"
            tagline="Full Access for a Year"
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
            ctaLabel="Subscribe to Mastery"
            ctaLoading={loading}
            onCta={() => {
              void startCheckout();
            }}
          />
        </div>
      </div>
    </section>
  );
}
