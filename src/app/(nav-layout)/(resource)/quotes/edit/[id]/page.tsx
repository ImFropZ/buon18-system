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
import { Quote, QuoteEditSchema, QuoteItemEditSchema } from "@models/quote";
import { useNavigation, useOne, useUpdate } from "@refinedev/core";
import {
  Building,
  Check,
  Eye,
  List,
  Minus,
  Plus,
  Undo,
  Users,
} from "lucide-react";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

const QuoteEdit = ({ params }: { params: { id: string } }) => {
  const { mutate } = useUpdate();
  const { data, isLoading } = useOne<Quote>({
    resource: "quotes",
    id: params.id,
  });
  const form = useForm<z.infer<typeof QuoteEditSchema>>({
    resolver: zodResolver(QuoteEditSchema),
  });
  const { fields, update, append } = useFieldArray({
    control: form.control,
    name: "items",
    keyName: "uuid",
  });
  const [itemDeleteIds, setItemDeleteIds] = React.useState<number[]>([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { list, show } = useNavigation();
  const { toast } = useToast();

  const onSubmit = (data: z.infer<typeof QuoteEditSchema>) => {
    mutate(
      {
        id: params.id,
        resource: "quotes",
        values: {
          ...data,
          delete_item_ids: itemDeleteIds,
        },
      },
      {
        onSuccess: () => show("quotes", params.id),
        onError: (error) => {
          toast({
            title: "Update Quote Error",
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

    append({
      ...item,
      [fieldChange]: e.target.value,
    });
  };

  const calcSubtotal = () => {
    const fieldTotal = fields.reduce((acc, item) => {
      return acc + (item.quantity || 0) * (item.unit_price || 0);
    }, 0);
    const dataTotal =
      data?.data.items
        .filter(
          (item) =>
            !itemDeleteIds.includes(Number(item.id)) &&
            fields.findIndex((d) => d.id == item.id) === -1,
        )
        .reduce((acc, item) => {
          return acc + item.quantity * item.unit_price;
        }, 0) || 0;
    return fieldTotal + dataTotal;
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
            {isLoading ? (
              <div className="grid place-content-center pt-10">
                <div className="loader"></div>
              </div>
            ) : (
              <>
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
                              defaultValue={data?.data.code}
                              errorField={form.formState.errors.code}
                              className="min-w-96 text-2xl font-bold"
                            />
                          )}
                        />
                        <p className="rounded-xl bg-primary px-2 text-secondary">
                          {data?.data.status}
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
                              _defaultValue={data?.data.date}
                              label="Date"
                            />
                          )}
                        />
                        <Minus className="mt-5" />
                        <FormField
                          control={form.control}
                          name="expiry_date"
                          render={({ field }) => (
                            <DateFormField
                              field={field}
                              errorField={form.formState.errors.expiry_date}
                              _defaultValue={data?.data.expiry_date}
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
                            defaultValue={data?.data.account_id + "" || ""}
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
                            defaultValue={data?.data.client_id + "" || ""}
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
                      {data?.data.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.id}</TableCell>
                          <TableCell>
                            <Input
                              defaultValue={item.name}
                              onChange={(e) => {
                                itemOnChange(e, "name", item);
                              }}
                              disabled={itemDeleteIds.includes(Number(item.id))}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              defaultValue={item.description}
                              onChange={(e) => {
                                itemOnChange(e, "description", item);
                              }}
                              disabled={itemDeleteIds.includes(Number(item.id))}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              defaultValue={item.quantity}
                              onChange={(e) => {
                                itemOnChange(e, "quantity", item);
                              }}
                              disabled={itemDeleteIds.includes(Number(item.id))}
                            />
                          </TableCell>
                          <TableCell className="flex items-center gap-2">
                            $
                            <Input
                              defaultValue={item.unit_price}
                              onChange={(e) => {
                                itemOnChange(e, "unit_price", item);
                              }}
                              disabled={itemDeleteIds.includes(Number(item.id))}
                            />
                          </TableCell>
                          <TableCell>
                            $
                            {calcQuoteItemTotal({
                              id: item.id + "",
                              quantity: item.quantity,
                              unit_price: item.unit_price,
                            })}
                          </TableCell>
                          <TableCell className="flex w-fit justify-end gap-2">
                            {itemDeleteIds.includes(Number(item.id)) ? (
                              <Button
                                type="button"
                                variant="outline"
                                className="aspect-square p-0"
                                onClick={() => {
                                  setItemDeleteIds((prev) => {
                                    return prev.filter(
                                      (id) => id !== Number(item.id),
                                    );
                                  });
                                }}
                              >
                                <Undo size={16} className="text-yellow-400" />
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                variant="outline"
                                className="aspect-square p-0"
                                onClick={() => {
                                  setItemDeleteIds((prev) => {
                                    return [...prev, Number(item.id)];
                                  });
                                }}
                              >
                                <Minus size={16} className="text-orange-400" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      {fields
                        .filter((item) => !item.id)
                        .map((item, i) => {
                          return (
                            <TableRow key={item.id || i}>
                              <TableCell>
                                {item.id || (
                                  <span className="text-muted-foreground">
                                    None
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                <Input
                                  defaultValue={item.name}
                                  onChange={(e) => {
                                    itemOnChange(e, "name", item);
                                  }}
                                  disabled={itemDeleteIds.includes(
                                    Number(item.id),
                                  )}
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  defaultValue={item.description}
                                  onChange={(e) => {
                                    itemOnChange(e, "description", item);
                                  }}
                                  disabled={itemDeleteIds.includes(
                                    Number(item.id),
                                  )}
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  defaultValue={item.quantity}
                                  onChange={(e) => {
                                    itemOnChange(e, "quantity", item);
                                  }}
                                  disabled={itemDeleteIds.includes(
                                    Number(item.id),
                                  )}
                                />
                              </TableCell>
                              <TableCell className="flex items-center gap-2">
                                $
                                <Input
                                  defaultValue={item.unit_price}
                                  onChange={(e) => {
                                    itemOnChange(e, "unit_price", item);
                                  }}
                                  disabled={itemDeleteIds.includes(
                                    Number(item.id),
                                  )}
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
                                {itemDeleteIds.includes(Number(item.id)) ? (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="aspect-square p-0"
                                    onClick={() => {
                                      setItemDeleteIds((prev) => {
                                        return prev.filter(
                                          (id) => id !== Number(item.id),
                                        );
                                      });
                                    }}
                                  >
                                    <Undo
                                      size={16}
                                      className="text-yellow-400"
                                    />
                                  </Button>
                                ) : (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="aspect-square p-0"
                                    onClick={() => {
                                      setItemDeleteIds((prev) => {
                                        return [...prev, Number(item.id)];
                                      });
                                    }}
                                  >
                                    <Minus
                                      size={16}
                                      className="text-orange-400"
                                    />
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
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
              </>
            )}
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

export default QuoteEdit;
