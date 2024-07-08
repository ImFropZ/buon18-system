import { FormControl, FormItem } from "@components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@components/ui/tooltip";
import { TriangleAlert } from "lucide-react";
import React from "react";
import {
  ControllerRenderProps,
  FieldError,
  FieldErrorsImpl,
  Merge,
} from "react-hook-form";

export function SelectFormField({
  field,
  errorField,
  defaultSelectedValue,
  placeholderSelect,
  options,
  groupLabel,
}: {
  field: ControllerRenderProps<any, string>;
  errorField?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  defaultSelectedValue?: string;
  placeholderSelect?: string;
  options: { value: string; label: string }[];
  groupLabel?: string;
}) {
  return (
    <div className="relative">
      {errorField ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <TriangleAlert className="absolute right-full top-1/2 mr-2 -translate-y-1/2 text-red-500" />
          </TooltipTrigger>
          <TooltipContent asChild>
            <p className="mb-2 rounded bg-primary px-2 text-base font-normal text-secondary outline outline-[1px]">
              {errorField.message?.toString()}
            </p>
          </TooltipContent>
        </Tooltip>
      ) : null}

      <FormItem>
        <Select
          onValueChange={field.onChange}
          defaultValue={defaultSelectedValue || ""}
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder={placeholderSelect || ""} />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectGroup>
              {groupLabel ? <SelectLabel>{groupLabel}</SelectLabel> : null}
              {options.map((op) => {
                return (
                  <SelectItem key={op.value} value={op.value}>
                    {op.label}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </FormItem>
    </div>
  );
}
