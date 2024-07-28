"use server";

import {
  userPreferences,
  UserPreferencesInsert,
  users,
} from "@/drizzle/schema";
import { db } from "../db";
import { validateUser } from "../auth";
import { eq } from "drizzle-orm";

export async function editUserName(firstName: string, lastName: string) {
  if (!firstName || !lastName) {
    return { error: "First name and last name are required" };
  }

  const user = await validateUser();
  if (!user || !user.user) {
    return { error: "User not found" };
  }

  await db
    .update(users)
    .set({ firstName, lastName })
    .where(eq(users.id, user.user.id));

  return null;
}

export async function editEmail(email: string) {
  if (!email) {
    return { error: "Email is required" };
  }

  const user = await validateUser();
  if (!user || !user.user) {
    return { error: "User not found" };
  }

  if (/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(email) === false) {
    return { error: "Invalid email address" };
  }

  await db.update(users).set({ email }).where(eq(users.id, user.user.id));

  return null;
}

export async function editPreferences(
  preferences: Omit<UserPreferencesInsert, "userId">
) {
  const user = await validateUser();
  if (!user || !user.user) {
    return { error: "User not found" };
  }

  await db
    .update(userPreferences)
    .set(preferences)
    .where(eq(userPreferences.userId, user.user.id));

  return null;
}
