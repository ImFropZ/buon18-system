import { DialogContent, DialogTitle } from "@components/ui/dialog";
import React from "react";
import { QuoteItemCreateSchema, QuoteItem as TQuoteItem } from "@models/quote";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormLabel } from "@components/ui/form";
import { InputFormField } from "@components/form";
import { Button } from "@components/ui/button";
import * as z from "zod";

interface QuoteItemProps {
  placeholderValue?: TQuoteItem;
  onSubmit(_data: TQuoteItem): void;
}

export function QuoteItem({ placeholderValue, onSubmit }: QuoteItemProps) {
  const form = useForm<z.infer<typeof QuoteItemCreateSchema>>({
    resolver: zodResolver(QuoteItemCreateSchema),
  });

  return (
    <DialogContent>
      <DialogTitle className="text-2xl font-bold">Quote Item</DialogTitle>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            form.reset();
            onSubmit({ ...data, id: "" });
          })}
        >
          <div className="grid grid-cols-2 gap-6">
            <div>
              <FormLabel>Name</FormLabel>
              <FormField
                name="name"
                render={({ field }) => {
                  return (
                    <InputFormField
                      field={field}
                      errorField={form.formState.errors.name}
                      placeholder={placeholderValue?.name || "Name"}
                    />
                  );
                }}
              />
            </div>
            <div>
              <FormLabel>Description</FormLabel>
              <FormField
                name="description"
                render={({ field }) => {
                  return (
                    <InputFormField
                      field={field}
                      errorField={form.formState.errors.description}
                      placeholder={
                        placeholderValue?.description || "Description"
                      }
                    />
                  );
                }}
              />
            </div>
            <div>
              <FormLabel>Quantity</FormLabel>
              <FormField
                name="quantity"
                render={({ field }) => {
                  return (
                    <InputFormField
                      field={field}
                      errorField={form.formState.errors.quantity}
                      placeholder="1"
                    />
                  );
                }}
              />
            </div>
            <div>
              <FormLabel>Unit Price</FormLabel>
              <FormField
                name="unit_price"
                render={({ field }) => {
                  return (
                    <InputFormField
                      field={field}
                      errorField={form.formState.errors.unit_price}
                      placeholder="$0.00"
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
