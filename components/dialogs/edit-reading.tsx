"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { OdometerReading } from "@/drizzle/schema";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { DatePicker } from "../date-picker";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { FormError } from "../ui/form-error";
import { Button } from "../ui/button";
import { editOdometerReading } from "@/lib/actions/odometer";
import { LabelInput } from "../ui/label-input";
import { useUser } from "@/lib/hooks/auth";
import convert from "convert";

const schema = z.object({
  date: z.date(),
  odometer: z.number().int().min(0),
});

interface EditReadingDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  reading: OdometerReading;
}

export function EditReadingDialog({
  open,
  setOpen,
  reading,
}: EditReadingDialogProps) {
  const { preferences } = useUser();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: reading.recordedAt,
      odometer: Math.round(
        convert(reading.reading, "mi").to(
          preferences?.lengthUnits === "metric" ? "km" : "mi"
        )
      ),
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (!reading) {
      return;
    }

    try {
      setLoading(true);
      await editOdometerReading({
        id: reading.id,
        date: data.date,
        odometer: data.odometer,
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
          <DialogTitle>Edit odometer reading</DialogTitle>
          <DialogDescription>
            Enter the record date and odometer reading for the vehicle.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="edit-reading"
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
                    <DatePicker
                      selected={reading.recordedAt}
                      onSelect={(date) => field.onChange(date)}
                    />
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
                    <LabelInput
                      type="number"
                      placeholder="1234"
                      label={
                        preferences?.lengthUnits === "metric" ? "km" : "mi"
                      }
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
          <Button form="edit-reading" type="submit" disabled={loading}>
            {loading ? "Working" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
