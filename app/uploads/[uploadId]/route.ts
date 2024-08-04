import fs from "fs/promises";
import path from "path";
import { uploads } from "@/drizzle/schema";
import { validateUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import sharp from "sharp";

export async function GET(request: Request, context: any) {
  const session = await validateUser();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { params } = context;
  if (!params.uploadId) {
    return NextResponse.json({ error: "Missing upload ID" }, { status: 400 });
  }

  const [upload] = await db
    .select()
    .from(uploads)
    .where(
      and(
        eq(uploads.fileName, params.uploadId),
        eq(uploads.userId, session.user.id)
      )
    )
    .limit(1);

  if (!upload) {
    return NextResponse.json({ error: "Upload not found" }, { status: 404 });
  }

  const fullUrl = path.join(process.cwd(), upload.url);

  const stat = await fs.stat(fullUrl);
  if (!stat.isFile()) {
    return NextResponse.json({ error: "Upload not found" }, { status: 404 });
  }

  let fileContent = await fs.readFile(fullUrl);

  const { searchParams } = new URL(request.url);
  const sharpImage = sharp(fileContent);

  if (searchParams.has("w")) {
    if (!searchParams.has("h")) {
      const width = parseInt(searchParams.get("w")!);
      sharpImage.resize(width);
    } else {
      const width = parseInt(searchParams.get("w")!);
      const height = parseInt(searchParams.get("h")!);
      sharpImage.resize(width, height);
    }
  }

  sharpImage.webp({
    quality: searchParams.has("q") ? parseInt(searchParams.get("q")!) : 75,
  });
  fileContent = await sharpImage.toBuffer();

  if (searchParams.has("download", "true")) {
    return new Response(fileContent, {
      headers: {
        "Content-Type": upload.mimeType,
        "Content-Length": fileContent.byteLength.toString(),
        "Content-Disposition": `attachment; filename="${upload.fileName}"`,
      },
    });
  }

  return new Response(fileContent, {
    headers: {
      "Content-Type": upload.mimeType,
      "Content-Length": fileContent.byteLength.toString(),
    },
  });
}
