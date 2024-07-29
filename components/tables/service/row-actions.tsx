"use client";

import { DeleteServiceDialog } from "@/components/dialogs/delete-service-record";
import { EditServiceRecordDialog } from "@/components/dialogs/edit-service-record";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ServiceRecord } from "@/drizzle/schema";
import { Ellipsis } from "lucide-react";
import { useState } from "react";

export function ServiceDataTableRowActions({
  service,
}: {
  service: ServiceRecord;
}) {
  const [editMenuOpen, setEditMenuOpen] = useState(false);
  const [deleteMenuOpen, setDeleteMenuOpen] = useState(false);

  return (
    <>
      <EditServiceRecordDialog
        service={service}
        open={editMenuOpen}
        setOpen={setEditMenuOpen}
      />
      <DeleteServiceDialog
        service={service}
        open={deleteMenuOpen}
        setOpen={setDeleteMenuOpen}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center w-8 h-8 p-0">
            <Ellipsis className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setEditMenuOpen(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteMenuOpen(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
