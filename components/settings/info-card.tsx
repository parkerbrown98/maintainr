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
import { editUserName } from "@/lib/actions/user";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormError } from "../ui/form-error";

const schema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
});

type FormValues = z.infer<typeof schema>;

export function SettingsInfoCard() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useUser();

  if (!user) {
    return null;
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });

  const handleSubmit = async (data: FormValues) => {
    try {
      await editUserName(data.firstName, data.lastName);
      toast.success("Your personal info has been updated.");
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
        <CardTitle>Personal Info</CardTitle>
        <CardDescription>Update your first and last name.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            id="settings-info-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid lg:grid-cols-2 gap-y-4 gap-x-4 lg:gap-y-6"
          >
            {error && (
              <div className="lg:col-span-2">
                <FormError>{error}</FormError>
              </div>
            )}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="John" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Doe" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button form="settings-info-form" type="submit">
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}
