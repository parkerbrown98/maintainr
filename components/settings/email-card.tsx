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
import { Input } from "../ui/input";
import { useUser } from "@/lib/hooks/auth";
import { Checkbox } from "../ui/checkbox";
import { editEmail } from "@/lib/actions/user";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  allowMarketing: z.boolean(),
  allowProductUpdates: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export function SettingsEmailCard() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useUser();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: user?.email,
      allowMarketing: false,
      allowProductUpdates: false,
    },
  });

  const handleSubmit = async (data: FormValues) => {
    try {
      await editEmail(data.email);
      toast.success("Your email preferences have been updated.");
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      }
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Address</CardTitle>
        <CardDescription>
          Update your email address and preferences.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            id="settings-email-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid gap-4 lg:gap-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="john@a.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="allowMarketing"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-x-2">
                    <FormControl>
                      <Checkbox
                        onChange={(e) => field.onChange(!field.value)}
                      />
                    </FormControl>
                    <FormLabel>Send marketing updates to my email</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="allowProductUpdates"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-x-2">
                    <FormControl>
                      <Checkbox
                        onChange={(e) => field.onChange(!field.value)}
                      />
                    </FormControl>
                    <FormLabel>Send product updates to my email</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button form="settings-email-form" type="submit">
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}
