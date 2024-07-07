"use client";

import { SocialMedia } from "@components";
import { Button } from "@components/ui/button";
import { Account } from "@models/account";
import { useNavigation, useOne } from "@refinedev/core";
import { ArrowLeft, List } from "lucide-react";

import React from "react";

const AccountShow = ({ params }: { params: { id: string } }) => {
  const { data, isLoading } = useOne<Account>({
    resource: "accounts",
    id: params.id,
  });

  const { list, goBack } = useNavigation();

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-lg px-1 pb-2">
      <div className="flex gap-2">
        <Button
          size={"icon"}
          variant={"outline"}
          onClick={() => goBack()}
        >
          <ArrowLeft />
        </Button>
        <Button
          size={"icon"}
          variant={"outline"}
          onClick={() => list("accounts")}
          className="ml-auto"
        >
          <List />
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
              <p>Account</p>
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
                  Gender:
                </h2>
                <p>
                  {data?.data?.gender == "M"
                    ? "Male"
                    : data?.data?.gender == "F"
                      ? "Female"
                      : "Unknown"}
                </p>
              </div>
            </div>
            <div className="p-2">
              <div className="grid grid-cols-2 items-center border-b-2 pb-2">
                <h2 className="scroll-m-20 px-2 font-bold tracking-tight lg:text-xl">
                  Email:
                </h2>
                <p>{data?.data?.email || "No Email"}</p>
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
                  Secondary Phone:
                </h2>
                <p>{data?.data?.secondary_phone || "No Secondary Phone"}</p>
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

export default AccountShow;
