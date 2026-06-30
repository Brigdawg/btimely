import OpenAI from "openai";
import type { AIEstimate, TaskCategory, UserCalibration } from "./types";

function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey || apiKey.includes("your-openai-key")) return null;
  return new OpenAI({ apiKey });
}

const SYSTEM_PROMPT = `You are BTimely, an expert time estimation assistant. You help students and professionals estimate how long tasks will realistically take.

Rules:
- Be realistic, not optimistic. People underestimate; add appropriate buffer.
- Consider reading, research, drafting, editing, and breaks for longer tasks.
- Break complex tasks into mental steps.
- Return ONLY valid JSON matching the schema.`;

function buildUserContext(calibration: UserCalibration): string {
  const lines = [
    `User completion history: ${calibration.totalCompleted} tasks`,
    `Global speed factor: ${calibration.globalMultiplier.toFixed(2)} (>1 = slower than average, <1 = faster)`,
  ];

  if (calibration.avgAccuracy !== null) {
    lines.push(`Estimate accuracy so far: ${calibration.avgAccuracy}%`);
  }

  const categories = Object.entries(calibration.categoryMultipliers);
  if (categories.length > 0) {
    lines.push(
      "Category speed factors: " +
        categories.map(([k, v]) => `${k}=${v.toFixed(2)}`).join(", ")
    );
  }

  if (calibration.recentPatterns.length > 0) {
    lines.push("Recent actual vs estimated:");
    lines.push(...calibration.recentPatterns.map((p) => `  - ${p}`));
  }

  return lines.join("\n");
}

export async function estimateTaskTime(
  description: string,
  fileContent: string | null,
  calibration: UserCalibration
): Promise<AIEstimate> {
  const fullDescription = fileContent
    ? `${description}\n\n--- Uploaded content ---\n${fileContent.slice(0, 6000)}`
    : description;

  if (!getOpenAIClient()) {
    return mockEstimate(fullDescription);
  }

  const openai = getOpenAIClient()!;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Estimate time for this task.

${buildUserContext(calibration)}

Task description:
${fullDescription}

Respond with JSON:
{
  "title": "short task title",
  "category": "homework|work|personal|reading|project|other",
  "complexity": "low|medium|high",
  "estimatedMinutes": number,
  "reasoning": "2-3 sentence explanation",
  "breakdown": ["step 1 time", "step 2 time", ...]
}`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("No response from AI");

    const parsed = JSON.parse(content) as AIEstimate;
    parsed.estimatedMinutes = Math.max(5, Math.round(parsed.estimatedMinutes / 5) * 5);
    return parsed;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const fallback = mockEstimate(fullDescription);
    if (message.includes("quota") || message.includes("billing")) {
      fallback.reasoning =
        "OpenAI billing is not set up yet (quota exceeded). Using a demo estimate for now. Add a payment method at platform.openai.com/settings/billing";
    } else if (message.includes("401") || message.includes("invalid")) {
      fallback.reasoning =
        "Invalid OpenAI API key. Check your OPENAI_API_KEY in the .env file. Using a demo estimate for now.";
    } else {
      fallback.reasoning = `AI unavailable (${message.slice(0, 80)}). Using a demo estimate.`;
    }
    return fallback;
  }
}

function mockEstimate(description: string): AIEstimate {
  const words = description.split(/\s+/).length;
  const hasEssay = /essay|paper|report|write/i.test(description);
  const hasRead = /read|chapter|pages/i.test(description);
  const hasCode = /code|program|debug|implement/i.test(description);
  const hasMeeting = /meeting|call|presentation/i.test(description);

  let minutes = 30;
  let category: TaskCategory = "other";
  let complexity: "low" | "medium" | "high" = "medium";
  const breakdown: string[] = [];

  if (hasEssay) {
    category = "homework";
    minutes = Math.max(60, Math.min(240, words * 2));
    breakdown.push("Research & outline: 20%", "Drafting: 50%", "Editing: 30%");
  } else if (hasRead) {
    category = "reading";
    const pageMatch = description.match(/(\d+)\s*pages?/i);
    const pages = pageMatch ? parseInt(pageMatch[1]) : 10;
    minutes = pages * 5;
    breakdown.push(`Reading ${pages} pages`, "Note-taking");
  } else if (hasCode) {
    category = "project";
    complexity = "high";
    minutes = 120;
    breakdown.push("Planning", "Implementation", "Testing & debugging");
  } else if (hasMeeting) {
    category = "work";
    minutes = 60;
    breakdown.push("Preparation", "Meeting", "Follow-up notes");
  } else {
    minutes = Math.max(15, Math.min(180, words));
    breakdown.push("Setup", "Main work", "Wrap-up");
  }

  if (minutes > 120) complexity = "high";
  else if (minutes < 45) complexity = "low";

  minutes = Math.round(minutes / 5) * 5;

  return {
    title: description.slice(0, 60).trim() || "New task",
    category,
    complexity,
    estimatedMinutes: minutes,
    reasoning:
      "Demo estimate (add OPENAI_API_KEY for AI-powered estimates). Based on task keywords and length.",
    breakdown,
  };
}
