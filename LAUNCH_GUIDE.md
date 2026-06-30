# BTimely — Launch Guide (Step by Step)

A practical checklist from local development to website launch to App Store.

---

## Phase 1: Local development (you are here)

- [x] Next.js app with landing page + dashboard
- [x] AI estimation API
- [x] User feedback / learning loop
- [x] SQLite database

### Run locally

```bash
npm install
cp .env.example .env
# Add OPENAI_API_KEY=sk-... to .env
npm run db:push
npm run dev
```

Test the full loop:
1. Go to `/app`
2. Submit a task description
3. Click "Start task" → "Mark complete" → enter actual time
4. Submit another similar task — notice the personalized estimate

---

## Phase 2: Production database

SQLite works for development only. For production:

### Option A: Neon (recommended, free tier)

1. Create account at [neon.tech](https://neon.tech)
2. Create a project → copy the connection string
3. Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

4. Set `DATABASE_URL` in production env to your Neon connection string
5. Run `npx prisma db push` (or `prisma migrate dev` for migrations)

### Option B: Supabase

Same process — use the Postgres connection string from Supabase dashboard.

---

## Phase 3: Deploy the website

### Vercel (recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Set environment variables:
   - `DATABASE_URL` — your Postgres connection string
   - `OPENAI_API_KEY` — your OpenAI key
4. Deploy

Vercel auto-detects Next.js. Your site will be live at `btimely.vercel.app`.

### Custom domain

1. Buy domain (e.g., `btimely.app` on Namecheap, ~$12/year)
2. In Vercel → Project Settings → Domains → add your domain
3. Update DNS records as Vercel instructs

---

## Phase 4: Essential pre-launch items

### Legal (don't skip)

- [ ] **Privacy Policy** — required for App Store; use a generator like [Termly](https://termly.io) (free tier)
- [ ] **Terms of Service** — especially if you charge money
- [ ] **Cookie notice** — if you add analytics

### Analytics (pick one)

- [Vercel Analytics](https://vercel.com/analytics) — simple, privacy-friendly
- [Plausible](https://plausible.io) — GDPR-friendly, $9/month
- [PostHog](https://posthog.com) — free tier, product analytics

### Error monitoring

- [Sentry](https://sentry.io) — free tier, catches production errors

### Payments (when ready to monetize)

1. Create [Stripe](https://stripe.com) account
2. Add Stripe Checkout or Stripe Billing
3. Implement usage limits in API (check user's plan before estimating)
4. Suggested: use [Stripe Customer Portal](https://stripe.com/docs/customer-management) for self-service billing

---

## Phase 5: Add authentication (before monetization)

Current MVP uses anonymous device-based users (localStorage). Before charging money, add real auth:

### Recommended: Clerk (easiest)

```bash
npm install @clerk/nextjs
```

- Free up to 10,000 MAU
- Handles sign-up, sign-in, social logins
- Migrate anonymous users by linking localStorage userId to Clerk account on first sign-in

### Alternative: NextAuth.js

More control, more setup. Good if you want to avoid third-party auth costs at scale.

---

## Phase 6: App Store launch (iOS)

You have two paths:

### Path A: Capacitor wrapper (fastest, ~1 week)

Wrap your existing web app in a native shell.

```bash
npm install @capacitor/core @capacitor/cli @capacitor/ios
npx cap init BTimely com.btimely.app --web-dir=out
```

1. Configure Next.js for static export OR point Capacitor to your Vercel URL
2. `npx cap add ios`
3. Open in Xcode: `npx cap open ios`
4. Configure app icons, splash screen, permissions
5. Test on simulator and physical device
6. Submit via App Store Connect

**Pros:** One codebase, fast to ship
**Cons:** Feels slightly less native, requires internet

### Path B: React Native / Expo (better long-term, ~4–8 weeks)

Rebuild UI in React Native for a truly native feel. Share API/backend logic.

**Pros:** Better performance, offline support, push notifications
**Cons:** Significant additional development

### App Store requirements

1. **Apple Developer Account** — $99/year at [developer.apple.com](https://developer.apple.com)
2. **App Store Connect** — create app listing
3. **Screenshots** — 6.7" and 6.1" iPhone sizes (use Xcode simulator)
4. **App description** — focus on student use case
5. **Privacy nutrition labels** — declare data collection (task descriptions, usage data)
6. **Review** — typically 1–3 days; avoid mentioning "AI" without explaining data handling

### Android (Google Play)

Same Capacitor approach:

```bash
npx cap add android
npx cap open android
```

Google Play Developer account: $25 one-time.

---

## Phase 7: Launch marketing checklist

### Week before launch
- [ ] Landing page live with clear CTA
- [ ] Product Hunt draft prepared
- [ ] 3–5 screenshot/GIF demos for social
- [ ] Reddit posts drafted (r/productivity, r/college, r/SideProject)

### Launch day
- [ ] Post on Product Hunt
- [ ] Share on Twitter/X, LinkedIn
- [ ] Post in relevant subreddits (follow each sub's self-promo rules)
- [ ] Email friends / beta testers for reviews

### Week after launch
- [ ] Respond to all feedback within 24 hours
- [ ] Fix top 3 user-reported issues
- [ ] Add App Store link to website once approved
- [ ] Start weekly "accuracy improvement" emails to engaged users

---

## Phase 8: Post-launch roadmap

| Priority | Feature | Why |
|----------|---------|-----|
| P0 | Usage limits + Stripe billing | Revenue |
| P0 | Real auth (Clerk) | Required for paid users |
| P1 | PDF upload parsing | Students upload assignments as PDFs |
| P1 | Push notifications | "How long did that take?" reminder |
| P2 | Calendar integration | See estimates alongside schedule |
| P2 | Weekly accuracy report | Retention hook |
| P3 | Study group sharing | Viral growth |
| P3 | Apple Watch / widget | Glanceable active task timer |

---

## Estimated timeline

| Milestone | Timeframe |
|-----------|-----------|
| Local MVP working | ✅ Done |
| Deploy to Vercel + custom domain | 1 day |
| Privacy policy + analytics | 1 day |
| Beta with 20 users | 1 week |
| Stripe + auth + usage limits | 1–2 weeks |
| Public launch (website) | Week 3–4 |
| iOS App Store (Capacitor) | Week 5–6 |
| Android Play Store | Week 7 |

---

## Costs to launch (minimum)

| Item | Cost |
|------|------|
| Domain (.app) | ~$12/year |
| Vercel hosting | $0 (hobby) |
| Neon Postgres | $0 (free tier) |
| OpenAI API | ~$1–5/month early on |
| Apple Developer | $99/year |
| Google Play | $25 one-time |
| **Total year 1** | **~$140–160** |

You can launch the website for essentially free and add the App Store when you have traction.

---

## Quick commands reference

```bash
npm run dev          # Local development
npm run build        # Production build
npm run db:push      # Sync database schema
npm run db:studio    # Visual database browser
npx cap sync         # Sync web app to Capacitor (after setup)
```

Good luck with the launch! 🚀
