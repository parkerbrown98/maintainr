"use client";

import { Upload } from "@/drizzle/schema";
import convert from "convert";
import Link from "next/link";
import { Button } from "./ui/button";
import { Download, Trash2, UploadIcon } from "lucide-react";
import { useState } from "react";
import { DeleteUploadDialog } from "./dialogs/delete-upload";
import { NewUploadDialog } from "./dialogs/new-upload";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useVehicle } from "@/lib/hooks/vehicle";
import { addVehicleUpload } from "@/lib/actions/vehicles";

interface UploadCardProps {
  upload: Upload;
}

export function UploadCard({ upload }: UploadCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <>
      <DeleteUploadDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        upload={upload}
      />
      <div className="flex flex-col gap-2 group">
        <Link
          href={upload.url}
          className="relative overflow-hidden w-full h-64 rounded-lg"
        >
          <img
            src={upload.url}
            alt={upload.fileName}
            className="object-cover absolute inset-0 w-full h-full"
          />
        </Link>
        <div className="flex items-center justify-between flex-wrap gap-y-1 gap-x-2">
          <Link href={upload.url} className="flex-1">
            <p className="text-sm font-semibold line-clamp-2">
              {upload.fileName}
            </p>
            {/* <p className="text-sm text-gray-500">
              {moment(upload.createdAt).format("MMM D, YYYY")}
            </p> */}
            <p className="text-sm text-gray-500">
              {convert(upload.size, "bytes").to("MB").toFixed(2)} MB
            </p>
          </Link>
          <div className="flex opacity-0 gap-x-1 flex-shrink-0 group-hover:opacity-100 transition-opacity">
            <Button variant="outline" className="w-8 h-8 p-0" asChild>
              <Link
                href={`${upload.url}?download=true`}
                target="_blank"
                rel="noreferrer"
              >
                <Download className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-8 h-8 p-0"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export function UploadCardSkeleton() {
  const vehicle = useVehicle();
  const router = useRouter();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const handleUpload = async (form: FormData) => {
    if (!vehicle) return;

    setUploadDialogOpen(false);
    toast("Starting upload...", { icon: <UploadIcon className="w-4 h-4" /> });

    try {
      form.set("vehicleId", vehicle.id);
      const result = await addVehicleUpload(form);

      if (result && result.error) {
        throw new Error(result.error);
      }

      toast.success("Upload complete!");
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    }
  };

  return (
    <>
      <NewUploadDialog
        open={uploadDialogOpen}
        setOpen={setUploadDialogOpen}
        onUpload={handleUpload}
      />
      <Button
        onClick={() => setUploadDialogOpen(true)}
        className="bg-transparent hover:bg-transparent flex items-center justify-center w-full h-64 border group hover:border-muted-foreground border-dashed rounded-lg transition-colors"
      >
        <p className="flex flex-col items-center gap-y-1 text-border group-hover:text-muted-foreground font-medium transition-colors">
          <UploadIcon className="w-6 h-6" />
          Add New
        </p>
      </Button>
    </>
  );
}
