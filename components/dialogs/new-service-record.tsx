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
import { LabelInput } from "../ui/label-input";
import convert from "convert";
import { AudioLines, FileText, FileVideo, Image, X } from "lucide-react";

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
  attachments: z
    .array(
      z.instanceof(File).refine((val) => val.size < 5 * 1024 * 1024, {
        message: "File size must be less than 5MB",
      })
    )
    .optional(),
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
  const { user, preferences } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    if (!user || !vehicle) {
      return;
    }

    const formData = new FormData();
    formData.set("vehicleId", vehicle.id);
    formData.set("serviceType", values.serviceType);
    formData.set("serviceDate", values.serviceDate.toISOString());
    formData.set("odometer", values.odometer?.toString() || "");
    formData.set("description", values.description || "");
    formData.set("cost", values.cost || "");

    values.attachments?.forEach((file) => {
      formData.append("attachments", file);
    });

    try {
      setLoading(true);
      await createServiceRecord(formData);
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
            <FormField
              control={form.control}
              name="attachments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attach Files</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) => {
                        // Add files to the form field
                        field.onChange([
                          ...(field.value || []),
                          ...Array.from(e.target.files || []),
                        ]);
                      }}
                      accept="image/*,application/pdf,audio/*,video/*"
                      multiple
                    />
                  </FormControl>
                  {field.value && field.value.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {field.value.map((file: File, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-x-2"
                        >
                          <div className="flex items-center space-x-2">
                            {file.type.startsWith("image") && (
                              <Image className="w-5 h-5" />
                            )}
                            {file.type === "application/pdf" && (
                              <FileText className="w-5 h-5" />
                            )}
                            {file.type.startsWith("audio") && (
                              <AudioLines className="w-5 h-5" />
                            )}
                            {file.type.startsWith("video") && (
                              <FileVideo className="w-5 h-5" />
                            )}
                            <div className="truncate max-w-[15rem] text-sm">
                              {file.name}
                            </div>
                          </div>
                          <div className="flex items-center gap-x-4">
                            <span className="text-muted-foreground text-sm text-right">
                              {convert(file.size, "bytes")
                                .to("best")
                                .toString(2)}
                            </span>
                            <Button
                              onClick={() => {
                                field.onChange(
                                  field.value?.filter((_, i) => i !== index)
                                );
                              }}
                              variant="ghost"
                              className="w-8 h-8 p-0"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
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
