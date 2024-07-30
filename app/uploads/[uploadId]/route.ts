import fs from "fs/promises";
import path from "path";
import { uploads } from "@/drizzle/schema";
import { validateUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

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
  const fileContent = await fs.readFile(fullUrl);

  const { searchParams } = new URL(request.url);
  if (searchParams.has("download", "true")) {
    return new Response(fileContent, {
      headers: {
        "Content-Type": upload.mimeType,
        "Content-Length": stat.size.toString(),
        "Content-Disposition": `attachment; filename="${upload.fileName}"`,
      },
    });
  }

  return new Response(fileContent, {
    headers: {
      "Content-Type": upload.mimeType,
      "Content-Length": stat.size.toString(),
    },
  });
}
