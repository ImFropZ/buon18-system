"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import React from "react";

const queryClient = new QueryClient();

export function QueryClientContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
