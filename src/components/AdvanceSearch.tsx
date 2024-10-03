import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { cn } from "@lib/utils";

interface AdvanceSearchProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  items: React.JSX.Element[];
  onConfirm: () => void;
}

export function AdvanceSearch({
  title,
  description,
  items,
  onConfirm,
  ...props
}: AdvanceSearchProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Advance Search</Button>
      </SheetTrigger>
      <SheetContent
        {...props}
        className={cn(
          "grid grid-rows-[auto,auto,1fr,auto] md:min-w-[32rem]",
          props.className,
        )}
      >
        <SheetTitle>{title}</SheetTitle>
        <SheetDescription>{description}</SheetDescription>
        <div className="flex flex-col gap-4">{items}</div>
        <SheetFooter>
          <SheetClose asChild>
            <Button onClick={() => onConfirm()}>Confirm Search</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
