"use server";

import { UserInsert, userPreferences, users } from "@/drizzle/schema";
import { lucia, validateUser } from "../auth";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import argon2 from "argon2";

export async function signUp(user: UserInsert) {
  const email = user.email;
  const password = user.password;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  // Regex to validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Invalid email address" };
  }

  // Password must be at least 8 characters
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  // Check if email is already in use
  const existingUser = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email));
  if (existingUser.length > 0) {
    return { error: "Email is already in use" };
  }

  // Hash the password using crypto library
  const hashedPassword = await argon2.hash(password);

  // Insert the user into the database
  const newUser = await db
    .insert(users)
    .values({ ...user, password: hashedPassword })
    .returning();

  // Insert preferences for the user
  await db.insert(userPreferences).values({ userId: newUser[0].id });

  const session = await lucia.createSession(newUser[0].id, {
    email: newUser[0].email,
    userId: newUser[0].id,
  });
  const cookie = lucia.createSessionCookie(session.id);
  cookies().set(cookie.name, cookie.value, cookie.attributes);

  return null;
}

export async function login(email: string, password: string) {
  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const user = await db.select().from(users).where(eq(users.email, email));

  if (user.length === 0) {
    return { error: "Invalid email or password" };
  }

  const isValid = await argon2.verify(user[0].password, password);
  if (!isValid) {
    return { error: "Invalid email or password" };
  }

  const session = await lucia.createSession(user[0].id, {
    email: user[0].email,
    userId: user[0].id,
  });
  const cookie = lucia.createSessionCookie(session.id);
  cookies().set(cookie.name, cookie.value, cookie.attributes);

  return null;
}

export async function logOut() {
  const session = await validateUser();
  if (!session) {
    return { error: "Not authenticated" };
  }

  await lucia.invalidateSession(session.session!.id);

  const blankCookie = lucia.createBlankSessionCookie();
  cookies().set(blankCookie.name, blankCookie.value, blankCookie.attributes);
}
