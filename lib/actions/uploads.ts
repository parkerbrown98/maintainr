"use server";

import { uploads } from "@/drizzle/schema";
import { db } from "../db";
import fs from "fs";
import { writeFile } from "fs/promises";
import path from "path";
import { validateUser } from "../auth";

export async function saveFileToDisk(file: File) {
  const saveDir = path.join(process.cwd(), "uploads");
  const fileName = file.name.replaceAll(" ", "_");
  const filePath = path.join(saveDir, fileName);

  if (!fs.existsSync(saveDir)) {
    fs.mkdirSync(saveDir);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return filePath;
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

  const filePath = await saveFileToDisk(file);

  await db.insert(uploads).values({
    fileName: file.name,
    mimeType: file.type,
    userId: userObj.user.id,
    size: file.size,
    url: filePath,
  });
}

export async function deleteUpload(id: string) {}
