"use client";

import { CustomErrorTooltipWrapper } from "@components/CustomTooltip";
import { Button } from "@components/ui/button";
import { FormControl, FormItem } from "@components/ui/form";
import { Input } from "@components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { useDebounce } from "@hooks";
import { cn, utils } from "@lib/utils";
import { PopoverClose } from "@radix-ui/react-popover";
import { useQuery } from "@tanstack/react-query";
import React, { HTMLAttributes } from "react";
import {
  ControllerRenderProps,
  FieldError,
  FieldErrorsImpl,
  Merge,
} from "react-hook-form";

interface SearchSelectFormFieldProps<T> {
  ids: Array<string>;
  field: ControllerRenderProps<any, string>;
  errorField?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  placeholder?: string;
  className?: HTMLAttributes<HTMLDivElement>["className"];
  onSelected: (data: T) => void;
  fetchResource: (searchPhase: string) => Promise<Array<T>>;
  disabled?: boolean;
  getLabel(data: T): string;
  isSelectedData: (data: T, value: T) => boolean;
}

export function SearchSelectFormField<T extends { id: number }>({
  ids,
  field,
  errorField,
  placeholder,
  onSelected,
  fetchResource,
  disabled,
  getLabel,
  isSelectedData,
  ...props
}: SearchSelectFormFieldProps<T>) {
  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce({
    value: search,
    delay: utils.SEARCH_DEBOUNCE_DELAY,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["search", debouncedSearch, ids],
    queryFn: async () => {
      if (fetchResource) {
        return await fetchResource(debouncedSearch);
      }
    },
  });

  return (
    <FormItem className={props.className}>
      <Popover>
        <FormControl>
          <CustomErrorTooltipWrapper
            errorMessage={errorField?.message?.toString() || ""}
          >
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "w-full",
                  !!errorField && "outline outline-1 outline-red-600",
                )}
                disabled={disabled}
              >
                {field.value && getLabel(field.value) !== ""
                  ? `${getLabel(field.value)}`
                  : placeholder || "Select"}
              </Button>
            </PopoverTrigger>
          </CustomErrorTooltipWrapper>
        </FormControl>
        <PopoverContent className="min-w-[40ch]">
          <Input onChange={(e) => setSearch(e.target.value)} value={search} />
          <div className="flex max-h-96 flex-col gap-1 overflow-y-auto pt-2">
            {isLoading ? (
              <div className="loader"></div>
            ) : (
              <>
                {data instanceof Array
                  ? data?.map((data) => {
                      return (
                        <PopoverClose asChild key={data.id}>
                          <div
                            className="flex cursor-pointer items-center justify-between rounded p-2 hover:bg-primary/20 data-[active=true]:bg-primary/10"
                            key={data.id}
                            data-active={isSelectedData(data, field.value as T)}
                            onClick={() => onSelected(data)}
                          >
                            <p>{getLabel(data)}</p>
                          </div>
                        </PopoverClose>
                      );
                    })
                  : null}
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </FormItem>
  );
}
