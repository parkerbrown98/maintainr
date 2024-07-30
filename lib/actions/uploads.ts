"use server";

import { uploads } from "@/drizzle/schema";
import { db } from "../db";
import fs from "fs";
import { writeFile } from "fs/promises";
import path from "path";
import { validateUser } from "../auth";
import { and, eq } from "drizzle-orm";

export async function saveFileToDisk(fileName: string, file: File) {
  const saveDir = path.join(process.cwd(), "uploads");
  const filePath = path.join(saveDir, fileName);

  if (!fs.existsSync(saveDir)) {
    fs.mkdirSync(saveDir);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return path.join("/uploads", fileName);
}

export async function createUpload(form: FormData) {
  const userObj = await validateUser();
  if (!userObj) {
    return { error: "User not found" };
  }

  if (!form.has("file")) {
    return { error: "No file found" };
  }

  const file = form.get("file") as File | null;
  if (!file) {
    return { error: "No file found" };
  }

  let fileName = file.name.replaceAll(" ", "_");

  // Insert a random string to avoid overwriting files with the same name
  const randomString = Math.random().toString(36).substring(7);
  fileName = `${randomString}_${fileName}`;

  const filePath = await saveFileToDisk(fileName, file);

  await db.insert(uploads).values({
    fileName,
    mimeType: file.type,
    userId: userObj.user.id,
    size: file.size,
    url: filePath,
  });
}

export async function deleteUpload(id: string) {
  const userObj = await validateUser();
  if (!userObj) {
    return { error: "User not found" };
  }

  const [upload] = await db
    .select()
    .from(uploads)
    .where(and(eq(uploads.id, id), eq(uploads.userId, userObj.user.id)))
    .limit(1);

  if (!upload) {
    return { error: "Upload not found" };
  }

  try {
    fs.unlinkSync(path.join(process.cwd(), upload.url));
  } catch (err) {
    return { error: "Failed to delete file from filesystem" };
  }

  const result = await db
    .delete(uploads)
    .where(and(eq(uploads.id, id), eq(uploads.userId, userObj.user.id)));

  return null;
}
