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
const outputPath = path.join(__dirname, "..", "BTimely-Getting-Started.docx");

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
  return new Paragraph({
    text,
    bullet: { level },
    spacing: { after: 80 },
  });
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
    if (typeof d === "string") {
      paragraphs.push(body(d));
    } else if (Array.isArray(d)) {
      paragraphs.push(
        new Paragraph({
          spacing: { after: 80 },
          children: d,
        })
      );
    } else {
      paragraphs.push(d);
    }
  }

  return paragraphs;
}

function codeBlock(lines) {
  return new Paragraph({
    spacing: { before: 100, after: 150 },
    shading: { type: ShadingType.CLEAR, fill: "F3F0FF" },
    border: {
      top: { style: BorderStyle.SINGLE, size: 1, color: "E8E5F0" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "E8E5F0" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "E8E5F0" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "E8E5F0" },
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

const doc = new Document({
  creator: "BTimely",
  title: "BTimely — Getting Started Guide",
  description: "Step-by-step instructions to run BTimely locally",
  styles: {
    default: {
      document: {
        run: { font: "Calibri", size: 22 },
      },
    },
  },
  sections: [
    {
      properties: {},
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [
            new TextRun({ text: "BTimely", bold: true, size: 52, color: "5B4CDB" }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          children: [
            new TextRun({
              text: "Getting Started Guide",
              size: 32,
              color: "6B6578",
            }),
          ],
        }),
        body(
          "This guide walks you through setting up and running BTimely on your computer. Follow each step in order. The whole process takes about 10–15 minutes the first time."
        ),
        body(
          "BTimely is a time management app that uses AI to estimate how long tasks will take — and learns from your feedback to get more accurate over time."
        ),

        heading("What You Will Need"),
        bullet("A Mac or Windows computer"),
        bullet("An internet connection (for installing packages)"),
        bullet("Node.js version 18 or newer (see Step 1 if you are not sure)"),
        bullet("The BTimely project folder on your Desktop"),
        bullet("Optional: an OpenAI API key for real AI estimates (demo mode works without one)"),

        heading("Step-by-Step Setup"),

        ...numberedStep(1, "Check that Node.js is installed", [
          "Node.js is the software that runs BTimely on your computer.",
          "Open Terminal (Mac) or Command Prompt (Windows) and type:",
        ]),
        codeBlock(["node --version"]),
        body("You should see something like v20.x.x or v22.x.x. If you get an error, download Node.js from:"),
        body("https://nodejs.org  (choose the LTS version, then install it and restart Terminal)"),

        ...numberedStep(2, "Open Terminal in the BTimely folder", [
          "On Mac:",
          [
            new TextRun({ text: "1. Open the ", size: 22 }),
            new TextRun({ text: "Terminal", size: 22, bold: true }),
            new TextRun({ text: " app", size: 22 }),
          ],
          bullet("2. Type: cd ~/Desktop/BTimely", 0),
          bullet("3. Press Enter", 0),
          "On Windows:",
          bullet('1. Open Command Prompt or PowerShell', 0),
          bullet("2. Type: cd Desktop\\BTimely", 0),
          bullet("3. Press Enter", 0),
        ]),

        ...numberedStep(3, "Install project dependencies", [
          "This downloads all the code libraries BTimely needs. Run this command:",
        ]),
        codeBlock(["npm install"]),
        body("Wait for it to finish. This may take 1–2 minutes. You will see a progress bar and then return to the command prompt when done."),

        ...numberedStep(4, "Set up your environment file", [
          "BTimely needs a small configuration file to run. Copy the example file by running:",
        ]),
        codeBlock(["cp .env.example .env"]),
        body('On Windows, use this command instead:'),
        codeBlock(["copy .env.example .env"]),
        body("This creates a file called .env in your project folder. You can open it in any text editor (TextEdit, Notepad, VS Code, etc.)."),

        heading("Optional: Add Your OpenAI API Key", HeadingLevel.HEADING_2),
        body(
          "BTimely works in demo mode without an API key, but estimates will be basic. For real AI-powered estimates:"
        ),
        bullet("1. Go to https://platform.openai.com/api-keys"),
        bullet("2. Create an account and generate a new API key"),
        bullet("3. Open the .env file in your project folder"),
        bullet('4. Find the line that says OPENAI_API_KEY=""'),
        bullet('5. Paste your key between the quotes, like: OPENAI_API_KEY="sk-your-key-here"'),
        bullet("6. Save the file"),
        body("Note: OpenAI charges a very small amount per estimate (less than a penny). Demo mode is free and fine for testing."),

        ...numberedStep(5, "Initialize the database", [
          "BTimely stores your tasks and learning data in a local database. Set it up by running:",
        ]),
        codeBlock(["npm run db:push"]),
        body('You should see a message like "Your database is now in sync." A file called dev.db will be created inside the prisma folder.'),

        ...numberedStep(6, "Start the app", [
          "Run the development server with:",
        ]),
        codeBlock(["npm run dev"]),
        body("Keep this Terminal window open while using the app. You should see:"),
        codeBlock(["▲ Next.js", "- Local: http://localhost:3000"]),
        body("The app is now running on your computer."),

        heading("Using BTimely"),
        body("Open your web browser (Chrome, Safari, Firefox, etc.) and go to one of these addresses:"),

        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 35, type: WidthType.PERCENTAGE },
                  shading: { fill: "F3F0FF", type: ShadingType.CLEAR },
                  children: [new Paragraph({ children: [new TextRun({ text: "Page", bold: true })] })],
                }),
                new TableCell({
                  width: { size: 35, type: WidthType.PERCENTAGE },
                  shading: { fill: "F3F0FF", type: ShadingType.CLEAR },
                  children: [new Paragraph({ children: [new TextRun({ text: "Address", bold: true })] })],
                }),
                new TableCell({
                  width: { size: 30, type: WidthType.PERCENTAGE },
                  shading: { fill: "F3F0FF", type: ShadingType.CLEAR },
                  children: [new Paragraph({ children: [new TextRun({ text: "What it is", bold: true })] })],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph("Landing page")] }),
                new TableCell({ children: [new Paragraph("http://localhost:3000")] }),
                new TableCell({ children: [new Paragraph("Marketing homepage")] }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph("Main app")] }),
                new TableCell({ children: [new Paragraph("http://localhost:3000/app")] }),
                new TableCell({ children: [new Paragraph("Where you use BTimely")] }),
              ],
            }),
          ],
        }),

        heading("Test the Full App Loop", HeadingLevel.HEADING_2),
        body("Try this to make sure everything works:"),
        bullet("1. Go to http://localhost:3000/app"),
        bullet('2. Type a task in the text box, for example: "Write a 5-page essay on climate change"'),
        bullet('3. Click "Get estimate" — you will see a time estimate with reasoning'),
        bullet('4. Click "Start task" when you begin working'),
        bullet('5. Click "Mark complete" and enter how long it actually took you'),
        bullet("6. Submit another similar task — notice the estimate may adjust based on your feedback"),

        heading("Stopping the App"),
        body("When you are done, go back to the Terminal window where the app is running and press:"),
        codeBlock(["Ctrl + C"]),
        body("This stops the server. Run npm run dev again anytime you want to use the app."),

        heading("Quick Reference — All Commands"),
        body("Copy and paste these commands one at a time from your BTimely folder:"),
        codeBlock([
          "npm install",
          "cp .env.example .env",
          "npm run db:push",
          "npm run dev",
        ]),

        heading("Troubleshooting"),
        body("Port already in use:"),
        bullet('If you see "Port 3000 is already in use," another copy of the app may be running. Close other Terminal windows or run: npm run dev -- -p 3001 and open http://localhost:3001/app instead.'),

        body("npm: command not found:"),
        bullet("Node.js is not installed. Go back to Step 1 and install it from nodejs.org."),

        body("Database errors:"),
        bullet("Run npm run db:push again. If that fails, delete the prisma/dev.db file and run npm run db:push once more."),

        body("Estimates seem generic:"),
        bullet("You are in demo mode. Add your OPENAI_API_KEY to the .env file, save it, stop the server (Ctrl+C), and run npm run dev again."),

        heading("What Is Next?"),
        body("Once BTimely is running locally, you can:"),
        bullet("Customize the app and test features"),
        bullet("Add your OpenAI API key for real AI estimates"),
        bullet("Read LAUNCH_GUIDE.md in the project folder for deploying to the web"),
        bullet("Read BUSINESS_PLAN.md for pricing and monetization ideas"),

        new Paragraph({ spacing: { before: 400 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: "© BTimely — Time estimates that get better with you.",
              size: 20,
              color: "6B6578",
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
