"use client";

import { customerResponseSchema } from "@modules/setting/models";
import { systemAxiosInstance } from "@modules/shared";
import { UpdateCustomerForm } from "@modules/setting/components";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative grid h-full grid-rows-[auto,1fr] gap-2 p-4">
      <h1 className="text-2xl font-bold">Edit Customer</h1>
      {children}
    </main>
  );
}

export default function Page({ params }: { params: { id: number } }) {
  const { data, isLoading } = useQuery({
    queryKey: ["customers", { id: params.id }],
    queryFn: async () => {
      return await systemAxiosInstance
        .get(`/setting/customers/${params.id}`)
        .then((res) => {
          const result = customerResponseSchema.safeParse(res.data);
          if (!result.success) {
            console.error(result.error.errors);
            return Promise.reject(result.error.errors);
          }
          return result.data.data.customer;
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
      <UpdateCustomerForm data={data} />
    </Layout>
  );
}
