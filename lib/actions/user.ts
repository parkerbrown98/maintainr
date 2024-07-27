"use server";

import { users } from "@/drizzle/schema";
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

  await db.update(users).set({ email }).where(eq(users.id, user.user.id));

  return null;
}
