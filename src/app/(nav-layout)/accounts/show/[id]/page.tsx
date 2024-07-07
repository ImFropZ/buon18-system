"use client";

import { Account } from "@models/account";
import { useOne } from "@refinedev/core";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import React from "react";

const AccountShow = ({ params }: { params: { id: string } }) => {
  const { data, isLoading } = useOne<Account>({
    resource: "accounts",
    id: params.id,
  });

  return (
    <div className="h-full overflow-hidden rounded-lg border p-2">
      <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl">
        Account
      </h1>
      {isLoading ? (
        <div className="grid place-content-center pt-10">
          <div className="loader" aria-label="loader"></div>
        </div>
      ) : (
        <div className="grid h-full grid-rows-[auto,1fr] gap-5 px-2 pt-2 md:grid-cols-[1fr,1fr]">
          <div className="">
            <div className="grid grid-cols-2 items-center border-b-2">
              <h2 className="scroll-m-20 text-lg font-bold tracking-tight lg:text-xl">
                Code:
              </h2>
              <div>{data?.data?.code}</div>
            </div>
            <div className="grid grid-cols-2 items-center border-b-2">
              <h2 className="scroll-m-20 text-lg font-bold tracking-tight lg:text-xl">
                Name:
              </h2>
              <div>{data?.data?.name}</div>
            </div>
            <div className="grid grid-cols-2 items-center border-b-2">
              <h2 className="scroll-m-20 text-lg font-bold tracking-tight lg:text-xl">
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
            <div className="grid grid-cols-2 items-center border-b-2">
              <h2 className="scroll-m-20 text-lg font-bold tracking-tight lg:text-xl">
                Email:
              </h2>
              <div>{data?.data?.email || "No Email"}</div>
            </div>
            <div className="grid grid-cols-2 items-center border-b-2">
              <h2 className="scroll-m-20 text-lg font-bold tracking-tight lg:text-xl">
                Address:
              </h2>
              <div>{data?.data?.address || "No Address"}</div>
            </div>
            <div className="grid grid-cols-2 items-center border-b-2">
              <h2 className="scroll-m-20 text-lg font-bold tracking-tight lg:text-xl">
                Phone:
              </h2>
              <div>{data?.data?.phone}</div>
            </div>
            <div className="grid grid-cols-2 items-center border-b-2">
              <h2 className="scroll-m-20 text-lg font-bold tracking-tight lg:text-xl">
                Secondary Phone:
              </h2>
              <div>{data?.data?.secondary_phone || "No Secondary Phone"}</div>
            </div>
          </div>
          <div className="">
            <h2 className="scroll-m-20 text-lg font-extrabold tracking-tight lg:text-xl">
              Social Medias
            </h2>
            {data?.data.social_medias.length != 0 ? (
              data?.data.social_medias.map((socialMedia, index) => (
                <div key={index}>
                  <h3 className="scroll-m-20 text-base font-bold capitalize tracking-tight lg:text-lg">
                    {socialMedia.platform}
                  </h3>
                  <div className="flex gap-2">
                    <span>{socialMedia.url}</span>
                    <Link href={socialMedia.url} target="_blank">
                      <ExternalLink />
                    </Link>
                  </div>
                </div>
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
