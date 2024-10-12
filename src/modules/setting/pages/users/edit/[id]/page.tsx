"use client";

import { User } from "@modules/setting/models";
import { systemAxiosInstance } from "@modules/shared";
import { UpdateUserForm } from "@modules/setting/components";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative grid h-full grid-rows-[auto,1fr] gap-2 p-4">
      <h1 className="text-2xl font-bold">Edit user</h1>
      {children}
    </main>
  );
}

export default function Page({ params }: { params: { id: number } }) {
  const { data, isLoading } = useQuery({
    queryKey: ["users", { id: params.id }],
    queryFn: async () => {
      const response = await systemAxiosInstance.get(
        `/setting/users/${params.id}`,
      );
      return response.data.data.user as User;
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
