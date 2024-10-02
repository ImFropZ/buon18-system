"use client";

import React, { HTMLAttributes } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@lib/utils";

interface SearchBarProps extends HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export function SearchBar({
  defaultValue,
  placeholder,
  onSearch,
  ...props
}: SearchBarProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className={cn("flex min-w-96 gap-2", props.className)}>
      <Input
        className="flex-1"
        placeholder={placeholder ?? "Search ..."}
        ref={inputRef}
        defaultValue={defaultValue}
      />
      <Button
        onClick={() => {
          if (onSearch) {
            onSearch(inputRef.current?.value ?? "");
          }
        }}
      >
        <Search />
      </Button>
    </div>
  );
}
