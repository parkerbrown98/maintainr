"use client";

import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ServiceRecord } from "@/drizzle/schema";
import { DeleteServiceDialog } from "./dialogs/delete-service-record";
import { EditServiceRecordDialog } from "./dialogs/edit-service-record";

export function ServiceRowActions({ service }: { service: ServiceRecord }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const router = useRouter();

  const handleView = () => {
    router.push(`/vehicles/${service.vehicleId}/service?show=${service.id}`);
  };

  return (
    <>
      <EditServiceRecordDialog
        service={service}
        open={editOpen}
        setOpen={setEditOpen}
      />
      <DeleteServiceDialog
        service={service}
        open={deleteOpen}
        setOpen={setDeleteOpen}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <Ellipsis className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleView}>View</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
