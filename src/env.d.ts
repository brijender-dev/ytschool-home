/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_APP_URL?: string;
  readonly PUBLIC_APP_READY?: string;
  readonly PUBLIC_WAITLIST_URL?: string;
  readonly PUBLIC_WAITLIST_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
