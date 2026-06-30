# BTimely

AI-powered time estimation that learns your personal pace.

## What it does

1. **Describe or upload** a task (assignment, work item, personal errand)
2. **Get an AI estimate** with reasoning and a time breakdown
3. **Mark complete** and log how long it actually took
4. **BTimely learns** from your feedback and personalizes future estimates

## Quick start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Add your OPENAI_API_KEY to .env (optional — demo mode works without it)

# Initialize database
npm run db:push

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page, or [http://localhost:3000/app](http://localhost:3000/app) to use the app.

## Tech stack

- **Next.js 16** (App Router, React 19)
- **Tailwind CSS 4** for styling
- **Prisma + SQLite** for data (swap to PostgreSQL for production)
- **OpenAI GPT-4o-mini** for cost-efficient estimates (~$0.001–0.003 per estimate)

## How personalization works

BTimely uses an exponential moving average (EMA) to track:

- A **global pace multiplier** (are you generally faster or slower than estimates?)
- **Per-category multipliers** (homework vs work vs personal, etc.)

After each completed task, these calibrations update automatically. The AI prompt also includes your recent actual-vs-estimated history for smarter base estimates.

## Project structure

```
src/
├── app/
│   ├── page.tsx          # Landing page
│   ├── app/page.tsx      # Main dashboard
│   └── api/              # REST API routes
├── components/           # UI components
└── lib/
    ├── ai.ts             # OpenAI integration
    ├── personalization.ts # Learning algorithm
    └── db.ts             # Prisma client
```

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | SQLite path or Postgres connection string |
| `OPENAI_API_KEY` | No | Enables real AI estimates (demo mode without it) |

## Production deployment

See [LAUNCH_GUIDE.md](./LAUNCH_GUIDE.md) for full deployment and App Store instructions.

Recommended hosting: **Vercel** (free tier) + **Neon** or **Supabase** (free Postgres tier).

## Business & pricing

See [BUSINESS_PLAN.md](./BUSINESS_PLAN.md) for monetization strategy and cost analysis.
