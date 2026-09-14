'use client';

import { useState } from 'react';
import type { FeatureGroup } from '../../data/featureGroups';

const iconPaths: Record<FeatureGroup['features'][number]['icon'], string> = {
  compass: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm3.5 6.5-2 6-6 2 2-6 6-2z',
  target: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 4a6 6 0 1 1-6 6 6 6 0 0 1 6-6zm0 3a3 3 0 1 0 3 3 3 3 0 0 0-3-3z',
  layers: 'M12 2 2 7l10 5 10-5-10-5zm0 9L2 6v2l10 5 10-5V6l-10 5zm0 4L2 10v2l10 5 10-5v-2l-10 5z',
  mic: 'M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z',
  sparkles: 'M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2zm6 10 1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3zM5 15l.8 2.2L8 18l-2.2.8L5 21l-.8-2.2L2 18l2.2-.8L5 15z',
  file: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm1 7V3.5L19.5 9H15z',
  users: 'M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4zM8 12a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm8 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zM8 14c-2.67 0-8 1.34-8 4v2h6v-2c0-1.48.8-2.65 2.05-3.49A12.3 12.3 0 0 0 8 14z',
  calendar: 'M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V10h14v10z',
  bookmark: 'M6 2h12a2 2 0 0 1 2 2v18l-8-4-8 4V4a2 2 0 0 1 2-2z',
  headphones: 'M12 3a9 9 0 0 0-9 9v7a3 3 0 0 0 3 3h2v-8H5v-2a7 7 0 0 1 14 0v2h-3v8h2a3 3 0 0 0 3-3v-7a9 9 0 0 0-9-9z',
  play: 'M8 5v14l11-7L8 5z',
  pin: 'M14 2l-1 5h5l-1 2h-4.2L14 17h-4l1.2-8H7L6 7h5L10 2h4z',
};

function FeatureIcon({ name }: { name: FeatureGroup['features'][number]['icon'] }) {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d={iconPaths[name]} />
    </svg>
  );
}

export function FeatureGroupSection({
  group,
  appUrl,
}: {
  group: FeatureGroup;
  appUrl: string;
}) {
  const [active, setActive] = useState(0);
  const feature = group.features[active];
  const bg = group.tint === 'plain' ? 'bg-background' : 'bg-muted';

  return (
    <section id={group.id} className={`border-t border-border ${bg}`}>
      <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-28">
        <div
          className={`grid items-center gap-12 lg:grid-cols-12 ${
            group.reverse ? 'lg:[&>div:first-child]:order-2' : ''
          }`}
        >
          <div className="lg:col-span-5">
            <p className="text-xs font-bold uppercase tracking-widest text-foreground">
              {group.eyebrow}
            </p>
            <h2 className="mt-3 text-balance font-heading text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
              {group.title}
            </h2>
            <p className="mt-4 max-w-md text-base text-muted-foreground">{group.subtitle}</p>

            <ul role="tablist" className="mt-8 flex flex-col gap-2">
              {group.features.map((f, i) => {
                const isActive = i === active;
                return (
                  <li key={f.label}>
                    <button
                      role="tab"
                      type="button"
                      aria-selected={isActive}
                      onClick={() => setActive(i)}
                      className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                        isActive
                          ? 'border-primary bg-card shadow-sm'
                          : 'border-border bg-transparent hover:bg-card/60'
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <FeatureIcon name={f.icon} />
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-foreground">{f.label}</div>
                        <p className="mt-0.5 text-sm text-muted-foreground">{f.description}</p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8">
              <a
                href={`${appUrl}/login`}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                {group.ctaLabel} →
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-md">
              <div className="flex items-center gap-1.5 border-b border-border bg-muted/60 px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/35" />
                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/35" />
                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/35" />
                <span className="ml-3 truncate text-[10px] text-muted-foreground">
                  ytschool.app · {feature.label}
                </span>
              </div>
              <div className="aspect-[16/10] w-full bg-muted/40 p-6">
                <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5">
                  <p className="text-sm font-semibold text-foreground">{feature.mockTitle}</p>
                  <ul className="mt-4 space-y-2">
                    {feature.mockLines.map((line) => (
                      <li
                        key={line}
                        className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground"
                      >
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
