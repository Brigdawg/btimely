import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
} from "docx";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.join(__dirname, "..", "BTimely-Go-Live-Guide.docx");

const GITHUB_USER = "Brigdawg";
const REPO_NAME = "btimely";
const GITHUB_URL = `https://github.com/${GITHUB_USER}/${REPO_NAME}`;

function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({ text, heading: level, spacing: { before: 300, after: 150 } });
}

function body(text, options = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, size: 22, ...options })],
  });
}

function bullet(text, level = 0) {
  return new Paragraph({ text, bullet: { level }, spacing: { after: 80 } });
}

function numberedStep(number, title, details) {
  const paragraphs = [
    new Paragraph({
      spacing: { before: 200, after: 80 },
      children: [
        new TextRun({ text: `Step ${number}: `, bold: true, size: 24 }),
        new TextRun({ text: title, bold: true, size: 24 }),
      ],
    }),
  ];
  for (const d of details) {
    if (typeof d === "string") paragraphs.push(body(d));
    else if (Array.isArray(d)) {
      paragraphs.push(new Paragraph({ spacing: { after: 80 }, children: d }));
    } else paragraphs.push(d);
  }
  return paragraphs;
}

function codeBlock(lines) {
  return new Paragraph({
    spacing: { before: 100, after: 150 },
    shading: { type: ShadingType.CLEAR, fill: "E8F4FC" },
    border: {
      top: { style: BorderStyle.SINGLE, size: 1, color: "D4E4EF" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "D4E4EF" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "D4E4EF" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "D4E4EF" },
    },
    children: lines.map(
      (line, i) =>
        new TextRun({
          text: line + (i < lines.length - 1 ? "\n" : ""),
          font: "Courier New",
          size: 20,
        })
    ),
  });
}

function terminalCommand(label, command, expected) {
  return [
    new Paragraph({
      spacing: { before: 160, after: 60 },
      children: [new TextRun({ text: label, bold: true, size: 22 })],
    }),
    codeBlock([command]),
    body(`What you should see: ${expected}`, { italics: true, size: 20 }),
  ];
}

