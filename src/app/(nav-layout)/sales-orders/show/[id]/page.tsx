"use client";

import { CustomTooltip } from "@components";
import { Button } from "@components/ui/button";
import { cn } from "@lib/utils";
import { SalesOrderSchema } from "@models/sales-order";
import { axiosInstance } from "@providers/data-provider";
import { useNavigation, useOne } from "@refinedev/core";
import { format } from "date-fns";
import { Book, Edit, List, User } from "lucide-react";
import React from "react";
import * as z from "zod";

type SalesOrderState = "ON-GOING" | "SENT" | "DONE" | "CANCEL";

const action = async (
  id: string,
  state: SalesOrderState,
  onSuccess: () => unknown,
) => {
  const { code } = await axiosInstance
    .post(`/sales-orders/${id}/status`, {
      action: state,
    })
    .then((res) => res.data satisfies { code: number });

  if (code !== 200) {
    // Handle error
    return;
  }

  onSuccess();
};

const SalesOrderShow = ({ params }: { params: { id: string } }) => {
  const { data, isLoading, refetch } = useOne<z.infer<typeof SalesOrderSchema>>(
    {
      resource: "sales-orders",
      id: params.id,
    },
  );

  const { list, edit, show } = useNavigation();

  return (
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
              onClick={() => list("sales-orders")}
              className="mr-auto"
            >
              <List />
            </Button>
            {data?.data.status.toUpperCase() === "ON-GOING" && (
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
                  onClick={() => action(params.id, "DONE", refetch)}
                  className="px-4"
                >
                  Done
                </Button>
                <Button
                  variant="outline"
                  onClick={() => action(params.id, "CANCEL", refetch)}
                  className="px-4"
                >
                  Cancel
                </Button>
              </>
            )}
            <Button
              size={"icon"}
              variant={"outline"}
              onClick={() => edit("sales-orders", params.id)}
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
                  <CustomTooltip content="Sales order's accept date">
                    <p>
                      {data?.data.accept_date
                        ? format(data.data.accept_date, "PP")
                        : null}
                    </p>
                  </CustomTooltip>
                  <span>-</span>
                  <CustomTooltip content="Sales order's delivery date">
                    <p>
                      {data?.data.delivery_date
                        ? format(data.data.delivery_date, "PP")
                        : null}
                    </p>
                  </CustomTooltip>
                </div>
              </div>
              <div className="flex gap-2">
                <CustomTooltip content="View sales order's quote">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => show("quotes", data?.data.quote_id || "")}
                  >
                    <Book />
                  </Button>
                </CustomTooltip>
                <CustomTooltip content="View sales order's created by">
                  <Button
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
            <div className="flex rounded-lg p-2 px-4 outline-dashed outline-1 outline-primary/50">
              <p
                className={cn(
                  !data?.data.note
                    ? `w-full pt-10 text-center text-muted-foreground`
                    : "",
                  "min-h-32",
                )}
              >
                {data?.data.note || "- No note provided. -"}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SalesOrderShow;
