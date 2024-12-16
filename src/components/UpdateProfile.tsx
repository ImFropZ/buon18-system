"use client";

import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateProfileSchema, userSchema } from "@/models/auth";
import { Edit } from "lucide-react";
import { Form, FormField } from "./ui/form";
import { InputFormField } from "./form";
import { zodResolver } from "@hookform/resolvers/zod";
import { systemAxiosInstance } from "@modules/shared";
import { basicResponseSchema } from "@models";
import { Label } from "./ui/label";

async function onUpdateProfileHandler(
  data: z.infer<typeof updateProfileSchema>,
) {
  const body = {
    name: data.name,
    email: data.email,
  };
  return await systemAxiosInstance.patch("/auth/me", body).then((res) => {
    const result = basicResponseSchema.safeParse(res.data);

    if (!result.success) {
      console.error(result.error.errors);
      return Promise.reject(result.error);
    }

    return result.data;
  });
}

interface UpdateProfileProps {
  defaultValues?: z.infer<typeof userSchema>;
  refetch?: () => void;
}

export function UpdateProfile({ defaultValues, refetch }: UpdateProfileProps) {
  const [open, setOpen] = React.useState(false);
  const form = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues,
  });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="flex-1" variant="outline">
          <Edit />
          <span>Update Profile</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="grid grid-rows-[auto,auto,1fr]">
        <SheetTitle>Update Profile</SheetTitle>
        <SheetDescription>
          Update your profile information to keep your account up to date.
        </SheetDescription>

        <Form {...form}>
          <form
            className="my-4 flex h-full flex-col gap-4"
            onSubmit={form.handleSubmit((v) => {
              onUpdateProfileHandler(v)
                .then(() => {
                  // TODO: show success message
                  setOpen(false);
                  refetch?.();
                })
                .catch(() => {
                  // TODO: show error message
                });
            }, console.log)}
          >
            <div>
              <Label>Name</Label>
              <FormField
                name="name"
                render={({ field }) => {
                  return (
                    <InputFormField
                      field={field}
                      errorField={form.formState.errors.name}
                    />
                  );
                }}
              />
            </div>

            <div>
              <Label>Email</Label>
              <FormField
                name="email"
                render={({ field }) => {
                  return (
                    <InputFormField
                      type="email"
                      field={field}
                      errorField={form.formState.errors.email}
                    />
                  );
                }}
              />
            </div>

            <SheetFooter className="mt-auto flex gap-2">
              <SheetClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </SheetClose>
              <Button>Update</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
