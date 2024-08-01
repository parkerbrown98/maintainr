"use client";

import convert from "convert";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Image, FileText, AudioLines, FileVideo, X } from "lucide-react";
import { useEffect } from "react";

const schema = z.object({
  files: z
    .array(
      z.instanceof(File).refine((val) => val.size < 1024 * 1024 * 5, {
        message: "File size must be less than 5MB",
      })
    )
    .nonempty({ message: "At least one file is required" }),
});

interface NewUploadDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onUpload: (data: FormData) => void;
}

type UploadFormData = z.infer<typeof schema>;

export function NewUploadDialog({
  open,
  setOpen,
  onUpload,
}: NewUploadDialogProps) {
  const form = useForm<UploadFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: UploadFormData) => {
    const formData = new FormData();

    for (const file of data.files) {
      formData.append("files", file);
    }

    onUpload(formData);
  };

  useEffect(() => {
    form.reset({
      files: [],
    });
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add upload</DialogTitle>
          <DialogDescription>
            Upload an image, audio, video, or PDF. Max file size: <b>5MB</b>.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="new-upload"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="files"
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
          <Button type="submit" form="new-upload">
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
