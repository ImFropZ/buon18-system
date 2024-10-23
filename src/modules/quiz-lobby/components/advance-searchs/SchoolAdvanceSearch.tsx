"use client";

import { AdvanceSearch } from "@components";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import React from "react";

interface SchoolAdvanceSearchProps {
  defaultValues: { id: number | null };
  onConfirm: (args: { id: number | null }) => void;
}

export function SchoolAdvanceSearch({
  defaultValues,
  onConfirm,
}: SchoolAdvanceSearchProps) {
  const idInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <AdvanceSearch
      title="Advance school search"
      description="If you want to do a more specific search, you can use this feature."
      items={[
        <div className="flex flex-col gap-4" key="id-search">
          <Label>
            ID{" "}
            <span className="rounded bg-gray-500 px-2 py-1 text-secondary">
              number only
            </span>
          </Label>
          <Input
            ref={idInputRef}
            placeholder="ID"
            defaultValue={defaultValues.id ?? undefined}
          />
        </div>,
      ]}
      onConfirm={() => {
        if (!idInputRef.current) return;

        onConfirm({
          id:
            idInputRef.current.value === ""
              ? null
              : Number.isNaN(+idInputRef.current.value)
                ? null
                : +idInputRef.current.value,
        });
      }}
    />
  );
}
