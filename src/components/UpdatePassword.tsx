"use client";

import { updatePasswordSchema } from "@/models/auth";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Form, FormField } from "./ui/form";
import { InputFormField } from "./form";
import { Lock } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { systemAxiosInstance } from "@modules/shared";
import { basicResponseSchema } from "@models";
import { Label } from "./ui/label";

async function onUpdatePasswordHandler(
  data: z.infer<typeof updatePasswordSchema>,
) {
  const body = {
    old_password: data.current_password,
    new_password: data.new_password,
  };
  return await systemAxiosInstance
    .post("/auth/update-password", body)
    .then((res) => {
      const result = basicResponseSchema.safeParse(res.data);

      if (!result.success) {
        return Promise.reject(result.error);
      }

      return result.data;
    });
}

export function UpdatePassword() {
  const [open, setOpen] = React.useState(false);
  const form = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="flex-1" variant="outline">
          <Lock />
          <span>Update Password</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="grid grid-rows-[auto,auto,1fr]">
        <SheetTitle>Update Password</SheetTitle>
        <SheetDescription>
          Update your password to keep your account secure.
        </SheetDescription>

        <Form {...form}>
          <form
            className="my-4 flex h-full flex-col gap-4"
            onSubmit={form.handleSubmit((v) => {
              onUpdatePasswordHandler(v)
                .then(() => {
                  // TODO: show success message
                  form.reset();
                  setOpen(false);
                })
                .catch(() => {
                  // TODO: show error message
                });
            }, console.log)}
          >
            <div>
              <Label>Current Password</Label>
              <FormField
                name="current_password"
                render={({ field }) => {
                  return (
                    <InputFormField
                      type="password"
                      field={field}
                      errorField={form.formState.errors.current_password}
                      placeholder="********"
                    />
                  );
                }}
              />
            </div>
            <div>
              <Label>New Password</Label>
              <FormField
                name="new_password"
                render={({ field }) => {
                  return (
                    <InputFormField
                      type="password"
                      field={field}
                      errorField={form.formState.errors.new_password}
                      placeholder="********"
                    />
                  );
                }}
              />
            </div>
            <div>
              <Label>Confirm Password</Label>
              <FormField
                name="confirm_password"
                render={({ field }) => {
                  return (
                    <InputFormField
                      type="password"
                      field={field}
                      errorField={form.formState.errors.confirm_password}
                      placeholder="********"
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
