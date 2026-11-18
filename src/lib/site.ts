const WAITLIST_HREF = '/#waitlist';

function stripTrailingSlash(url: string) {
  return url.replace(/\/$/, '');
}

export function getSiteConfig() {
  const appUrl = stripTrailingSlash(import.meta.env.PUBLIC_APP_URL || 'http://localhost:8080');
  const appReady = (import.meta.env.PUBLIC_APP_READY || 'false').toLowerCase() === 'true';
  const waitlistUrl = (import.meta.env.PUBLIC_WAITLIST_URL || '').trim();
  const waitlistToken = (import.meta.env.PUBLIC_WAITLIST_TOKEN || '').trim();
  const loginUrl = `${appUrl}/login`;
  const masteryBillingUrl = `${loginUrl}?next=/billing&upgrade=mastery`;
  const viewerLoginUrl = `${loginUrl}?next=/my-learning`;

  return {
    appUrl,
    appReady,
    waitlistUrl,
    waitlistToken,
    waitlistHref: WAITLIST_HREF,
    loginUrl,
    masteryBillingUrl,
    viewerLoginUrl,
    primaryCtaHref: appReady ? loginUrl : WAITLIST_HREF,
    primaryCtaLabel: appReady ? 'Get started' : 'Join waitlist',
  };
}

export type SiteConfig = ReturnType<typeof getSiteConfig>;
