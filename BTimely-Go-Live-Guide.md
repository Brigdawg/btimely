# BTimely — Deploy to a Live Website

**Prepared for GitHub user: Brigdawg**  
**Your repo URL: https://github.com/Brigdawg/btimely**

---

## How to Run Terminal Commands

When this guide says to run a command:

1. Copy ONE line from a code box (only that single line)
2. Click inside Terminal
3. Paste (Command + V)
4. Press Enter
5. Wait until you see the % prompt again
6. Only then run the NEXT line

---

## Before You Start

Open Terminal and run:

```
cd ~/Desktop/BTimely
```

You should see something ending in `BTimely %`.

---

## Step 1: Create GitHub Repository (in browser)

1. Go to https://github.com/new
2. Sign in as **Brigdawg**
3. Repository name: **btimely**
4. Set to **Public**
5. Do NOT check Add a README
6. Click **Create repository**
7. Your repo: https://github.com/Brigdawg/btimely

---

## Step 2: Upload Code to GitHub (Terminal)

Run each command ONE AT A TIME:

### Command A — Stage files
```
git add .
```
Expected: Often nothing prints. That is OK.

### Command B — Commit
```
git commit -m "Initial BTimely release"
```
Expected: List of files / "files changed"

If you see "Author identity unknown", run these first, then Command B again:
```
git config user.name "Brigham"
git config user.email "YOUR-GITHUB-EMAIL@example.com"
```

### Command C — Branch name
```
git branch -M main
```
Expected: Usually nothing. OK.

### Command D — Link to GitHub
```
git remote add origin https://github.com/Brigdawg/btimely.git
```
Expected: Usually nothing. OK.

If you see "remote origin already exists", use:
```
git remote set-url origin https://github.com/Brigdawg/btimely.git
```

### Command E — Upload
```
git push -u origin main
```
Expected: `main -> main`. Browser may open for GitHub login.

**Verify:** Open https://github.com/Brigdawg/btimely — you should see src, public, prisma folders.

---

## Step 3: Create Neon Database (browser)

1. Go to https://neon.tech (free signup)
2. Create a project named **btimely**
3. Copy the **Connection string**
4. Save it in Notes — you need it twice

Looks like:
```
postgresql://username:password@ep-xxxx.neon.tech/neondb?sslmode=require
```

---

## Step 4: Prepare Project for Cloud (Terminal + Cursor)

### Command F
```
npm install @prisma/adapter-pg pg
```

### Command G
```
npm install -D @types/pg
```

### Edit prisma/schema.prisma
Change datasource to:
```
datasource db {
  provider = "postgresql"
}
```

### Edit .env
Replace DATABASE_URL with your Neon string. Keep your OPENAI_API_KEY.

### Command H
```
npx prisma generate
```

### Command I
```
npm run db:push
```
Expected: "Your database is now in sync."

---

## Step 5: Deploy on Vercel (browser)

1. Go to https://vercel.com → Continue with GitHub
2. Add New → Project → Import **btimely**
3. Before Deploy, add Environment Variables:

| Name | Value |
|------|-------|
| DATABASE_URL | Your Neon connection string |
| OPENAI_API_KEY | Your key from .env |

4. Click **Deploy**
5. Wait 2-4 minutes → Click **Visit**

Your live URL will look like: `https://btimely.vercel.app`

---

## Step 6: Test Live Site

- [ ] Landing page loads with logo
- [ ] /app opens from Get started
- [ ] Task estimate works
- [ ] Mark complete saves time
- [ ] Completed tab shows task
- [ ] Refresh keeps your data

---

## Updating Later (Terminal, one at a time)

```
cd ~/Desktop/BTimely
git add .
git commit -m "Describe what you changed"
git push
```

Vercel redeploys automatically in 2-3 minutes.

---

## Troubleshooting

**git push login issues:** Use browser sign-in or a GitHub Personal Access Token.

**remote origin already exists:**
```
git remote set-url origin https://github.com/Brigdawg/btimely.git
```

**Vercel build failed:** Run `npm run build` on your Mac first and fix errors.

**Estimates fail on live site:** Check OPENAI_API_KEY on Vercel.

**Tasks don't save:** Check DATABASE_URL on Vercel (include ?sslmode=require).

---

## Costs

- Vercel: $0 (free tier)
- Neon: $0 (free tier)
- OpenAI: ~$1-5/month
- Custom domain (optional): ~$12/year

---

*BTimely — Time estimates that get better with you.*
