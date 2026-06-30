import { NextRequest, NextResponse } from "next/server";
import { estimateTaskTime } from "@/lib/ai";
import { prisma } from "@/lib/db";
import {
  applyPersonalization,
  buildRecentPatterns,
  parseCategoryCalibrations,
} from "@/lib/personalization";
import type { TaskCategory } from "@/lib/types";

export async function POST(request: NextRequest) {
  const userId = request.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  if (!user?.profile) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const formData = await request.formData();
  const description = (formData.get("description") as string)?.trim() || "";
  const file = formData.get("file") as File | null;

  if (!description && !file) {
    return NextResponse.json(
      { error: "Please describe your task or upload a file" },
      { status: 400 }
    );
  }

  let fileContent: string | null = null;
  let fileName: string | null = null;

  if (file && file.size > 0) {
    fileName = file.name;
    const text = await file.text();
    fileContent = text.slice(0, 8000);
  }

  const recentTasks = await prisma.task.findMany({
    where: { userId, actualMinutes: { not: null } },
    orderBy: { completedAt: "desc" },
    take: 8,
    select: {
      category: true,
      estimatedMinutes: true,
      actualMinutes: true,
      title: true,
    },
  });

  const categoryMultipliers = parseCategoryCalibrations(
    user.profile.categoryCalibrations
  );

  const calibration = {
    globalMultiplier: user.profile.globalCalibration,
    categoryMultipliers,
    totalCompleted: user.profile.totalTasksCompleted,
    avgAccuracy: user.profile.avgAccuracy,
    recentPatterns: buildRecentPatterns(recentTasks),
  };

  const aiEstimate = await estimateTaskTime(
    description || `Analyze this uploaded file: ${fileName}`,
    fileContent,
    calibration
  );

  const personalizedMinutes = applyPersonalization(
    aiEstimate.estimatedMinutes,
    aiEstimate.category,
    user.profile.globalCalibration,
    categoryMultipliers
  );

  const task = await prisma.task.create({
    data: {
      userId,
      title: aiEstimate.title,
      description: description || fileContent?.slice(0, 500) || fileName || "",
      category: aiEstimate.category,
      complexity: aiEstimate.complexity,
      estimatedMinutes: personalizedMinutes,
      rawEstimatedMinutes: aiEstimate.estimatedMinutes,
      aiReasoning: aiEstimate.reasoning,
      fileName,
      status: "pending",
    },
  });

  return NextResponse.json({
    task,
    breakdown: aiEstimate.breakdown,
    personalized: personalizedMinutes !== aiEstimate.estimatedMinutes,
    baseEstimate: aiEstimate.estimatedMinutes,
  });
}
