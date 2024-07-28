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
import { editServiceRecord } from "@/lib/actions/services";
import { LabelInput } from "../ui/label-input";
import { ServiceRecord } from "@/drizzle/schema";
import convert from "convert";
import { toast } from "sonner";

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
    .string()
    .optional()
    .refine(
      (value) => {
        if (value === undefined || value === "") return true;
        return /^\d+(\.\d{1,2})?$/.test(value);
      },
      {
        message: "Cost must be a valid decimal number or blank",
      }
    ),
});

interface EditServiceRecordDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  service: ServiceRecord;
}

export function EditServiceRecordDialog({
  open,
  setOpen,
  service,
}: EditServiceRecordDialogProps) {
  const router = useRouter();
  const vehicle = useVehicle();
  const { user, preferences } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      odometer: service.odometer
        ? Math.round(
            convert(service.odometer, "mi").to(
              preferences?.lengthUnits === "metric" ? "km" : "mi"
            )
          )
        : 0,
      serviceType: service.serviceType,
      description: service.description ?? "",
      serviceDate: service.serviceDate,
      cost: service.cost ?? "",
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    if (!user || !vehicle) {
      return;
    }

    try {
      setLoading(true);
      await editServiceRecord(service.id, values);
      form.reset();
      setOpen(false);
      router.refresh();
      toast.success("Service record updated");
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
          <DialogTitle>Edit service record</DialogTitle>
          <DialogDescription>
            Service records help you keep track of maintenance and repairs for
            your vehicle.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="edit-service-record"
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
                    <DatePicker
                      selected={field.value}
                      onSelect={(date) => field.onChange(date)}
                    />
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
                      <div className="relative">
                        <LabelInput
                          type="number"
                          placeholder="1234"
                          label={
                            preferences?.lengthUnits === "metric" ? "km" : "mi"
                          }
                          {...field}
                          onChange={(event) =>
                            field.onChange(
                              Number.isNaN(event.target.valueAsNumber)
                                ? event.target.value
                                : event.target.valueAsNumber
                            )
                          }
                        />
                      </div>
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
                      <Input type="number" placeholder="100.00" {...field} />
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
          <Button type="submit" form="edit-service-record" disabled={loading}>
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
