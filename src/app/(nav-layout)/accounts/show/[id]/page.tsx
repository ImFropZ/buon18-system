"use client";

import { Account } from "@models/account";
import { useOne } from "@refinedev/core";
import { ExternalLink } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import React from "react";

const AccountShow = ({ params }: { params: { id: string } }) => {
  const { data, isLoading } = useOne<Account>({
    resource: "accounts",
    id: params.id,
  });

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg px-1">
      {isLoading ? (
        <div className="grid place-content-center pt-10">
          <div className="loader" aria-label="loader"></div>
        </div>
      ) : (
        <div className="grid flex-1 grid-cols-[1fr,1fr] gap-5 pt-2">
          <div className="h-full overflow-hidden rounded-2xl outline outline-[2px] outline-muted">
            <p className="bg-slate-700 p-4 text-2xl font-bold">
              {data?.data?.code}
            </p>
            <div className="p-2">
              <div className="grid grid-cols-2 items-center border-b-2 pb-2">
                <h2 className="scroll-m-20 px-2 text-lg font-bold tracking-tight lg:text-xl">
                  Name:
                </h2>
                <div>{data?.data?.name}</div>
              </div>
            </div>
            <div className="p-2">
              <div className="grid grid-cols-2 items-center border-b-2 pb-2">
                <h2 className="scroll-m-20 px-2 text-lg font-bold tracking-tight lg:text-xl">
                  Gender:
                </h2>
                <div>
                  {data?.data?.gender == "M"
                    ? "Male"
                    : data?.data?.gender == "F"
                      ? "Female"
                      : "Unknown"}
                </div>
              </div>
            </div>
            <div className="p-2">
              <div className="grid grid-cols-2 items-center border-b-2 pb-2">
                <h2 className="scroll-m-20 px-2 text-lg font-bold tracking-tight lg:text-xl">
                  Email:
                </h2>
                <div>{data?.data?.email || "No Email"}</div>
              </div>
            </div>
            <div className="p-2">
              <div className="grid grid-cols-2 items-center border-b-2 pb-2">
                <h2 className="scroll-m-20 px-2 text-lg font-bold tracking-tight lg:text-xl">
                  Address:
                </h2>
                <div>{data?.data?.address || "No Address"}</div>
              </div>
            </div>
            <div className="p-2">
              <div className="grid grid-cols-2 items-center border-b-2 pb-2">
                <h2 className="scroll-m-20 px-2 text-lg font-bold tracking-tight lg:text-xl">
                  Phone:
                </h2>
                <div>{data?.data?.phone}</div>
              </div>
            </div>
            <div className="p-2">
              <div className="grid grid-cols-2 items-center border-b-2 pb-2">
                <h2 className="scroll-m-20 px-2 text-lg font-bold tracking-tight lg:text-xl">
                  Secondary Phone:
                </h2>
                <div>{data?.data?.secondary_phone || "No Secondary Phone"}</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="mb-5 scroll-m-20 text-lg font-extrabold tracking-tight lg:text-xl">
              Social Media
            </h2>
            {data?.data.social_medias.length != 0 ? (
              data?.data.social_medias.map((socialMedia, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger>
                    <Link
                      href={socialMedia.url}
                      target="_blank"
                      className="flex items-center justify-between gap-5 rounded-lg px-4 py-2 outline outline-[2px] outline-muted hover:bg-slate-800"
                    >
                      <h3 className="scroll-m-20 text-base font-bold capitalize tracking-tight lg:text-lg">
                        {socialMedia.platform}
                      </h3>
                      <p className="ml-auto text-muted-foreground">
                        {socialMedia.url.length > 20
                          ? socialMedia.url.slice(0, 20) + "..."
                          : socialMedia.url}
                      </p>
                      <ExternalLink />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <Tooltip>{socialMedia.url}</Tooltip>
                  </TooltipContent>
                </Tooltip>
              ))
            ) : (
              <p>No Social Media</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountShow;
