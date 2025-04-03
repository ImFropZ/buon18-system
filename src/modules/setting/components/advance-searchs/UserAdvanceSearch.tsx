"use client";

import { AdvanceSearch, SearchPopover } from "@components";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import React from "react";
import { systemAxiosInstance } from "@modules/shared";
import { Button } from "@components/ui/button";

interface UserAdvanceSearchProps {
  defaultValues: { id: number | null; schoolId: number | null };
  onConfirm: (args: { id: number | null; schoolId: number | null }) => void;
}

export function UserAdvanceSearch({
  defaultValues,
  onConfirm,
}: UserAdvanceSearchProps) {
  const idInputRef = React.useRef<HTMLInputElement>(null);
  const [school, setSchool] = React.useState<null | {
    id: number;
    name: string;
  }>(
    defaultValues.schoolId
      ? {
          id: +defaultValues.schoolId,
          name: "(not loaded)",
        }
      : null,
  );

  return (
    <AdvanceSearch
      title="Advance major search"
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
        <div className="flex flex-col gap-4" key="school-id-search">
          <Label>School</Label>
          <div className="flex gap-2">
            <SearchPopover
              id="school"
              fetchResource={async (searchPharse) => {
                const res = await systemAxiosInstance.get(`/admin/schools`, {
                  params: { ["name:ilike"]: searchPharse },
                });
                return res.data.data.schools;
              }}
              onSelected={(d) => {
                setSchool({ id: d.id, name: d.name });
              }}
              getLabel={(d) => {
                return `${d.id} ${d.name}`;
              }}
              optionValue="id"
              value={school}
              placeholder="Select school"
            />
            <Button
              disabled={!school}
              onClick={() => {
                setSchool(null);
              }}
            >
              Clear
            </Button>
          </div>
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
          schoolId: school?.id || null,
        });
      }}
    />
  );
}
