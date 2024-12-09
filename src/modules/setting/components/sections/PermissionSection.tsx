"use client";

import { CustomTooltip } from "@components";
import { permissionsResponseSchema } from "@modules/setting/models";
import { systemAxiosInstance } from "@modules/shared";
import { useQuery } from "@tanstack/react-query";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative h-full grid-rows-[auto,1fr]">
      <h2 className="text-xl font-bold">Available permissions</h2>
      {children}
    </section>
  );
}

export function PermissionSection() {
  const { data, isLoading } = useQuery({
    queryKey: ["permissions", { limit: 100 }],
    queryFn: async () => {
      return await systemAxiosInstance
        .get("/setting/permissions", {
          params: { limit: 100 },
        })
        .then((res) => {
          const result = permissionsResponseSchema.safeParse(res.data);
          if (!result.success) {
            console.error(result.error.errors);
            return Promise.reject(result.error.errors);
          }
          return result.data.data.permissions;
        });
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
      <div className="relative h-full">
        <div className="absolute inset-0 grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] grid-rows-[repeat(auto-fit,3rem)] gap-2 overflow-y-auto p-4">
          {data
            ? data.map((permission) => (
                <div
                  key={permission.id}
                  className="flex items-center gap-4 border p-2"
                >
                  <div className="flex aspect-square h-full select-none items-center justify-center rounded bg-gray-600 font-bold text-secondary">
                    {permission.id}
                  </div>
                  <CustomTooltip content={permission.name}>
                    <p className="cursor-pointer overflow-hidden text-clip">
                      {permission.name}
                    </p>
                  </CustomTooltip>
                </div>
              ))
            : null}
        </div>
      </div>
    </Layout>
  );
}
