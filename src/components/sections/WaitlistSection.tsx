'use client';

import { useState, type FormEvent } from 'react';

const GMAIL_RE = /^[^\s@]+@(gmail|googlemail)\.com$/i;

type Status = 'idle' | 'loading' | 'success' | 'error';

export function WaitlistSection({
  waitlistUrl,
  waitlistToken,
}: {
  waitlistUrl: string;
  waitlistToken: string;
}) {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string | null>(null);

  const configured = Boolean(waitlistUrl && waitlistToken);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);

    if (honeypot.trim()) {
      setStatus('success');
      setMessage("You're on the list. We'll email you when YTSchool opens.");
      return;
    }

    const trimmed = email.trim().toLowerCase();
    if (!GMAIL_RE.test(trimmed)) {
      setStatus('error');
      setMessage('Please use a Gmail address (@gmail.com). That’s how you’ll sign in.');
      return;
    }

    if (!configured) {
      setStatus('error');
      setMessage('Waitlist is not configured yet. Please try again later.');
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch(waitlistUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          email: trimmed,
          token: waitlistToken,
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        }),
        redirect: 'follow',
      });

      const body = (await res.json().catch(() => null)) as
        | { ok?: boolean; message?: string; duplicate?: boolean }
        | null;

      if (!res.ok || !body?.ok) {
        throw new Error(body?.message || 'Could not join the waitlist. Please try again.');
      }

      setStatus('success');
      setEmail('');
      setMessage(
        body.duplicate
          ? "You're already on the list — we'll be in touch."
          : "You're on the list. We'll email you when YTSchool opens.",
      );
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <section id="waitlist" className="border-t border-border bg-muted py-24">
      <div className="mx-auto w-full max-w-xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-widest text-foreground">Waitlist</p>
        <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Be first when we launch
        </h2>
        <p className="mt-4 text-base text-muted-foreground">
          YTSchool is in development. Leave your Gmail and we&apos;ll invite you as soon as the
          app is ready — we use Google sign-in only.
        </p>

        {status === 'success' ? (
          <p className="mt-8 rounded-2xl border border-border bg-card px-5 py-4 text-sm text-foreground">
            {message}
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mx-auto mt-8 max-w-md text-left" noValidate>
            <label htmlFor="waitlist-email" className="text-sm font-medium text-foreground">
              Gmail address
            </label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <input
                id="waitlist-email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@gmail.com"
                className="w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                disabled={status === 'loading'}
                required
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {status === 'loading' ? 'Joining…' : 'Notify me'}
              </button>
            </div>
            <input
              type="text"
              name="company"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
            />
            <p className="mt-3 text-xs text-muted-foreground">
              Use your Gmail — that&apos;s how you&apos;ll sign in when we launch.
            </p>
            {status === 'error' && message ? (
              <p className="mt-2 text-sm text-destructive" role="alert">
                {message}
              </p>
            ) : null}
          </form>
        )}
      </div>
    </section>
  );
}
