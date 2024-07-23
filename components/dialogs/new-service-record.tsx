"use client";

import { useVehicle } from "@/lib/hooks/vehicle";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useUser } from "@/lib/hooks/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormError } from "../ui/form-error";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { SERVICE_TYPES } from "@/lib/constants";
import { DatePicker } from "../date-picker";
import { Textarea } from "../ui/textarea";
import { createServiceRecord } from "@/lib/actions/services";

const schema = z.object({
  odometer: z
    .number()
    .int()
    .min(0, "Please enter a valid value")
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),
  serviceType: z.string().min(1),
  description: z.string().max(500).optional(),
  serviceDate: z.date(),
  cost: z
    .number()
    .min(0, "Please enter a valid value")
    .max(999999999, "Please enter a valid value")
    .multipleOf(0.01, "Please enter a valid currency value")
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : String(val))),
});

interface NewServiceRecordDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function NewServiceRecordDialog({
  open,
  setOpen,
}: NewServiceRecordDialogProps) {
  const router = useRouter();
  const vehicle = useVehicle();
  const user = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    if (!user || !vehicle) {
      return;
    }

    try {
      setLoading(true);
      await createServiceRecord({
        vehicleId: vehicle.id,
        ...values,
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
          <DialogTitle>Add service record</DialogTitle>
          <DialogDescription>
            Service records help you keep track of maintenance and repairs for
            your vehicle.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="new-service-record"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {error && <FormError>{error}</FormError>}
            <FormField
              control={form.control}
              name="serviceDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date*</FormLabel>
                  <FormControl>
                    <DatePicker onSelect={(date) => field.onChange(date)} />
                  </FormControl>
                  <FormDescription>
                    The date the service was performed
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="serviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Type*</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(SERVICE_TYPES).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the service performed"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="odometer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Odometer</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1234"
                        {...field}
                        onChange={(event) =>
                          field.onChange(
                            Number.isNaN(event.target.valueAsNumber)
                              ? event.target.value
                              : event.target.valueAsNumber
                          )
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      The odometer reading when the service was performed
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="100.00"
                        {...field}
                        onChange={(event) => field.onChange(event.target)}
                      />
                    </FormControl>
                    <FormDescription>
                      The cost of the service performed
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="new-service-record" disabled={loading}>
            Submit
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
