"use client";

import { CustomTooltip } from "@components";
import { Permission } from "@modules/setting/models";
import { systemAxiosInstance } from "@modules/shared";
import { useQuery } from "@tanstack/react-query";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold">Available permissions</h2>
      {children}
    </section>
  );
}

export function PermissionSection() {
  const { data, isLoading } = useQuery({
    queryKey: ["permissions", { limit: 100 }],
    queryFn: async () => {
      const response = await systemAxiosInstance.get("/setting/permissions", {
        params: { limit: 100 },
      });
      return response.data.data.permissions as Permission[];
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="loader mx-auto my-4"></div>
      </Layout>
    );
  }

  return (
    <Layout>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(0,30ch))] gap-2">
        {data
          ? data.map((permission) => (
              <li
                key={permission.id}
                className="flex items-center gap-4 border p-2"
              >
                <div className="flex aspect-square h-full select-none items-center justify-center rounded bg-gray-600 font-bold text-secondary">
                  {permission.id}
                </div>
                <CustomTooltip content={permission.name}>
                  <div className="cursor-pointer overflow-hidden">
                    {permission.name}
                  </div>
                </CustomTooltip>
              </li>
            ))
          : null}
      </ul>
    </Layout>
  );
}
