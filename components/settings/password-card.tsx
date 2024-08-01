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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormError } from "../ui/form-error";
import { editPassword } from "@/lib/actions/user";

const schema = z
  .object({
    currentPassword: z.string().min(1, "Please enter your current password"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (newPassword !== confirmPassword) {
      ctx.addIssue({
        message: "Passwords do not match",
        code: "custom",
        path: ["confirmPassword"],
      });
    }
  });

type FormValues = z.infer<typeof schema>;

export function SettingsPasswordCard() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useUser();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const handleSubmit = async (data: FormValues) => {
    try {
      const result = await editPassword(data.currentPassword, data.newPassword);
      if (result?.error) {
        throw new Error(result.error);
      }
      toast.success("Your password has been updated.");
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>Update your login credentials.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            id="settings-password-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid gap-4 lg:gap-6"
          >
            {error && <FormError>{error}</FormError>}
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Current Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="New Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button form="settings-password-form" type="submit">
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}
