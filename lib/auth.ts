import { Lucia } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "./db";
import { users, sessions, userPreferences } from "@/drizzle/schema";
import { cache } from "react";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.HTTPS === "true",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
      id: attributes.id,
      firstName: attributes.firstName,
      lastName: attributes.lastName,
      selectedVehicleId: attributes.selectedVehicleId,
    };
  },
});

export const validateUser = cache(async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) return null;

  // Automatically fetches the user from the database
  const result = await lucia.validateSession(sessionId);
  if (!result || !result.user || !result.session) return null;

  let [preferences] = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, result.user.id));

  // Create user preferences if they don't exist
  if (!preferences) {
    preferences = (
      await db
        .insert(userPreferences)
        .values({ userId: result.user.id })
        .returning()
    )[0];
  }

  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
  } catch {}

  return { user: result.user, session: result.session, preferences };
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

export interface DatabaseUserAttributes {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
  selectedVehicleId: string;
}
