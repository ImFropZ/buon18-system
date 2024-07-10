"use client";

import { SocialMedia } from "@components";
import { Button } from "@components/ui/button";
import { Client } from "@models/client";
import { useNavigation, useOne } from "@refinedev/core";
import { Edit, List } from "lucide-react";

import React from "react";

const ClientShow = ({ params }: { params: { id: string } }) => {
  const { data, isLoading } = useOne<Client>({
    resource: "clients",
    id: params.id,
  });

  const { list, edit } = useNavigation();

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-lg px-1 pb-2">
      <div className="flex gap-2">
        <Button
          size={"icon"}
          variant={"outline"}
          onClick={() => list("clients")}
        >
          <List />
        </Button>
        <Button
          size={"icon"}
          variant={"outline"}
          onClick={() => edit("clients", params.id)}
          className="ml-auto"
        >
          <Edit />
        </Button>
      </div>
      {isLoading ? (
        <div className="grid place-content-center pt-10">
          <div className="loader" aria-label="loader"></div>
        </div>
      ) : (
        <div className="grid flex-1 grid-cols-[1fr,1fr] gap-5 pt-2">
          <div className="h-full overflow-hidden rounded-2xl outline outline-[2px] outline-muted">
            <div className="flex justify-between bg-primary p-4 text-2xl font-bold text-secondary">
              <p>Client</p>
              <p>{data?.data?.code}</p>
            </div>
            <div className="p-2">
              <div className="grid grid-cols-2 items-center border-b-2 pb-2">
                <h2 className="scroll-m-20 px-2 font-bold tracking-tight lg:text-xl">
                  Name:
                </h2>
                <p>{data?.data?.name}</p>
              </div>
            </div>
            <div className="p-2">
              <div className="grid grid-cols-2 items-center border-b-2 pb-2">
                <h2 className="scroll-m-20 px-2 font-bold tracking-tight lg:text-xl">
                  Address:
                </h2>
                <p>{data?.data?.address || "No Address"}</p>
              </div>
            </div>
            <div className="p-2">
              <div className="grid grid-cols-2 items-center border-b-2 pb-2">
                <h2 className="scroll-m-20 px-2 font-bold tracking-tight lg:text-xl">
                  Phone:
                </h2>
                <p>{data?.data?.phone}</p>
              </div>
            </div>
            <div className="p-2">
              <div className="grid grid-cols-2 items-center border-b-2 pb-2">
                <h2 className="scroll-m-20 px-2 font-bold tracking-tight lg:text-xl">
                  Latitude:
                </h2>
                <p>{data?.data?.latitude}</p>
              </div>
            </div>
            <div className="p-2">
              <div className="grid grid-cols-2 items-center border-b-2 pb-2">
                <h2 className="scroll-m-20 px-2 font-bold tracking-tight lg:text-xl">
                  Longtitude:
                </h2>
                <p>{data?.data?.longitude}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="mb-5 scroll-m-20 font-extrabold tracking-tight lg:text-xl">
              Social Media
            </h2>
            <div className="flex flex-col gap-3">
              {data?.data.social_medias.length != 0 ? (
                data?.data.social_medias.map((socialMedia, index) => (
                  <SocialMedia key={index} {...socialMedia} />
                ))
              ) : (
                <p>No Social Media</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientShow;
