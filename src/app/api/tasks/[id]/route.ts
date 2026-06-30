import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  computeAccuracy,
  parseCategoryCalibrations,
  updateCalibrations,
} from "@/lib/personalization";
import type { TaskCategory } from "@/lib/types";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = request.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  const { id } = await params;
  const body = await request.json();

  const task = await prisma.task.findFirst({
    where: { id, userId },
  });

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  if (body.status === "in_progress") {
    const updated = await prisma.task.update({
      where: { id },
      data: { status: "in_progress" },
    });
    return NextResponse.json({ task: updated });
  }

  if (typeof body.actualMinutes === "number" && body.actualMinutes > 0) {
    const actualMinutes = Math.round(body.actualMinutes);

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        actualMinutes,
        status: "completed",
        completedAt: new Date(),
      },
    });

    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (profile) {
      const categoryMultipliers = parseCategoryCalibrations(
        profile.categoryCalibrations
      );

      const { globalMultiplier, categoryMultipliers: newCategories } =
        updateCalibrations(
          profile.globalCalibration,
          categoryMultipliers,
          task.category as TaskCategory,
          task.estimatedMinutes,
          actualMinutes
        );

      const completedTasks = await prisma.task.findMany({
        where: { userId, actualMinutes: { not: null } },
        select: { estimatedMinutes: true, actualMinutes: true },
        orderBy: { completedAt: "desc" },
        take: 20,
      });

      const avgAccuracy = computeAccuracy(
        completedTasks.map((t) => ({
          estimatedMinutes: t.estimatedMinutes,
          actualMinutes: t.actualMinutes!,
        }))
      );

      await prisma.userProfile.update({
        where: { userId },
        data: {
          globalCalibration: globalMultiplier,
          categoryCalibrations: JSON.stringify(newCategories),
          totalTasksCompleted: profile.totalTasksCompleted + 1,
          avgAccuracy,
        },
      });

      return NextResponse.json({
        task: updatedTask,
        calibrationUpdated: true,
        newGlobalMultiplier: globalMultiplier,
        newCategoryMultiplier: newCategories[task.category],
      });
    }

    return NextResponse.json({ task: updatedTask });
  }

  return NextResponse.json({ error: "Invalid update" }, { status: 400 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = request.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  const { id } = await params;

  const task = await prisma.task.findFirst({ where: { id, userId } });
  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
