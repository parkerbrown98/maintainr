"use client";

import { PlusCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { NewServiceRecordDialog } from "./dialogs/new-service-record";

export function ServiceCardActions() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <NewServiceRecordDialog open={open} setOpen={setOpen} />
      <Button size="sm" onClick={() => setOpen(true)}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Add
      </Button>
    </>
  );
}
