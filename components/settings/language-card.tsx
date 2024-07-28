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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Link from "next/link";

const schema = z.object({
  language: z.string().min(1, "Please select a language"),
});

type FormValues = z.infer<typeof schema>;

export function SettingsLanguageCard() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useUser();

  if (!user) {
    return null;
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      language: "en",
    },
  });

  const handleSubmit = async (data: FormValues) => {
    try {
      // await editUserName(data.firstName, data.lastName);
      toast.success("Your language has been updated.");
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
        <CardTitle>Language</CardTitle>
        <CardDescription>Change your preferred language.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            id="settings-language-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid gap-4 lg:gap-6"
          >
            {error && <FormError>{error}</FormError>}
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Selected Language</FormLabel> */}
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    At this time, English is the only supported language. Please
                    visit{" "}
                    <Link
                      href="https://github.com/parkerbrown98/maintainr"
                      className="text-accent-foreground hover:underline"
                    >
                      our repo
                    </Link>{" "}
                    if you would like to help translate.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button form="settings-language-form" type="submit">
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}
