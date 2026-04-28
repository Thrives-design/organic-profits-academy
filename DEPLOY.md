# Deploying Organic Profits Academy

## What's done

- **Neon Postgres schema created & seeded** (24 videos, 7 webinars, 86 chat messages, 10 forum posts + 35 replies, 10 products, admin user)
- **Local prod build verified against Neon** — `/api/health`, `/api/videos`, `/api/auth/login`, `/api/admin/members` all return valid data
- **Local git repo initialized** — 1 commit on `main`, no secrets or `node_modules` committed

## Env vars Vercel needs

| Name             | Value                                                                                                                   |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`   | `postgresql://neondb_owner:npg_Bm6ilHnALI7e@ep-jolly-bar-ajv6227s.c-3.us-east-2.aws.neon.tech/neondb?sslmode=require`   |
| `NODE_ENV`       | `production`                                                                                                            |

## (a) Push to GitHub

1. Go to <https://github.com/new>, name it e.g. `organic-profits-academy`, keep it **Private**, do NOT tick "Add README/license/gitignore". Click **Create repository**.
2. Copy the remote-add commands GitHub shows. Then run locally:
   ```bash
   cd /home/user/workspace/organic-profits
   git remote add origin https://github.com/<YOUR_USER>/organic-profits-academy.git
   git push -u origin main
   ```
   (If 2FA is on, use a Personal Access Token as the password, or `gh auth login`.)

## (b) Import to Vercel

1. Go to <https://vercel.com/new>.
2. Click **Import** next to the `organic-profits-academy` repo. (Authorize GitHub access if prompted.)
3. On the config screen, Vercel auto-detects Vite. Leave **Build Command**, **Output Directory**, and **Install Command** as the defaults — `vercel.json` overrides them.
4. Expand **Environment Variables** and add:
   - `DATABASE_URL` — the Neon string above
   - `NODE_ENV` — `production`
5. Click **Deploy**. First deploy takes ~2 minutes.

## (c) Point organicprofitsacademy.com at Vercel

1. In the Vercel project, open **Settings → Domains**.
2. Add `organicprofitsacademy.com` and `www.organicprofitsacademy.com`.
3. Vercel will show the DNS records you need to set at your registrar:
   - Apex (`@`) → `A` record to `76.76.21.21` (Vercel gives the exact IP).
   - `www` → `CNAME` to `cname.vercel-dns.com`.
4. Save at your registrar and wait for DNS (minutes to ~1 hour). Vercel will auto-issue SSL.

## Snags / things to know

- **Session store**: the task spec suggested `iron-session`, but the existing client already uses Bearer tokens stored in React state (not cookies), so switching to encrypted cookies would have meant rewriting the client too. I instead replaced the in-memory `Map<string, userId>` with a **Postgres `sessions` table** — tokens survive serverless cold starts, which was the real requirement. No `SESSION_SECRET` needed. If you ever want stateless encrypted cookies, `iron-session` is still a drop-in refactor later.
- **`drizzle-orm` upgraded** `0.39.3 → 0.45.x`. Required because `@neondatabase/serverless` v1 changed its API; older drizzle versions threw "This function can now be called only as a tagged-template function."
- **`better-sqlite3`, `@types/better-sqlite3`, `memorystore` removed** from deps.
- **`@neondatabase/serverless`** uses HTTP, not a persistent connection — perfect for Vercel serverless (no connection pooling issues).
- **Seeding is idempotent** — `npm run seed` no-ops if users exist. If you ever need a clean reseed, drop tables in Neon and run `npm run db:push && npm run seed`.
- **Local dev**: `cp .env.example .env`, paste the `DATABASE_URL`, then `npm run dev` (still works — the Vite dev server + Express serve together on port 5000).
- **Vercel routing**: `vercel.json` rewrites `/api/*` to the `api/index.ts` serverless function. Express sees the full path (`/api/videos` etc.) and matches its routes unchanged. Static assets are served from `dist/public` which `vite build` produces.
- **Custom domain email/forms**: no email sending is wired up — checkout and signup just write to DB. Add a mail provider (Resend, Postmark) when ready.
- **Passwords are stored plaintext** (unchanged from the prior build). Before public launch, add bcrypt hashing in `server/routes.ts` — 15 min change.
