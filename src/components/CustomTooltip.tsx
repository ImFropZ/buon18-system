"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";

interface CustomTooltipProps {
  children: React.ReactNode;
  content: string;
}

interface CustomErrorTooltipWrapperProps {
  children: React.ReactNode;
  errorMessage: string;
}

export const CustomTooltip = React.forwardRef<
  React.ComponentPropsWithoutRef<typeof Tooltip>,
  CustomTooltipProps
>((props, _) => (
  <Tooltip>
    <TooltipTrigger asChild>{props.children}</TooltipTrigger>
    {props.content ? <TooltipContent>{props.content}</TooltipContent> : null}
  </Tooltip>
));

CustomTooltip.displayName = "CustomTooltip";

export const CustomErrorTooltipWrapper = React.forwardRef<
  React.ComponentPropsWithoutRef<typeof CustomTooltip>,
  CustomErrorTooltipWrapperProps
>(({ children, errorMessage }, ref) => {
  return (
    <CustomTooltip content={errorMessage} ref={ref}>
      {children}
    </CustomTooltip>
  );
});

CustomErrorTooltipWrapper.displayName = "CustomErrorTooltipWrapper";