const doc = new Document({
  creator: "BTimely",
  title: "BTimely — Deploy to a Live Website",
  description: "Step-by-step guide to publish BTimely on the internet",
  styles: {
    default: { document: { run: { font: "Calibri", size: 22 } } },
  },
  sections: [
    {
      properties: {},
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [
            new TextRun({ text: "BTimely", bold: true, size: 52, color: "1A3A5C" }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            new TextRun({ text: "Deploy to a Live Website", size: 32, color: "5A7A94" }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          children: [
            new TextRun({
              text: `Prepared for GitHub user: ${GITHUB_USER}`,
              size: 22,
              color: "5A7A94",
              italics: true,
            }),
          ],
        }),

        body(
          "This guide walks you through putting BTimely on the internet so anyone can visit it with a real web link (like https://btimely.vercel.app). Follow every step in order. Do not skip ahead."
        ),
        body(
          "Estimated time: 30–60 minutes. Total cost to launch: $0 using free tiers. A custom domain is optional (~$12/year)."
        ),

        heading("What You Will End Up With"),
        bullet("A live URL you can share with anyone"),
        bullet("Your app running 24/7 (your laptop can be closed)"),
        bullet("A cloud database that saves tasks online"),
        bullet(`Your code stored at ${GITHUB_URL}`),

        heading("What You Will Need"),
        bullet("BTimely folder on your Desktop"),
        bullet(`GitHub account — you are logged in as ${GITHUB_USER}`),
        bullet("Vercel account (free) — vercel.com"),
        bullet("Neon account (free) — neon.tech"),
        bullet("Your OpenAI API key (in your .env file on your Mac)"),

        heading("IMPORTANT: How to Run Terminal Commands"),
        body(
          "Throughout this guide, when we say run a command, you are NOT pasting everything at once. Do this every single time:"
        ),
        bullet("1. Copy ONE line from a gray code box (only that single line)"),
        bullet("2. Click inside Terminal (the app on your Mac)"),
        bullet("3. Paste with Command + V"),
        bullet("4. Press Enter"),
        bullet('5. Wait until you see the prompt again (it ends with a % sign)'),
        bullet("6. Only then copy and run the NEXT line"),
        body(
          "If a command fails, stop and read the error message. Do not run the next command until the current one succeeded."
        ),

        heading("Open Terminal and Go to Your Project"),
        body("Before Step 1, open Terminal and run this line:"),
        codeBlock(["cd ~/Desktop/BTimely"]),
        body(
          'You should see something ending in "BTimely %" — that means you are in the right folder. Keep Terminal open for all steps below.'
        ),

        heading("Step-by-Step Instructions"),

        ...numberedStep(1, "Create your GitHub repository (in your web browser)", [
          "Do this in Safari or Chrome — NOT in Terminal.",
          "1. Go to https://github.com/new",
          "2. Make sure you are signed in as Brigdawg",
          `3. Repository name: ${REPO_NAME} (all lowercase)`,
          "4. Set visibility to Public",
          '5. Do NOT check "Add a README file"',
          '6. Do NOT check "Add .gitignore"',
          '7. Do NOT choose a license',
          "8. Click the green Create repository button",
          "9. You will see a page titled \"Quick setup\". Leave this tab open.",
          `10. Your repo URL will be: ${GITHUB_URL}`,
        ]),

        ...numberedStep(2, "Upload your BTimely code to GitHub", [
          "Now go back to Terminal. Run each command below ONE AT A TIME, in order.",
          "Your GitHub username is already filled in: Brigdawg",
        ]),

        ...terminalCommand(
          "Command A — Stage all your project files",
          "git add .",
          "Often nothing prints. That is normal. If you see a list of files, that is also fine."
        ),

        ...terminalCommand(
          'Command B — Save a snapshot of your code (called a "commit")',
          'git commit -m "Initial BTimely release"',
          'A list of files and a message like "files changed". If it says "nothing to commit", skip to Command D.'
        ),

        body('If Command B says "Author identity unknown", run these two lines first, then run Command B again:'),
        codeBlock([
          'git config user.name "Brigham"',
          'git config user.email "YOUR-GITHUB-EMAIL@example.com"',
        ]),
        body("Replace YOUR-GITHUB-EMAIL with the email on your GitHub account."),

        ...terminalCommand(
          "Command C — Name your branch main",
          "git branch -M main",
          "Usually nothing prints. That is normal."
        ),

        ...terminalCommand(
          "Command D — Connect your Mac folder to your GitHub repo",
          `git remote add origin https://github.com/${GITHUB_USER}/${REPO_NAME}.git`,
          "Usually nothing prints. That is normal."
        ),

        body('If Command D says "remote origin already exists", run this instead:'),
        codeBlock([
          `git remote set-url origin https://github.com/${GITHUB_USER}/${REPO_NAME}.git`,
        ]),

        ...terminalCommand(
          "Command E — Upload your code to GitHub",
          "git push -u origin main",
          'Lines ending in "main -> main". A browser window may open to sign into GitHub — sign in as Brigdawg.'
        ),

        body("How to verify Step 2 worked:"),
        bullet(`1. Open ${GITHUB_URL} in your browser`),
        bullet("2. You should see folders named src, public, and prisma"),
        bullet("3. You should see files like package.json and README.md"),
        bullet("4. You should NOT see a file named .env (your API key — correctly hidden)"),

        ...numberedStep(3, "Create a cloud database on Neon", [
          "Your laptop database only works on your computer. The live website needs a cloud database.",
          "Do this in your web browser:",
          "1. Go to https://neon.tech and sign up (free)",
          "2. Click Create a project",
          "3. Project name: btimely",
          "4. Pick a region close to you (e.g. US East)",
          "5. Click Create project",
          '6. On the dashboard, find "Connection string" and click Copy',
          "7. It looks like: postgresql://username:password@ep-xxxx.neon.tech/neondb?sslmode=require",
          "8. Paste it into Apple Notes or a text file — you will need it in Steps 4 and 5",
        ]),

        ...numberedStep(4, "Prepare your project for the cloud database", [
          "Back in Terminal. Again, run each command ONE AT A TIME:",
        ]),

        ...terminalCommand(
          "Command F — Install database packages",
          "npm install @prisma/adapter-pg pg",
          "A progress bar, then it returns to the prompt."
        ),

        ...terminalCommand(
          "Command G — Install type definitions",
          "npm install -D @types/pg",
          "Same as above — wait for it to finish."
        ),

        body("Now edit two files in Cursor (your code editor):"),
        body("FILE 1 — Open prisma/schema.prisma. Find the datasource block and make it look exactly like this:"),
        codeBlock(["datasource db {", '  provider = "postgresql"', "}"]),
        body("Save the file (Command + S)."),
        body("FILE 2 — Open .env on your Desktop in the BTimely folder. Replace the DATABASE_URL line with your Neon connection string from Step 3:"),
        codeBlock([
          'DATABASE_URL="postgresql://username:password@ep-xxxx.neon.tech/neondb?sslmode=require"',
          'OPENAI_API_KEY="sk-proj-your-existing-key-here"',
        ]),
        body("Keep your real OpenAI key. Only change DATABASE_URL. Save the file."),

        ...terminalCommand(
          "Command H — Regenerate the database client",
          "npx prisma generate",
          'A green checkmark and "Generated Prisma Client".'
        ),

        ...terminalCommand(
          "Command I — Create tables in your cloud database",
          "npm run db:push",
          '"Your database is now in sync."'
        ),

        body("Optional quick test — run npm run dev, open http://localhost:3000/app, submit a task. If it works, press Ctrl + C in Terminal to stop the server."),

        ...numberedStep(5, "Deploy on Vercel (get your live link)", [
          "Do this in your web browser:",
          "1. Go to https://vercel.com",
          '2. Click Sign Up → choose "Continue with GitHub"',
          "3. Authorize Vercel to access your GitHub",
          '4. Click Add New… → Project',
          `5. Find ${REPO_NAME} in the list and click Import`,
          "6. Vercel detects Next.js automatically — leave all default settings",
          "7. BEFORE clicking Deploy, find Environment Variables and add these TWO rows:",
        ]),

        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  shading: { fill: "E8F4FC", type: ShadingType.CLEAR },
                  children: [new Paragraph({ children: [new TextRun({ text: "Name (type exactly)", bold: true })] })],
                }),
                new TableCell({
                  shading: { fill: "E8F4FC", type: ShadingType.CLEAR },
                  children: [new Paragraph({ children: [new TextRun({ text: "Value (paste from)", bold: true })] })],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph("DATABASE_URL")] }),
                new TableCell({ children: [new Paragraph("Your Neon connection string (Step 3)")] }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph("OPENAI_API_KEY")] }),
                new TableCell({ children: [new Paragraph("Your OpenAI key from .env file")] }),
              ],
            }),
          ],
        }),

        body("8. Click the Deploy button"),
        body("9. Wait 2–4 minutes while Vercel builds your site"),
        body('10. When you see "Congratulations!", click the Visit button'),
        body("Your live URL will look something like: https://btimely.vercel.app (yours may have extra words in the middle — that is fine)"),

        ...numberedStep(6, "Test your live website", [
          "Open your Vercel URL in a browser (NOT localhost). Check each item:",
        ]),
        bullet("[ ] Landing page loads with the BTimely logo"),
        bullet('[ ] Click "Get started free" - the /app dashboard opens'),
        bullet("[ ] Type a task and click Get estimate - you get a time estimate"),
        bullet("[ ] Click Mark complete, enter actual time, click Submit"),
        bullet("[ ] Click the Completed tab - your task appears there"),
        bullet("[ ] Refresh the page - your task is still there"),

        ...numberedStep(7, "Optional — custom domain", [
          "Skip this unless you bought a domain name (e.g. btimely.com).",
          "1. In Vercel → your btimely project → Settings → Domains",
          "2. Type your domain and click Add",
          "3. Follow Vercel's instructions to update DNS at your domain registrar",
          "4. Wait 10–60 minutes for it to go live",
        ]),

        heading("Updating Your Site After You Make Changes"),
        body("Whenever you change BTimely on your Mac and want the live site updated, run these in Terminal ONE AT A TIME:"),
        ...terminalCommand("Go to project folder", "cd ~/Desktop/BTimely", "Prompt shows BTimely %"),
        ...terminalCommand("Stage changes", "git add .", "Usually silent — that is OK"),
        ...terminalCommand("Save snapshot", 'git commit -m "Describe what you changed"', "Files changed message"),
        ...terminalCommand("Upload to GitHub", "git push", "main -> main"),
        body("Vercel automatically redeploys in 2–3 minutes. No extra steps needed."),

        heading("Your Personal Command Cheat Sheet"),
        body("Copy this page to your Notes app for quick reference:"),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  shading: { fill: "E8F4FC", type: ShadingType.CLEAR },
                  children: [new Paragraph({ children: [new TextRun({ text: "#", bold: true })] })],
                }),
                new TableCell({
                  shading: { fill: "E8F4FC", type: ShadingType.CLEAR },
                  children: [new Paragraph({ children: [new TextRun({ text: "What it does", bold: true })] })],
                }),
                new TableCell({
                  shading: { fill: "E8F4FC", type: ShadingType.CLEAR },
                  children: [new Paragraph({ children: [new TextRun({ text: "Command", bold: true })] })],
                }),
              ],
            }),
            ...[
              ["—", "Go to project", "cd ~/Desktop/BTimely"],
              ["A", "Stage files", "git add ."],
              ["B", "Commit", 'git commit -m "Initial BTimely release"'],
              ["C", "Branch name", "git branch -M main"],
              ["D", "Link GitHub", `git remote add origin https://github.com/${GITHUB_USER}/${REPO_NAME}.git`],
              ["E", "Upload", "git push -u origin main"],
              ["F", "Install DB packages", "npm install @prisma/adapter-pg pg"],
              ["G", "Install types", "npm install -D @types/pg"],
              ["H", "Generate Prisma", "npx prisma generate"],
              ["I", "Sync database", "npm run db:push"],
            ].map(
              ([num, desc, cmd]) =>
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph(num)] }),
                    new TableCell({ children: [new Paragraph(desc)] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: cmd, font: "Courier New", size: 18 })] })] }),
                  ],
                })
            ),
          ],
        }),

        heading("Monthly Costs"),
        bullet("Vercel hosting: $0 (free tier)"),
        bullet("Neon database: $0 (free tier)"),
        bullet("OpenAI API: ~$1–5/month depending on usage"),
        bullet("Custom domain (optional): ~$12/year"),

        heading("Troubleshooting"),
        body("git push asks for a password:"),
        bullet("GitHub no longer accepts account passwords in Terminal. A browser window should open for sign-in. If not, search \"GitHub personal access token\" and create one."),
        body('git commit says "Author identity unknown":'),
        bullet('Run: git config user.name "Brigham" and git config user.email "your@email.com" then try again.'),
        body('Command D says "remote origin already exists":'),
        bullet(`Run: git remote set-url origin https://github.com/${GITHUB_USER}/${REPO_NAME}.git`),
        body("Vercel build failed:"),
        bullet("Open the failed deployment in Vercel → View Build Logs. Make sure npm run build works on your Mac first."),
        body("Live site loads but estimates fail:"),
        bullet("Check OPENAI_API_KEY in Vercel → Settings → Environment Variables. Click Redeploy after fixing."),
        body("Tasks don't save on live site:"),
        bullet("Check DATABASE_URL on Vercel matches your Neon string exactly, including ?sslmode=require at the end."),

        heading("Security Reminders"),
        bullet("NEVER upload your .env file to GitHub (it contains your API key)"),
        bullet("NEVER post API keys in chat, screenshots, or social media"),
        bullet("Set a spending limit on your OpenAI account at platform.openai.com"),

        new Paragraph({ spacing: { before: 400 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: `© BTimely — GitHub: ${GITHUB_USER}/${REPO_NAME}`,
              size: 20,
              color: "5A7A94",
              italics: true,
            }),
          ],
        }),
      ],
    },
  ],
});

const buffer = await Packer.toBuffer(doc);
fs.writeFileSync(outputPath, buffer);
console.log(`Created: ${outputPath}`);
