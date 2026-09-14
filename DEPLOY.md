# Deploy

## Cloudflare Pages (recommended)

1. Connect the repo to Cloudflare Pages.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set environment variables from `.env.example` in the Pages project settings.

## Manual

```bash
npm run build
npx wrangler pages deploy dist
```
