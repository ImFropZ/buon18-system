import React from "react";
import { axiosInstance } from "@modules/quiz-lobby/fetch";
import { AdvanceSearch, SearchPopover } from "@components";
import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Button } from "@components/ui/button";

type QuizValues = {
  id: number | null;
  semester: number | null;
  year: number | null;
  professorId: number | null;
  subjectId: number | null;
  majorId: number | null;
  schoolId: number | null;
  archived: string | null;
};

interface QuizAdvanceSearchProps {
  defaultValues: QuizValues;
  onConfirm: (args: QuizValues) => void;
}

export function QuizAdvanceSearch({
  defaultValues,
  onConfirm,
}: QuizAdvanceSearchProps) {
  const idInputRef = React.useRef<HTMLInputElement>(null);
  const semesterInputRef = React.useRef<HTMLInputElement>(null);
  const yearInputRef = React.useRef<HTMLInputElement>(null);
  const [archived, setArchived] = React.useState<"true" | "false" | null>(
    defaultValues.archived === null
      ? null
      : ((defaultValues.archived + "") as "true" | "false"),
  );
  const [subject, setSubject] = React.useState<{
    id: number;
    name: string;
  } | null>(
    defaultValues.subjectId
      ? {
          id: defaultValues.subjectId,
          name: "(not loaded)",
        }
      : null,
  );
  const [professor, setProfessor] = React.useState<{
    id: number;
    full_name: string;
  } | null>(
    defaultValues.professorId
      ? {
          id: defaultValues.professorId,
          full_name: "(not loaded)",
        }
      : null,
  );
  const [major, setMajor] = React.useState<{ id: number; name: string } | null>(
    defaultValues.majorId
      ? {
          id: defaultValues.majorId,
          name: "(not loaded)",
        }
      : null,
  );
  const [school, setSchool] = React.useState<{
    id: number;
    name: string;
  } | null>(
    defaultValues.schoolId
      ? {
          id: defaultValues.schoolId,
          name: "(not loaded)",
        }
      : null,
  );

  return (
    <AdvanceSearch
      title="Advance quiz search"
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
        <div className="flex flex-col gap-4" key="archived-search">
          <Label>Archived</Label>
          <div className="flex gap-2">
            <Select
              onValueChange={(s) => {
                if (s === "true") setArchived("true");
                else if (s === "false") setArchived("false");
                else setArchived(null);
              }}
              value={archived || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select archived" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Archived</SelectLabel>
                  <SelectItem value="true">True</SelectItem>
                  <SelectItem value="false">False</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button
              disabled={!archived}
              onClick={() => {
                setArchived(null);
              }}
            >
              Clear
            </Button>
          </div>
        </div>,
        <div className="flex flex-col gap-4" key="professor-id-search">
          <Label>Professor</Label>
          <div className="flex gap-2">
            <SearchPopover
              id="professor"
              fetchResource={async (searchPharse) => {
                const res = await axiosInstance.get(`/admin/professors`, {
                  params: { ["full-name:ilike"]: searchPharse },
                });
                return res.data.data.professors;
              }}
              onSelected={(d) => {
                setProfessor({ id: d.id, full_name: d.full_name });
                setSubject(null);
              }}
              getLabel={(d) => {
                return `${d.id} ${d.full_name}`;
              }}
              optionValue="id"
              value={professor}
              placeholder="Select professor"
            />
            <Button
              disabled={!professor}
              onClick={() => {
                setProfessor(null);
                setSubject(null);
              }}
            >
              Clear
            </Button>
          </div>
        </div>,
        <div className="flex flex-col gap-4" key="subject-id-search">
          <Label>Subject</Label>
          <div className="flex gap-2">
            <SearchPopover
              id={"subject" + (professor ? professor.id : "")}
              fetchResource={async (searchPharse) => {
                const res = await axiosInstance.get(`/admin/subjects`, {
                  params: {
                    ["name:ilike"]: searchPharse,
                    ["professor-id:eq"]: professor ? professor.id : undefined,
                  },
                });
                return res.data.data.subjects;
              }}
              onSelected={(d) => {
                setSubject({ id: d.id, name: d.name });
              }}
              getLabel={(d) => {
                return `${d.id} ${d.name} (semester:${d.semester}-year:${d.year})`;
              }}
              optionValue="id"
              value={subject}
              placeholder="Select subject"
            />
            <Button
              disabled={!subject}
              onClick={() => {
                setSubject(null);
              }}
            >
              Clear
            </Button>
          </div>
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
              getLabel={(d) => {
                return `${d.id} ${d.name}`;
              }}
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
          professorId: professor?.id || null,
          subjectId: subject?.id || null,
          majorId: major?.id || null,
          schoolId: school?.id || null,
          archived: archived,
        });
      }}
    />
  );
}
