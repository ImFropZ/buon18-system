import { ExternalLink } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import React from "react";
import type { SocialMedia } from "@models";

export function SocialMedia({ platform, url }: SocialMedia) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          href={url}
          target="_blank"
          className="flex items-center justify-between gap-5 rounded-lg px-4 py-2 outline outline-[2px] outline-muted dark:hover:bg-slate-800 hover:bg-slate-200"
        >
          <h3 className="scroll-m-20 text-base font-bold capitalize tracking-tight lg:text-lg">
            {platform}
          </h3>
          <p className="ml-auto text-muted-foreground">
            {url.length > 20 ? url.slice(0, 20) + "..." : url}
          </p>
          <ExternalLink />
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        <Tooltip>{url}</Tooltip>
      </TooltipContent>
    </Tooltip>
  );
}
