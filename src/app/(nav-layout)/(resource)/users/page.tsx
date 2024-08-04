"use client";

import { UserCreateSchema, UserSchema } from "@models/user";
import { columns } from "@components/table/users/columns";
import { useDelete, useList, useNavigation } from "@refinedev/core";
import { DataTable } from "@components/ui/data-table";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { CustomTooltip } from "@components";
import { Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePagination, useDebounce } from "@hooks";
import { utils } from "@lib/utils";
import React from "react";
import CustomPagination from "@components/CustomPagination";
import * as z from "zod";
import { Dialog, DialogTrigger } from "@components/ui/dialog";
import { User } from "@components/modal/User";
import { axiosInstance } from "@providers/data-provider";
import { useToast } from "@components/ui/use-toast";

const createUserData = async (data: z.infer<typeof UserCreateSchema>) => {
  const result = UserCreateSchema.safeParse(data);
  if (result.success) {
    return await axiosInstance
      .post("/users", result.data)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  }
};

export default function UserList() {
  const searchParams = useSearchParams();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [searchName, setSearchName] = React.useState("");
  const debouncedSearchName = useDebounce<string>({
    value: searchName,
    delay: utils.SEARCH_DEBOUNCE_DELAY,
  });

  const [limit, setLimit] = React.useState(
    Number(searchParams.get("limit")) || 10,
  );
  const [offset, setOffset] = React.useState(
    Number(searchParams.get("offset")) || 0,
  );

  const { create, list } = useNavigation();
  const { data, isLoading, refetch } = useList<z.infer<typeof UserSchema>>({
    resource: "users",
    filters: [
      {
        field: "name",
        operator: "contains",
        value: debouncedSearchName || null,
      },
    ],
    pagination: {
      pageSize: limit,
      current: offset / limit + 1,
    },
  });
  const { mutate } = useDelete();
  const router = useRouter();
  const { toast } = useToast();

  const { currentPage, back, next, go, hasPreviousPage, hasNextPage } =
    usePagination({
      page: offset / limit + 1,
      pageSize: limit,
      totalItems: data?.total ?? Number.MAX_SAFE_INTEGER,
      onChange: (pageNumber, { pageSize }) => {
        const url = new URL(window.location.href);
        url.searchParams.set("limit", pageSize.toString());
        url.searchParams.set(
          "offset",
          (pageSize * (pageNumber - 1)).toString(),
        );
        router.push(url.toString());

        setLimit(() => pageSize);
        setOffset(() => pageSize * (pageNumber - 1));
      },
    });

  return (
    <div className="mx-auto h-full">
      {isLoading ? (
        <div className="grid place-content-center pt-10">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="grid h-full grid-rows-[auto,1fr,auto]">
          <div className="mb-5 flex gap-3">
            <Input
              onChange={(e) => {
                go(1);
                setSearchName(e.target.value);
              }}
              className="max-w-96"
              value={searchName}
              placeholder="Search Name ..."
            />
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <CustomTooltip content="Create">
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      create("users");
                    }}
                    className="ml-auto"
                  >
                    <Plus />
                  </Button>
                </DialogTrigger>
              </CustomTooltip>
              <User
                isCreate
                onSubmit={(d) => {
                  createUserData(d).then((data) => {
                    if (data.code !== 201) {
                      toast({
                        title: "Create User Error",
                        description: data.message,
                      });
                      return;
                    }

                    setDialogOpen(false);
                    refetch();
                  });
                }}
              />
            </Dialog>
          </div>
          <DataTable
            columns={columns({
              onRefresh: refetch,
              _delete: (id) => {
                mutate(
                  {
                    resource: "users",
                    id: id,
                  },
                  {
                    onSuccess: () => {
                      list("users");
                    },
                  },
                );
              },
            })}
            data={data?.data || []}
          />
          <CustomPagination
            back={back}
            next={next}
            currentPage={currentPage}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            className="relative bottom-0 mb-3 flex justify-end"
          />
        </div>
      )}
    </div>
  );
}
