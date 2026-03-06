"use server";

import { auth } from "@/lib/auth";
import { prisma } from "./prisma";
import type { ActionResult } from "@/lib/errors";

const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === "true";

interface ProfileData {
  birthYear: number | null;
  birthMonth: number | null;
  birthDay: number | null;
  birthHour: number | null;
  birthMinute: number | null;
  gender: string | null;
  calendarType: string;
}

export async function getProfile(): Promise<ActionResult<ProfileData | null>> {
  if (isTestMode) {
    return { success: true, data: null };
  }
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated", errorType: "auth_required" };
  }

  const profile = await prisma.userProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    return { success: true, data: null };
  }

  return {
    success: true,
    data: {
      birthYear: profile.birthYear,
      birthMonth: profile.birthMonth,
      birthDay: profile.birthDay,
      birthHour: profile.birthHour,
      birthMinute: profile.birthMinute,
      gender: profile.gender,
      calendarType: profile.calendarType,
    },
  };
}

export async function saveProfile(data: ProfileData): Promise<ActionResult<ProfileData>> {
  if (isTestMode) {
    return { success: true, data };
  }
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated", errorType: "auth_required" };
  }

  const profile = await prisma.userProfile.upsert({
    where: { userId: session.user.id },
    update: {
      birthYear: data.birthYear,
      birthMonth: data.birthMonth,
      birthDay: data.birthDay,
      birthHour: data.birthHour,
      birthMinute: data.birthMinute,
      gender: data.gender,
      calendarType: data.calendarType,
    },
    create: {
      userId: session.user.id,
      birthYear: data.birthYear,
      birthMonth: data.birthMonth,
      birthDay: data.birthDay,
      birthHour: data.birthHour,
      birthMinute: data.birthMinute,
      gender: data.gender,
      calendarType: data.calendarType,
    },
  });

  return {
    success: true,
    data: {
      birthYear: profile.birthYear,
      birthMonth: profile.birthMonth,
      birthDay: profile.birthDay,
      birthHour: profile.birthHour,
      birthMinute: profile.birthMinute,
      gender: profile.gender,
      calendarType: profile.calendarType,
    },
  };
}

export async function deleteAccount(): Promise<ActionResult<boolean>> {
  if (isTestMode) {
    return { success: true, data: true };
  }
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated", errorType: "auth_required" };
  }

  try {
    await prisma.user.delete({
      where: { id: session.user.id },
    });
    return { success: true, data: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete account",
      errorType: "server_error",
    };
  }
}
