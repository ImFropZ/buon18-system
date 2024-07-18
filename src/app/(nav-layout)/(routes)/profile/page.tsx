"use client";

import React from "react";
import { axiosInstance } from "@providers/data-provider";
import { Button } from "@components/ui/button";
import { Edit } from "lucide-react";
import { Dialog, DialogTrigger } from "@components/ui/dialog";
import { UpdatePasswordProfile } from "@components/modal";
import { UpdatePasswordSchema } from "@models/auth";
import * as z from "zod";

export default function ProfilePage() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [data, setData] = React.useState<{
    role: string;
    name: string;
    email: string;
  }>();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    getData()
      .then((res) => {
        setData(res.data.user);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <div className="relative flex h-full flex-col overflow-hidden px-1 pb-2">
        {isLoading ? (
          <div className="relative grid h-full place-content-center rounded-lg border">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="relative flex h-full flex-col items-center gap-5 rounded-lg border">
            <DialogTrigger asChild>
              <Button
                type="button"
                className="absolute right-3 top-3"
                variant="outline"
              >
                Update Password
              </Button>
            </DialogTrigger>
            <div className="relative mt-20 aspect-square h-32 w-32 overflow-hidden rounded-full">
              <img
                src="https://placehold.co/100"
                alt=""
                className="h-full w-full"
              />
            </div>
            <p className="rounded px-2 outline outline-2">
              {data?.role ? data.role : ""}
            </p>
            <h1 className="text-2xl font-bold">{data?.name}</h1>
            <div className="flex min-w-96 flex-col gap-2">
              <p className="font-bold text-xl">Email: </p>
              <p className="border-b-4 px-4 py-1 text-lg">{data?.email}</p>
            </div>
          </div>
        )}
      </div>
      <UpdatePasswordProfile
        onSuccess={(data) => {
          updatePassword(data).then((data) => {
            const { code } = data;
            if (code !== 200) {
              // Handle error
              return;
            }

            setDialogOpen(false);
          });
        }}
      />
    </Dialog>
  );
}

const updatePassword = async (data: z.infer<typeof UpdatePasswordSchema>) => {
  return await axiosInstance
    .post("/update-password", data)
    .then((res) => res.data);
};

const getData = async () => {
  return await axiosInstance.get("/me").then((res) => res.data);
};
