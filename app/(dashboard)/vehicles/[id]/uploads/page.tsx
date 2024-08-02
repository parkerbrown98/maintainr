import { Button } from "@/components/ui/button";
import { UploadCard } from "@/components/upload-card";
import { uploads } from "@/drizzle/schema";
import { db } from "@/lib/db";
import convert from "convert";
import { eq } from "drizzle-orm";
import { Download, Trash2 } from "lucide-react";
import Link from "next/link";

interface VehicleUploadsProps {
  params: {
    id: string;
  };
}

export default async function VehicleUploads({ params }: VehicleUploadsProps) {
  const { id } = params;
  const uploadRows = await db
    .select()
    .from(uploads)
    .where(eq(uploads.vehicleId, id));

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <h2 className="text-2xl font-semibold">All Uploads</h2>
      <div className="grid grid-cols-1 gap-4 lg:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {uploadRows.map((upload) => (
          <UploadCard key={upload.id} upload={upload} />
        ))}
      </div>
    </div>
  );
}
