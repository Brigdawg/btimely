import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseCategoryCalibrations } from "@/lib/personalization";

export async function GET(request: NextRequest) {
  const userId = request.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  const profile = await prisma.userProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const [pending, completed, recentCompleted] = await Promise.all([
    prisma.task.count({ where: { userId, status: { not: "completed" } } }),
    prisma.task.count({ where: { userId, status: "completed" } }),
    prisma.task.findMany({
      where: { userId, actualMinutes: { not: null } },
      orderBy: { completedAt: "desc" },
      take: 5,
      select: {
        title: true,
        estimatedMinutes: true,
        actualMinutes: true,
        category: true,
      },
    }),
  ]);

  const totalEstimated = recentCompleted.reduce((s, t) => s + t.estimatedMinutes, 0);
  const totalActual = recentCompleted.reduce((s, t) => s + (t.actualMinutes ?? 0), 0);

  return NextResponse.json({
    profile: {
      globalCalibration: profile.globalCalibration,
      categoryCalibrations: parseCategoryCalibrations(profile.categoryCalibrations),
      totalTasksCompleted: profile.totalTasksCompleted,
      avgAccuracy: profile.avgAccuracy,
    },
    counts: { pending, completed },
    recentTrend:
      totalActual > 0 ? Math.round((totalEstimated / totalActual) * 100) : null,
  });
}
