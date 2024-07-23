"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { DatePicker } from "../date-picker";
import { Input } from "../ui/input";
import { createOdometerReading } from "@/lib/actions/odometer";
import { FormError } from "../ui/form-error";
import { useVehicle } from "@/lib/hooks/vehicle";

const schema = z.object({
  date: z.date(),
  odometer: z.number().int().min(0),
});

interface NewReadingDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function NewReadingDialog({ open, setOpen }: NewReadingDialogProps) {
  const vehicle = useVehicle();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (!vehicle) {
      return;
    }
    
    try {
      setLoading(true);
      await createOdometerReading({
        date: data.date,
        odometer: data.odometer,
        vehicleId: vehicle.id,
      });
      form.reset();
      setOpen(false);
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New odometer reading</DialogTitle>
          <DialogDescription>
            Enter the record date and odometer reading for the vehicle.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="new-reading"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {error && <FormError>{error}</FormError>}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date*</FormLabel>
                  <FormControl>
                    <DatePicker onSelect={(date) => field.onChange(date)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="odometer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Odometer*</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="1234"
                      {...field}
                      onChange={(event) =>
                        field.onChange(event.target.valueAsNumber)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button form="new-reading" type="submit" disabled={loading}>
            {loading ? "Working" : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
