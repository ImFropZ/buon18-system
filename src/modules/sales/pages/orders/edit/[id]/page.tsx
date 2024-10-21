"use client";

import { Order } from "@modules/sales/models";
import { UpdateOrderForm } from "@modules/sales/components/forms";
import { systemAxiosInstance } from "@modules/shared";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative grid h-full grid-rows-[auto,1fr] gap-2 p-4">
      <h1 className="text-2xl font-bold">Edit order</h1>
      {children}
    </main>
  );
}

export default function Page({ params }: { params: { id: string } }) {
  const { data, isLoading } = useQuery({
    queryKey: ["orders", { id: params.id }],
    queryFn: async () => {
      const response = await systemAxiosInstance.get(
        `/sales/orders/${params.id}`,
      );
      return response.data.data.order as Order;
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
      <UpdateOrderForm data={data} />
    </Layout>
  );
}