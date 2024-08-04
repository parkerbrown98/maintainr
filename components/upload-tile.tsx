"use client";

import { Upload } from "@/drizzle/schema";
import { Button } from "./ui/button";
import {
  AudioLines,
  Download,
  Ellipsis,
  FileText,
  FileVideo,
  Trash2,
  X,
} from "lucide-react";
import convert from "convert";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useState } from "react";
import { DeleteUploadDialog } from "./dialogs/delete-upload";
import Image from "next/image";

interface UploadTileProps {
  upload: Upload;
}

export function UploadTile({ upload }: UploadTileProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <>
      <DeleteUploadDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        upload={upload}
      />
      <div className="flex space-x-2 items-center bg-muted border border-border rounded-md p-2">
        {upload.mimeType.startsWith("image") && (
          <Image
            src={upload.url}
            alt={upload.fileName}
            className="w-10 h-10 aspect-square object-cover rounded-sm"
            width={120}
            height={120}
          />
        )}
        {upload.mimeType === "application/pdf" && (
          <div className="w-10 h-10 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        )}
        {upload.mimeType.startsWith("audio") && (
          <div className="w-10 h-10 flex items-center justify-center">
            <AudioLines className="w-6 h-6" />
          </div>
        )}
        {upload.mimeType.startsWith("video") && (
          <div className="w-10 h-10 flex items-center justify-center">
            <FileVideo className="w-6 h-6" />
          </div>
        )}
        <div className="flex items-center justify-between space-x-2 flex-1">
          <Link
            className="group"
            href={upload.url}
            target="_blank"
            rel="noreferrer"
          >
            <div className="text-sm font-medium leading-tight tracking-tight line-clamp-2 group-hover:underline">
              {upload.fileName}
            </div>
            <div className="text-sm text-muted-foreground tracking-tight mt-0.5">
              {convert(upload.size, "bytes").to("best").toString(2)}
            </div>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex-shrink-0 w-6 h-6 p-0"
                aria-label="Delete"
              >
                <Ellipsis className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  href={`${upload.url}?download=true`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
}
