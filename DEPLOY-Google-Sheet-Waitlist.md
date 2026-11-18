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

## Waitlist → Google Sheet (Apps Script)

The marketing site posts waitlist emails to a Google Apps Script web app. Credentials never live in the Astro build beyond a shared secret token.

### 1. Create the sheet

sheets.google.com

Create a Google Sheet with a header row:

| A         | B     | C         |
| --------- | ----- | --------- |
| timestamp | email | userAgent |

Save the sheet

### 2. Add the script

In the sheet: **Extensions → Apps Script**. Paste:

```javascript
const SHEET_NAME = 'Sheet1'; // rename if needed
const EXPECTED_TOKEN = 'replace-with-a-long-random-secret';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    if (!data.token || data.token !== EXPECTED_TOKEN) {
      return json_({ ok: false, message: 'Unauthorized' }, 401);
    }

    const email = String(data.email || '').trim().toLowerCase();
    if (!/^[^\s@]+@(gmail|googlemail)\.com$/i.test(email)) {
      return json_({ ok: false, message: 'Please use a Gmail address.' }, 400);
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const existing = sheet.getRange(2, 2, Math.max(sheet.getLastRow() - 1, 1), 1).getValues();
    const duplicate = existing.some((row) => String(row[0]).toLowerCase() === email);
    if (duplicate) {
      return json_({ ok: true, duplicate: true });
    }

    sheet.appendRow([new Date().toISOString(), email, String(data.userAgent || '')]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, message: 'Server error' }, 500);
  }
}

function json_(body, status) {
  // Apps Script web apps ignore HTTP status for CORS POSTs from browsers;
  // always return a JSON body the site can read. Include status for debugging.
  return ContentService.createTextOutput(
    JSON.stringify({ ...body, status: status || 200 }),
  ).setMimeType(ContentService.MimeType.JSON);
}
```

#### Create a shared secret (`EXPECTED_TOKEN`)
Generate a long random string, e.g. in PowerShell:
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])

Set `EXPECTED_TOKEN` to a long random value (same as `PUBLIC_WAITLIST_TOKEN`).


### 3. Deploy the web app

1. **Deploy → New deployment → Web app**
2. Execute as: **Me**
3. Who has access: **Anyone**
4. Copy the `/exec` URL into `PUBLIC_WAITLIST_URL`

### 4. Site env

```
PUBLIC_APP_READY=false
PUBLIC_WAITLIST_URL=https://script.google.com/macros/s/.../exec
PUBLIC_WAITLIST_TOKEN=same-secret-as-EXPECTED_TOKEN
```

The site sends `Content-Type: text/plain` with a JSON body so the browser avoids a CORS preflight against Apps Script. Redeploy the script after any code change.


**Cloudflare Pages** — Project → Settings → Environment variables → same keys for Production (and Preview if you want). Redeploy so the build picks them up.