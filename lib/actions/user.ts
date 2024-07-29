"use server";

import {
  userPreferences,
  UserPreferencesInsert,
  users,
} from "@/drizzle/schema";
import { db } from "../db";
import { validateUser } from "../auth";
import { eq } from "drizzle-orm";
import argon2 from "argon2";

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

export async function editPassword(oldPassword: string, newPassword: string) {
  const user = await validateUser();
  if (!user || !user.user) {
    return { error: "User not found" };
  }

  if (newPassword.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  const [userRecord] = await db
    .select()
    .from(users)
    .where(eq(users.id, user.user.id))
    .limit(1);

  if (!userRecord) {
    return { error: "User not found" };
  }

  if (!(await argon2.verify(userRecord.password, oldPassword))) {
    return { error: "Invalid password" };
  }

  const password = await argon2.hash(newPassword);
  await db.update(users).set({ password }).where(eq(users.id, user.user.id));

  return null;
}
