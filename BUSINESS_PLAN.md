# BTimely — Business Plan & Pricing Brainstorm

## Value proposition

**Problem:** People consistently underestimate how long tasks take, leading to missed deadlines, stress, and poor planning.

**Solution:** BTimely gives realistic time estimates and gets more accurate over time by learning each user's personal pace — something generic calendars and to-do apps don't do.

**Target users:**
- **Students** (primary) — essays, readings, problem sets, exam prep
- **Knowledge workers** — reports, presentations, email batches
- **Personal productivity** — home projects, errands, learning new skills

---

## Cost structure (AI)

Using **GPT-4o-mini** (recommended):

| Item | Cost per estimate | Notes |
|------|-------------------|-------|
| Input tokens (~800) | ~$0.00012 | Includes user history context |
| Output tokens (~200) | ~$0.00012 | Structured JSON response |
| **Total per estimate** | **~$0.00025** | Less than 1/3 of a cent |

At scale:
- 1,000 estimates/month → **~$0.25**
- 10,000 estimates/month → **~$2.50**
- 100,000 estimates/month → **~$25**

Infrastructure (Vercel hobby + Neon free tier): **$0–20/month** until significant scale.

**Key insight:** AI cost is negligible per user if estimates are capped. The business constraint is acquisition, not inference.

---

## Pricing models (recommended hybrid)

### Free tier (acquisition)
- **5 estimates per month**
- Full learning/personalization
- No credit card required
- Goal: hook users, prove value after 2–3 completed tasks

### Pro — $4.99/month or $39.99/year
- **Unlimited estimates**
- Priority support
- Export task history
- Best for students during a semester

### Pro+ — $9.99/month (optional, later)
- Everything in Pro
- Calendar integration (Google/Apple)
- Team/shared estimates for study groups
- Advanced analytics (weekly time reports)

### Why these prices?
- Cheaper than a coffee — aligns with "helpful, not essential"
- Student-friendly annual plan (~$3.33/month)
- At $4.99/month, even heavy users (50 estimates/month) cost you ~$0.01 in AI — **~99% gross margin** on AI
- Comparable apps: Todoist ($5), Notion ($10), Forest ($2 one-time)

---

## Revenue projections (conservative)

| Month | Free users | Paid (2% conv.) | MRR |
|-------|-----------|-----------------|-----|
| 3 | 500 | 10 | $50 |
| 6 | 2,000 | 60 | $300 |
| 12 | 10,000 | 300 | $1,500 |
| 24 | 50,000 | 2,000 | $10,000 |

Assumes organic + campus marketing. Paid conversion improves as personalization value compounds (users with 10+ completed tasks convert at 3–5%).

---

## Monetization guardrails

1. **Cap free tier** — prevents abuse, drives conversion
2. **Use gpt-4o-mini** — 10–20x cheaper than GPT-4o with good enough quality
3. **Truncate context** — send last 8 tasks, not full history
4. **No fine-tuning** — EMA calibration is free and effective
5. **Rate limit** — 10 estimates/hour on free tier
6. **Batch similar tasks** — future feature to reduce API calls

---

## Competitive positioning

| Competitor | Weakness BTimely solves |
|-----------|------------------------|
| Google Calendar | No estimation intelligence |
| Todoist / Things | Manual time entry only |
| ChatGPT (raw) | No memory, no learning loop, no task tracking |
| Tiimo / Routinery | Routines, not one-off task estimation |

**Moat:** Per-user calibration data. The more tasks you complete, the harder it is to switch.

---

## Go-to-market ideas

### Phase 1 — Students (lowest CAC)
- Post in r/college, r/productivity, university subreddits
- TikTok/Reels: "I asked AI how long my essay would take"
- Partner with 2–3 campus study influencers
- Free for first semester promo code

### Phase 2 — Professionals
- LinkedIn content on planning fallacy
- Integrate with Notion/Obsidian templates
- "Weekly planning" newsletter

### Phase 3 — App Store
- Native wrapper (see LAUNCH_GUIDE.md)
- ASO keywords: "time estimate", "homework planner", "how long will this take"

---

## Future revenue streams

- **B2B / campus licenses** — $500–2,000/semester per university counseling center
- **API access** — edtech platforms embed estimation
- **Premium models** — optional GPT-4o for complex research papers (+$2/month add-on)

---

## Risks & mitigations

| Risk | Mitigation |
|------|-----------|
| OpenAI price increase | Abstract AI provider; support Anthropic/Gemini |
| Low retention | Push notifications when estimate accuracy improves |
| Privacy concerns | Clear data policy; local-first option later |
| App Store rejection | Follow guidelines; no medical/therapy claims |

---

## Recommended launch pricing

**Start simple:**
- Free: 5 estimates/month
- Pro: $3.99/month (introductory) → raise to $4.99 after 1,000 paid users

Keep it affordable. Your edge is habit-learning, not AI novelty — users stay because estimates get *scary accurate*, not because of the model.
