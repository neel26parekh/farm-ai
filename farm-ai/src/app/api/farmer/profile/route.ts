import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const [profile, settings, user] = await Promise.all([
    prisma.farmProfile.findUnique({ where: { userId } }),
    prisma.settings.findUnique({ where: { userId } }),
    prisma.user.findUnique({ where: { id: userId }, select: { name: true } }),
  ]);

  return NextResponse.json({
    fullName: user?.name || "",
    location: profile?.location || "",
    farmSize: profile?.farmSize ? String(profile.farmSize) : "",
    primaryCrop: profile?.primaryCrop || "",
    soilType: profile?.soilType || "",
    language: "English",
    pushNotifications: settings?.pushNotifications ?? true,
    smsAlerts: settings?.smsAlerts ?? false,
    aiDataConsent: settings?.mlTrainingConsent ?? true,
    currency: settings?.marketCurrency || "INR",
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const body = await req.json();

  const fullName = String(body.fullName || "").trim();
  const location = String(body.location || "").trim();
  const farmSizeRaw = String(body.farmSize || "").trim();
  const primaryCrop = String(body.primaryCrop || "").trim();
  const soilType = String(body.irrigationType || body.soilType || "").trim();
  const pushNotifications = Boolean(body.pushNotifications);
  const smsAlerts = Boolean(body.smsAlerts);
  const aiDataConsent = Boolean(body.aiDataConsent);
  const currency = String(body.currency || "INR").toUpperCase();

  const farmSize = Number(farmSizeRaw);
  const safeFarmSize = Number.isFinite(farmSize) ? farmSize : null;

  await Promise.all([
    prisma.user.update({
      where: { id: userId },
      data: {
        name: fullName || undefined,
      },
    }),
    prisma.farmProfile.upsert({
      where: { userId },
      create: {
        userId,
        location: location || null,
        farmSize: safeFarmSize,
        primaryCrop: primaryCrop || null,
        soilType: soilType || null,
      },
      update: {
        location: location || null,
        farmSize: safeFarmSize,
        primaryCrop: primaryCrop || null,
        soilType: soilType || null,
      },
    }),
    prisma.settings.upsert({
      where: { userId },
      create: {
        userId,
        pushNotifications,
        smsAlerts,
        mlTrainingConsent: aiDataConsent,
        marketCurrency: currency || "INR",
      },
      update: {
        pushNotifications,
        smsAlerts,
        mlTrainingConsent: aiDataConsent,
        marketCurrency: currency || "INR",
      },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
