"use client";

import { PlusCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { NewReadingDialog } from "./dialogs/new-reading";

export function OdometerCardActions() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <NewReadingDialog open={open} setOpen={setOpen} />
      <Button size="sm" onClick={() => setOpen(true)}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Add
      </Button>
    </>
  );
}
