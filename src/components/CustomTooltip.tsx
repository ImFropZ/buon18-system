"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";

interface CustomTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
}

export function CustomTooltip({ children, content }: CustomTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent asChild>{content}</TooltipContent>
    </Tooltip>
  );
}
