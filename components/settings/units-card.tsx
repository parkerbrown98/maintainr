"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useUser } from "@/lib/hooks/auth";
import { toast } from "sonner";
import { editPreferences, editUserName } from "@/lib/actions/user";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormError } from "../ui/form-error";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const schema = z.object({
  lengthUnits: z.enum(["imperial", "metric"]),
  volumeUnits: z.enum(["imperial", "metric"]),
  weightUnits: z.enum(["imperial", "metric"]),
});

type FormValues = z.infer<typeof schema>;

export function SettingsUnitsCard() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, preferences } = useUser();

  if (!user || !preferences) {
    return null;
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      lengthUnits: preferences.lengthUnits,
      volumeUnits: preferences.volumeUnits,
      weightUnits: preferences.weightUnits,
    },
  });

  const handleSubmit = async (data: FormValues) => {
    try {
      await editPreferences({
        lengthUnits: data.lengthUnits,
        volumeUnits: data.volumeUnits,
        weightUnits: data.weightUnits,
      });
      toast.success("Your unit selections have been updated.");
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unit Conversions</CardTitle>
        <CardDescription>Select the units you prefer to use.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            id="settings-units-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid gap-4 lg:gap-6"
          >
            {error && <FormError>{error}</FormError>}
            <FormField
              control={form.control}
              name="lengthUnits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Length</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a length unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="imperial">Imperial (miles)</SelectItem>
                      <SelectItem value="metric">
                        Metric (kilometers)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="volumeUnits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Volume</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a volume unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="imperial">
                        Imperial (gallons)
                      </SelectItem>
                      <SelectItem value="metric">Metric (liters)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weightUnits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a weight unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="imperial">
                        Imperial (pounds)
                      </SelectItem>
                      <SelectItem value="metric">Metric (kilograms)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button form="settings-units-form" type="submit">
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}
