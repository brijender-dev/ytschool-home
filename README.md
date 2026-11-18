# YTSchool Home

Static marketing site for YTSchool — landing page, docs, and blog.

## Develop

```bash
npm install
npm run dev
```

Open http://localhost:4321

Copy `.env.example` to `.env` and set:

| Variable | Purpose |
| --- | --- |
| `PUBLIC_SITE_URL` | Canonical site URL (sitemap / Open Graph) |
| `PUBLIC_APP_URL` | Product app URL (used when `PUBLIC_APP_READY=true`) |
| `PUBLIC_APP_READY` | `true` → Get Started links to the app; `false` → waitlist CTAs |
| `PUBLIC_WAITLIST_URL` | Google Apps Script web app URL |
| `PUBLIC_WAITLIST_TOKEN` | Shared secret verified by the Apps Script |

## Build

```bash
npm run build
npm run preview
```

## Content

- Blog: `src/content/blog/*.mdx` → `/blog`
- Docs: `src/content/docs/*.mdx` → `/docs`
