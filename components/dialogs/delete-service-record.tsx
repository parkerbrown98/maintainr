"use client";

import { ServiceRecord } from "@/drizzle/schema";
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
import { deleteServiceRecord } from "@/lib/actions/services";

interface DeleteServiceDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  service: ServiceRecord;
}

export function DeleteServiceDialog({
  open,
  setOpen,
  service,
}: DeleteServiceDialogProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteServiceRecord(service.id);
      setOpen(false);
      toast.success("Service record deleted");
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
          <DialogTitle>Delete service record</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this service record?
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
