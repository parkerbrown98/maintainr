"use client";

import { Upload } from "@/drizzle/schema";
import convert from "convert";
import Link from "next/link";
import { Button } from "./ui/button";
import { Download, Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteUploadDialog } from "./dialogs/delete-upload";

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
          className="relative overflow-hidden w-full h-64 rounded-t-lg"
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
