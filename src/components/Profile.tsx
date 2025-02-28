"use client";

import { useQuery } from "@tanstack/react-query";
import { AtSign, Fingerprint, Mail, User } from "lucide-react";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { UpdatePassword, UpdateProfile } from "@/components";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { systemAxiosInstance } from "@modules/shared";
import { userSchema } from "@models/auth";

export function Profile() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      return await systemAxiosInstance.get(`/auth/me`).then((res) => {
        const result = userSchema.safeParse(res.data.data.user);
        if (!result.success) {
          console.error(result.error.errors);
          return undefined;
        }
        return result.data;
      });
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="group flex w-fit cursor-pointer items-center gap-2 rounded px-2 py-1 outline outline-1 outline-primary/20 transition-all hover:outline-primary">
          <User
            className="rounded bg-primary p-1 text-secondary opacity-70 transition-all group-hover:opacity-100"
            size={32}
          />
          <Skeleton
            className="h-7 w-20 data-[loading='false']:hidden"
            data-loading={isLoading}
          />
          <span
            className="font-bold data-[loading='true']:hidden"
            data-loading={isLoading}
          >
            {data?.name}
          </span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Profile</DialogTitle>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">{data?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Fingerprint />
              <span className="text-sm font-bold">
                {data?.role ? data.role.name : null}
              </span>
            </div>
          </div>
          <div className="my-2 flex flex-col gap-2 p-2">
            <div className="flex items-center gap-2">
              <AtSign className="rounded-lg" />
              <span className="text-sm font-bold">{data?.type}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="rounded-lg" />
              <span className="text-sm font-bold">{data?.email}</span>
            </div>

            <div className="mt-4 flex gap-2">
              <UpdateProfile defaultValues={data} refetch={refetch} />
              <UpdatePassword />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
