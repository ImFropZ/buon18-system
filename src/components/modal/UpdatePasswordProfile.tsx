import { DialogContent, DialogTitle } from "@components/ui/dialog";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormLabel } from "@components/ui/form";
import { InputFormField } from "@components/form";
import * as z from "zod";
import { UpdatePasswordSchema } from "@models/auth";
import { Button } from "@components/ui/button";

interface UpdatePasswordProfileProps {
  onSuccess: (data: z.infer<typeof UpdatePasswordSchema>) => void;
}

export function UpdatePasswordProfile({
  onSuccess,
}: UpdatePasswordProfileProps) {
  const form = useForm<z.infer<typeof UpdatePasswordSchema>>({
    resolver: zodResolver(UpdatePasswordSchema),
  });

  return (
    <DialogContent>
      <DialogTitle className="text-2xl font-bold">Update Password</DialogTitle>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            form.reset();
            onSuccess(data);
          })}
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <FormLabel>Old password</FormLabel>
              <FormField
                name="old_password"
                render={({ field }) => {
                  return (
                    <InputFormField
                      field={field}
                      errorField={form.formState.errors.old_password}
                      placeholder="*****"
                      type="password"
                    />
                  );
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <FormLabel>New password</FormLabel>
              <FormField
                name="new_password"
                render={({ field }) => {
                  return (
                    <InputFormField
                      field={field}
                      errorField={form.formState.errors.new_password}
                      placeholder="*****"
                      type="password"
                    />
                  );
                }}
              />
            </div>
            <span className="col-span-2 text-sm text-muted-foreground">
              If your password is not seted yet, input old password the same as
              the new password.
            </span>
            <Button className="col-span-2">Submit</Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
