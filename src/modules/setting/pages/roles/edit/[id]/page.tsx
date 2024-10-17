"use client";

import { UpdateRoleForm } from "@modules/setting/components/forms/UpdateRoleForm";
import { Role } from "@modules/setting/models";
import { systemAxiosInstance } from "@modules/shared";
import { useQuery } from "@tanstack/react-query";
import { notFound, useRouter } from "next/navigation";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative grid h-full grid-rows-[auto,1fr] gap-2 p-4">
      <h1 className="text-2xl font-bold">Edit role</h1>
      {children}
    </main>
  );
}

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();

  if (params.id === "1") {
    router.push("/setting/roles");
  }

  const { data, isLoading } = useQuery({
    queryKey: ["roles", { id: params.id }],
    queryFn: async () => {
      const response = await systemAxiosInstance.get(
        `/setting/roles/${params.id}`,
      );
      return response.data.data.role as Role;
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
      <UpdateRoleForm data={data} />
    </Layout>
  );
}
