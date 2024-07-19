"use client";

import {
  InputFormField,
  SearchSelectFormField,
  TextareaFormField,
} from "@components/form";
import { DateFormField } from "@components/form/DateFormField";
import { QuoteItem } from "@components/modal";
import { Button } from "@components/ui/button";
import { Dialog, DialogTrigger } from "@components/ui/dialog";
import { Form, FormField } from "@components/ui/form";
import { Input } from "@components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { useToast } from "@components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuoteCreateSchema, QuoteItemEditSchema } from "@models/quote";
import { useCreate, useNavigation } from "@refinedev/core";
import {
  Building,
  Check,
  Eye,
  List,
  Minus,
  MinusIcon,
  Plus,
  Users,
} from "lucide-react";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

const QuoteCreate = ({ params }: { params: { id: string } }) => {
  const { mutate } = useCreate();
  const form = useForm<z.infer<typeof QuoteCreateSchema>>({
    resolver: zodResolver(QuoteCreateSchema),
    defaultValues: {
      discount: 0,
    },
  });
  const { fields, update, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
    keyName: "uuid",
  });
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { list, show } = useNavigation();
  const { toast } = useToast();

  const onSubmit = (data: z.infer<typeof QuoteCreateSchema>) => {
    mutate(
      {
        resource: "quotes",
        values: data,
      },
      {
        onSuccess: () => list("quotes"),
        onError: (error) => {
          toast({
            title: "Create Quote Error",
            description: error.message,
          });
        },
      },
    );
  };

  const itemOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldChange: string,
    item: z.infer<typeof QuoteItemEditSchema>,
  ) => {
    const i = fields.findIndex((data) => data.id == item.id);

    if (i !== -1) {
      update(i, {
        ...fields[i],
        [fieldChange]: e.target.value,
      });
      return;
    }
  };

  const calcSubtotal = () => {
    return fields.reduce((acc, item) => {
      return acc + (item.quantity || 0) * (item.unit_price || 0);
    }, 0);
  };

  const calcQuoteItemTotal = ({
    id,
    quantity,
    unit_price,
  }: {
    id?: string;
    quantity: number;
    unit_price: number;
  }) => {
    const updateData = fields.find((data) => data.id == id);
    if (updateData) {
      return Number(updateData.quantity) * Number(updateData.unit_price);
    }
    return quantity * unit_price;
  };

  console.log(form.formState.errors.items);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, () => {
            toast({
              title: "Submit Quote Form Error",
              description: "An error occurred",
            });
          })}
          className="h-full"
        >
          <div className="relative flex h-full flex-col gap-2 overflow-hidden rounded-lg px-1 pb-2">
            <div className="flex gap-2">
              <Button
                type="button"
                size={"icon"}
                variant={"outline"}
                onClick={() => list("quotes")}
              >
                <List />
              </Button>
              <Button
                type="button"
                size={"icon"}
                variant={"outline"}
                onClick={() => show("quotes", params.id)}
                className="ml-auto"
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
                  <div className="flex items-center gap-4">
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <InputFormField
                          field={field}
                          errorField={form.formState.errors.code}
                          className="min-w-96 text-2xl font-bold"
                        />
                      )}
                    />
                    <p className="rounded-xl bg-primary px-2 text-secondary">
                      Draft
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pl-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <DateFormField
                          field={field}
                          errorField={form.formState.errors.date}
                          label="Date"
                        />
                      )}
                    />
                    <MinusIcon className="mt-5" />
                    <FormField
                      control={form.control}
                      name="expiry_date"
                      render={({ field }) => (
                        <DateFormField
                          field={field}
                          errorField={form.formState.errors.expiry_date}
                          label="Expiry Date"
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <FormField
                    name="account_id"
                    control={form.control}
                    render={({ field }) => (
                      <SearchSelectFormField
                        field={field}
                        errorField={form.formState.errors.account_id}
                        resource="accounts"
                        placeholder="No account"
                        icon={<Users className="mr-2" />}
                      />
                    )}
                  />
                  <FormField
                    name="client_id"
                    control={form.control}
                    render={({ field }) => (
                      <SearchSelectFormField
                        field={field}
                        errorField={form.formState.errors.client_id}
                        resource="clients"
                        placeholder="No client"
                        icon={<Building className="mr-2" />}
                      />
                    )}
                  />
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
              <Table className="mx-auto my-2 w-4/5 max-w-[64rem] text-base">
                <TableCaption className="text-base">
                  <div className="ml-auto grid max-w-[20%] grid-cols-2">
                    <p className="text-end">Subtotal:</p>
                    <span className="text-end">${calcSubtotal()}</span>
                  </div>
                  <div className="ml-auto grid max-w-[20%] grid-cols-2 items-center">
                    <p className="text-end">Discount:</p>
                    <FormField
                      name="discount"
                      render={({ field }) => {
                        return (
                          <InputFormField
                            field={field}
                            errorField={form.formState.errors.discount}
                            className="ml-auto w-4/5 text-end"
                            placeholder="$0.00"
                          />
                        );
                      }}
                    />
                  </div>
                  <div className="ml-auto grid max-w-[20%] grid-cols-2">
                    <p className="text-end">Total:</p>
                    <span className="text-end">
                      ${calcSubtotal() - Number(form.watch().discount || 0)}
                    </span>
                  </div>
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead className="w-36">Total</TableHead>
                    <TableHead className="w-20">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((item, i) => {
                    return (
                      <TableRow key={item.id || i}>
                        <TableCell>
                          {item.id || (
                            <span className="text-muted-foreground">None</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Input
                            defaultValue={item.name}
                            onChange={(e) => {
                              itemOnChange(e, "name", item);
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            defaultValue={item.description}
                            onChange={(e) => {
                              itemOnChange(e, "description", item);
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            defaultValue={item.quantity}
                            onChange={(e) => {
                              itemOnChange(e, "quantity", item);
                            }}
                          />
                        </TableCell>
                        <TableCell className="flex items-center gap-2">
                          $
                          <Input
                            defaultValue={item.unit_price}
                            onChange={(e) => {
                              itemOnChange(e, "unit_price", item);
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          $
                          {calcQuoteItemTotal({
                            id: item.id + "",
                            quantity: item.quantity || 0,
                            unit_price: item.unit_price || 0,
                          })}
                        </TableCell>
                        <TableCell className="flex w-fit justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="aspect-square p-0"
                            onClick={() => remove(i)}
                          >
                            <Minus size={16} className="text-orange-400" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow hidden={!form.formState.errors.items}>
                    <TableCell colSpan={7}>
                      <p className="text-center text-red-600">
                        {form.formState.errors.items?.message}
                      </p>
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={7}>
                      <DialogTrigger asChild>
                        <Button
                          type="button"
                          className="w-full"
                          variant="outline"
                        >
                          <Plus />
                        </Button>
                      </DialogTrigger>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </form>
      </Form>
      <QuoteItem
        onSubmit={(d) => {
          append(d);
          setDialogOpen(false);
        }}
      />
    </Dialog>
  );
};

export default QuoteCreate;
