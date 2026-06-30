import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const displayName = typeof body.displayName === "string" ? body.displayName : null;

  const user = await prisma.user.create({
    data: {
      displayName,
      profile: { create: {} },
    },
    include: { profile: true },
  });

  return NextResponse.json({ userId: user.id, displayName: user.displayName });
}

export async function GET(request: NextRequest) {
  const userId = request.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    userId: user.id,
    displayName: user.displayName,
    profile: user.profile,
  });
}

export async function PATCH(request: NextRequest) {
  const userId = request.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const displayName =
    typeof body.displayName === "string" ? body.displayName.trim() : undefined;

  const user = await prisma.user.update({
    where: { id: userId },
    data: displayName !== undefined ? { displayName: displayName || null } : {},
  });

  return NextResponse.json({ userId: user.id, displayName: user.displayName });
}
