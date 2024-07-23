"use client";

import { OdometerReading } from "@/drizzle/schema";
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
import { deleteOdometerReading } from "@/lib/actions/odometer";

interface DeleteReadingDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  reading: OdometerReading;
}

export function DeleteReadingDialog({
  open,
  setOpen,
  reading,
}: DeleteReadingDialogProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteOdometerReading({ id: reading.id });
      setOpen(false);
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete odometer reading</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this odometer reading?
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
