"use client";

import { userResponseSchema } from "@modules/setting/models";
import { systemAxiosInstance } from "@modules/shared";
import { UpdateUserForm } from "@modules/setting/components";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative grid h-full grid-rows-[auto,1fr] gap-2 p-4">
      <h1 className="text-2xl font-bold">Edit User</h1>
      {children}
    </main>
  );
}

export default function Page({ params }: { params: { id: number } }) {
  const { data, isLoading } = useQuery({
    queryKey: ["users", { id: params.id }],
    queryFn: async () => {
      return await systemAxiosInstance
        .get(`/setting/users/${params.id}`)
        .then((res) => {
          const result = userResponseSchema.safeParse(res.data);
          if (!result.success) {
            console.error(result.error.errors);
            return Promise.reject(result.error.errors);
          }
          return result.data.data.user;
        });
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="loader mx-auto mt-20" />
      </Layout>
    );
  }
  if (!data) {
    return notFound();
  }

  return (
    <Layout>
      <UpdateUserForm data={data} />
    </Layout>
  );
}
