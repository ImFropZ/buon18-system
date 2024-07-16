import { DialogContent, DialogTitle } from "@components/ui/dialog";
import React from "react";
import { SalesOrderCreateSchema } from "@models/sales-order";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormLabel } from "@components/ui/form";
import {
  DateFormField,
  InputFormField,
  TextareaFormField,
} from "@components/form";
import { Button } from "@components/ui/button";
import * as z from "zod";

interface SalesOrderProps {
  onSuccess: (data: z.infer<typeof SalesOrderCreateSchema>) => void;
}

export function SalesOrder({ onSuccess }: SalesOrderProps) {
  const form = useForm<z.infer<typeof SalesOrderCreateSchema>>({
    resolver: zodResolver(SalesOrderCreateSchema),
  });

  return (
    <DialogContent>
      <DialogTitle className="text-2xl font-bold">Quote Item</DialogTitle>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            form.reset();
            onSuccess(data);
          })}
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <FormLabel>Code</FormLabel>
              <FormField
                name="code"
                render={({ field }) => {
                  return (
                    <InputFormField
                      field={field}
                      errorField={form.formState.errors.code}
                      placeholder="SO-0000"
                    />
                  );
                }}
              />
            </div>
            <div>
              <FormLabel>
                Accept Date - <i className="text-muted-foreground">Optional</i>
              </FormLabel>
              <FormField
                name="accept_date"
                render={({ field }) => {
                  return (
                    <DateFormField
                      field={field}
                      errorField={form.formState.errors.accept_date}
                    />
                  );
                }}
              />
            </div>
            <div>
              <FormLabel>Delivery Date</FormLabel>
              <FormField
                name="delivery_date"
                render={({ field }) => {
                  return (
                    <DateFormField
                      field={field}
                      errorField={form.formState.errors.delivery_date}
                    />
                  );
                }}
              />
            </div>
            <div className="col-span-2">
              <FormLabel>
                Note - <i className="text-muted-foreground">Optional</i>
              </FormLabel>
              <FormField
                name="note"
                render={({ field }) => {
                  return (
                    <TextareaFormField
                      field={field}
                      errorField={form.formState.errors.note}
                    />
                  );
                }}
              />
            </div>
            <Button className="col-span-2">Submit</Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
