import { CustomErrorTooltipWrapper } from "@components/CustomTooltip";
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
    <FormItem>
      <Select
        onValueChange={field.onChange}
        defaultValue={defaultSelectedValue || ""}
      >
        <FormControl>
          <SelectTrigger>
            <CustomErrorTooltipWrapper
              errorMessage={errorField?.message?.toString() || ""}
            >
              <SelectValue placeholder={placeholderSelect || ""} />
            </CustomErrorTooltipWrapper>
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectGroup>
            <SelectLabel hidden={!groupLabel}>{groupLabel}</SelectLabel>
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
  );
}
