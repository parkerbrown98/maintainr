"use client";

import { Upload } from "@/drizzle/schema";
import { Button } from "./ui/button";
import { Download, Ellipsis, Trash2, X } from "lucide-react";
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
      <div className="bg-muted border border-border rounded-md overflow-hidden">
        <img
          src={upload.url}
          alt={upload.fileName}
          className="w-full aspect-[4/3] object-cover"
        />
        <div className="flex flex-col space-y-1 border-t border-border p-2">
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
            <DropdownMenuContent align="start">
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
