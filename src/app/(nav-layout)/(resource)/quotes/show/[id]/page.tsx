"use client";

import { CustomTooltip } from "@components";
import { SalesOrder } from "@components/modal";
import { Button } from "@components/ui/button";
import { Dialog, DialogTrigger } from "@components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { cn } from "@lib/utils";
import { Quote } from "@models/quote";
import { SalesOrderCreateSchema } from "@models/sales-order";
import { axiosInstance } from "@providers/data-provider";
import { useNavigation, useOne } from "@refinedev/core";
import { format } from "date-fns";
import { Building, Edit, List, Users } from "lucide-react";
import React from "react";
import * as z from "zod";

type QuoteState = "DRAFT" | "SENT" | "ACCEPT" | "REJECT";

const action = async (
  id: string,
  state: QuoteState,
  onSuccess: () => unknown,
) => {
  const { code } = await axiosInstance
    .post(`/quotes/${id}/status`, {
      action: state,
    })
    .then((res) => res.data satisfies { code: number });

  if (code !== 200) {
    // Handle error
    return;
  }

  onSuccess();
};

const generateSalesOrder = async (
  quoteId: string,
  data: z.infer<typeof SalesOrderCreateSchema>,
) => {
  const { code } = await axiosInstance
    .post(`/quotes/${quoteId}/sales-order`, data)
    .then((res) => res.data satisfies { code: number });

  if (code > 299) {
    // Handle error
    return;
  }
};

const QuoteShow = ({ params }: { params: { id: string } }) => {
  const { data, isLoading, refetch } = useOne<Quote>({
    resource: "quotes",
    id: params.id,
  });
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const { list, edit, show } = useNavigation();

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <div className="relative flex h-full flex-col gap-2 overflow-hidden rounded-lg px-1 pb-2">
        {isLoading ? (
          <div className="grid place-content-center pt-10">
            <div className="loader"></div>
          </div>
        ) : (
          <>
            <div className="flex justify-end gap-2">
              <Button
                size={"icon"}
                variant={"outline"}
                onClick={() => list("quotes")}
                className="mr-auto"
              >
                <List />
              </Button>
              {data?.data.status.toUpperCase() === "DRAFT" && (
                <Button
                  variant="outline"
                  onClick={() => action(params.id, "SENT", refetch)}
                  className="px-4"
                >
                  Sent
                </Button>
              )}
              {data?.data.status.toUpperCase() === "SENT" && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => action(params.id, "ACCEPT", refetch)}
                    className="px-4"
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => action(params.id, "REJECT", refetch)}
                    className="px-4"
                  >
                    Reject
                  </Button>
                </>
              )}
              {data?.data.status.toUpperCase() === "ACCEPT" && (
                <DialogTrigger asChild>
                  <Button type="button" variant="outline" className="px-4">
                    Generate Sales Order
                  </Button>
                </DialogTrigger>
              )}
              <Button
                size={"icon"}
                variant={"outline"}
                onClick={() => edit("quotes", params.id)}
              >
                <Edit />
              </Button>
            </div>
            <div className="h-full rounded border px-4">
              <div className="flex justify-between py-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center">
                    <h1 className="min-w-96 text-2xl font-bold">
                      {data?.data.code}
                    </h1>
                    <p className="rounded-xl bg-primary px-2 text-secondary">
                      {data?.data.status}
                    </p>
                  </div>
                  <div className="flex gap-2 pl-4">
                    <CustomTooltip content="Quote's date">
                      <p>
                        {data?.data.date ? format(data.data.date, "PP") : null}
                      </p>
                    </CustomTooltip>
                    <span>-</span>
                    <CustomTooltip content="Quote's expiry date">
                      <p>
                        {data?.data.expiry_date
                          ? format(data.data.expiry_date, "PP")
                          : null}
                      </p>
                    </CustomTooltip>
                  </div>
                </div>
                <div className="flex gap-2">
                  <CustomTooltip content="View quote's account">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        show("accounts", data?.data.account_id || "")
                      }
                    >
                      <Users />
                    </Button>
                  </CustomTooltip>
                  <CustomTooltip content="View quote's client">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        show("clients", data?.data.client_id || "")
                      }
                    >
                      <Building />
                    </Button>
                  </CustomTooltip>
                </div>
              </div>
              <div className="flex rounded-lg p-2 px-4 outline-dashed outline-1 outline-primary/50">
                <p
                  className={cn(
                    !data?.data.note
                      ? `w-full pt-12 text-center text-muted-foreground`
                      : "",
                    "min-h-32",
                  )}
                >
                  {data?.data.note || "- No note provided. -"}
                </p>
              </div>
              <Table className="mx-auto my-2 w-4/5 max-w-[64rem] text-base">
                <TableCaption className="text-base">
                  <div className="ml-auto grid max-w-[20%] grid-cols-2">
                    <p className="text-end">Subtotal:</p>
                    <span className="text-end">${data?.data.subtotal}</span>
                  </div>
                  <div className="ml-auto grid max-w-[20%] grid-cols-2">
                    <p className="text-end">Discount:</p>
                    <span className="text-end">${data?.data.discount}</span>
                  </div>
                  <div className="ml-auto grid max-w-[20%] grid-cols-2">
                    <p className="text-end">Total:</p>
                    <span className="text-end">${data?.data.total}</span>
                  </div>
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${item.unit_price}</TableCell>
                      <TableCell className="text-right">
                        ${item.quantity * item.unit_price}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>
      <SalesOrder
        onSuccess={async (d) => {
          generateSalesOrder(params.id, d).then(() => {
            setDialogOpen(false);
          });
        }}
      />
    </Dialog>
  );
};

export default QuoteShow;
