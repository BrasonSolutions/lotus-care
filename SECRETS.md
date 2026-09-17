# Cloudflare secrets

Run from this directory (`wrangler.jsonc` lives here). Deploy once first so the Worker exists.

```bash
npx wrangler login
npm run deploy
npx wrangler secret put OCCUPOP_API_TOKEN
npx wrangler secret put RESEND_API_KEY
```

Each `put` prompts for the value. List with `npx wrangler secret list`.
Local dev: copy `.dev.vars.example` to `.dev.vars`.
