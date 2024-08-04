"use client";

import { Upload } from "@/drizzle/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { deleteUpload } from "@/lib/actions/uploads";

interface DeleteUploadDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  upload: Upload;
}

export function DeleteUploadDialog({
  open,
  setOpen,
  upload,
}: DeleteUploadDialogProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setLoading(true);

      const result = await deleteUpload(upload.id);
      if (result && result.error) {
        throw new Error(result.error);
      }

      setOpen(false);
      toast.success("Upload was deleted successfully.");
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete upload</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this upload? It will be permanently
            destroyed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleDelete} disabled={loading}>
            {loading ? "Working" : "Delete"}
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
