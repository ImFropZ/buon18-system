import React from "react";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { AdvanceSearch, SearchPopover } from "@components";
import { axiosInstance } from "@modules/lobby-serksa/fetch";
import { Button } from "@components/ui/button";

type SubjectValues = {
  id: number | null;
  semester: number | null;
  year: number | null;
  majorId: number | null;
  schoolId: number | null;
};

interface SubjectAdvanceSearchProps {
  defaultValues: SubjectValues;
  onConfirm: (args: SubjectValues) => void;
}

export function SubjectAdvanceSearch({
  defaultValues,
  onConfirm,
}: SubjectAdvanceSearchProps) {
  const idInputRef = React.useRef<HTMLInputElement>(null);
  const semesterInputRef = React.useRef<HTMLInputElement>(null);
  const yearInputRef = React.useRef<HTMLInputElement>(null);
  const [major, setMajor] = React.useState<{ id: number; name: string } | null>(
    defaultValues.majorId
      ? {
          id: defaultValues.majorId,
          name: "(not loaded)",
        }
      : null,
  );
  const [school, setSchool] = React.useState<null | {
    id: number;
    name: string;
  }>(
    defaultValues.schoolId
      ? {
          id: defaultValues.schoolId,
          name: "(not loaded)",
        }
      : null,
  );

  return (
    <AdvanceSearch
      title="Advance subject search"
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
        <div className="flex gap-4" key="semester-year-search">
          <div className="flex flex-col gap-4">
            <Label>
              Semester{" "}
              <span className="rounded bg-gray-500 px-2 py-1 text-secondary">
                number only
              </span>
            </Label>
            <Input
              ref={semesterInputRef}
              placeholder="Semester"
              defaultValue={defaultValues.semester ?? undefined}
            />
          </div>
          <div className="flex flex-col gap-4">
            <Label>
              Year{" "}
              <span className="rounded bg-gray-500 px-2 py-1 text-secondary">
                number only
              </span>
            </Label>
            <Input
              ref={yearInputRef}
              placeholder="Year"
              defaultValue={defaultValues.year ?? undefined}
            />
          </div>
        </div>,
        <div className="flex flex-col gap-4" key="major-id-search">
          <Label>Major</Label>
          <div className="flex gap-2">
            <SearchPopover
              id="major"
              fetchResource={async (searchPharse) => {
                const res = await axiosInstance.get(`/admin/majors`, {
                  params: { ["name:ilike"]: searchPharse },
                });
                return res.data.data.majors;
              }}
              onSelected={(d) => {
                setMajor({ id: d.id, name: d.name });
              }}
              optionLabel="name"
              optionValue="id"
              value={major}
              placeholder="Select major"
            />
            <Button
              disabled={!major}
              onClick={() => {
                setMajor(null);
              }}
            >
              Clear
            </Button>
          </div>
        </div>,
        <div className="flex flex-col gap-4" key="school-id-search">
          <Label>School</Label>
          <div className="flex gap-2">
            <SearchPopover
              id="school"
              fetchResource={async (searchPharse) => {
                const res = await axiosInstance.get(`/admin/schools`, {
                  params: { ["name:ilike"]: searchPharse },
                });
                return res.data.data.schools;
              }}
              onSelected={(d) => {
                setSchool({ id: d.id, name: d.name });
              }}
              optionLabel="name"
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
        if (
          !idInputRef.current ||
          !semesterInputRef.current ||
          !yearInputRef.current
        )
          return;

        onConfirm({
          id:
            idInputRef.current.value === ""
              ? null
              : Number.isNaN(+idInputRef.current.value)
                ? null
                : +idInputRef.current.value,
          semester:
            semesterInputRef.current.value === ""
              ? null
              : Number.isNaN(+semesterInputRef.current.value)
                ? null
                : +semesterInputRef.current.value,
          year:
            yearInputRef.current.value === ""
              ? null
              : Number.isNaN(+yearInputRef.current.value)
                ? null
                : +yearInputRef.current.value,
          majorId: major?.id || null,
          schoolId: school?.id || null,
        });
      }}
    />
  );
}
