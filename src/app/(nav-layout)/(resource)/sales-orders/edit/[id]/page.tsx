"use client";

import { CustomTooltip } from "@components";
import {
  DateFormField,
  InputFormField,
  TextareaFormField,
} from "@components/form";
import { Button } from "@components/ui/button";
import { Form, FormField } from "@components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SalesOrderEditSchema, SalesOrderSchema } from "@models/sales-order";
import { useNavigation, useOne, useUpdate } from "@refinedev/core";
import { Book, Check, Eye, List, Minus, User } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const SalesOrderEdit = ({ params }: { params: { id: string } }) => {
  const { mutate } = useUpdate();
  const { data, isLoading } = useOne<z.infer<typeof SalesOrderSchema>>({
    resource: "sales-orders",
    id: params.id,
  });
  const form = useForm({
    resolver: zodResolver(SalesOrderEditSchema),
  });

  const { list, show } = useNavigation();

  const onSubmit = (data: z.infer<typeof SalesOrderEditSchema>) => {
    mutate(
      {
        resource: "sales-orders",
        id: params.id,
        values: data,
      },
      {
        onSuccess: () => {
          show("sales-orders", params.id);
        },
      },
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
        <div className="relative flex h-full flex-col gap-2 overflow-hidden rounded-lg px-1 pb-2">
          {isLoading ? (
            <div className="grid place-content-center pt-10">
              <div className="loader"></div>
            </div>
          ) : (
            <>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  size={"icon"}
                  variant={"outline"}
                  onClick={() => list("sales-orders")}
                  className="mr-auto"
                >
                  <List />
                </Button>
                <Button
                  type="button"
                  size={"icon"}
                  variant={"outline"}
                  onClick={() => show("sales-orders", params.id)}
                >
                  <Eye />
                </Button>
                <Button
                  size={"icon"}
                  variant={"outline"}
                  className="hover:bg-green-500 hover:text-secondary"
                >
                  <Check />
                </Button>
              </div>
              <div className="h-full rounded border px-4">
                <div className="flex justify-between py-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <FormField
                        name="code"
                        render={({ field }) => (
                          <InputFormField
                            className="min-w-96 text-2xl font-bold"
                            field={field}
                            errorField={form.formState.errors.code}
                            defaultValue={data?.data.code || ""}
                            placeholder="SO-0000"
                          />
                        )}
                      />
                      <p className="rounded-xl bg-primary px-2 text-secondary">
                        {data?.data.status}
                      </p>
                    </div>
                    <div className="flex gap-2 pl-4">
                      <FormField
                        control={form.control}
                        name="accept_date"
                        render={({ field }) => (
                          <DateFormField
                            field={field}
                            errorField={form.formState.errors.accept_date}
                            _defaultValue={data?.data.accept_date}
                            label="Accept Date"
                          />
                        )}
                      />
                      <Minus className="mt-7" />
                      <FormField
                        control={form.control}
                        name="delivery_date"
                        render={({ field }) => (
                          <DateFormField
                            field={field}
                            errorField={form.formState.errors.delivery_date}
                            _defaultValue={data?.data.delivery_date}
                            label="Delivery Date"
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <CustomTooltip content="View sales order's quote">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          show("quotes", data?.data.quote_id || "")
                        }
                      >
                        <Book />
                      </Button>
                    </CustomTooltip>
                    <CustomTooltip content="View sales order's created by">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          // TODO: SHOW create sales order user
                        }}
                      >
                        <User />
                      </Button>
                    </CustomTooltip>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <TextareaFormField
                      field={field}
                      errorField={form.formState.errors.note}
                      label={
                        <>
                          {"Note - "}
                          <i className="text-muted-foreground">Optional</i>
                        </>
                      }
                      placeholder="- No note -"
                      className="min-h-32"
                    />
                  )}
                />
              </div>
            </>
          )}
        </div>
      </form>
    </Form>
  );
};

export default SalesOrderEdit;
