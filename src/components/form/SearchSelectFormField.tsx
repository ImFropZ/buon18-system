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
import { useList } from "@refinedev/core";
import React from "react";
import {
  ControllerRenderProps,
  FieldError,
  FieldErrorsImpl,
  Merge,
} from "react-hook-form";

interface SearchSelectFormFieldProps {
  field: ControllerRenderProps<any, string>;
  errorField?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  resource: string;
  icon?: React.ReactNode;
  placeholder?: string;
  defaultValue?: string;
}

export function SearchSelectFormField({
  field,
  errorField,
  resource,
  placeholder,
  icon,
  defaultValue = "",
}: SearchSelectFormFieldProps) {
  const [search, setSearch] = React.useState("");
  const [selectedData, setSelectedData] = React.useState({
    id: defaultValue,
    label: "",
  });
  const debouncedSearch = useDebounce({
    value: search,
    delay: utils.SEARCH_DEBOUNCE_DELAY,
  });

  const { data, isLoading } = useList({
    resource: resource,
    filters: [
      {
        field: "name",
        operator: "contains",
        value: debouncedSearch,
      },
    ],
  });

  return (
    <FormItem>
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
                  !!errorField && "outline outline-1 outline-red-600",
                )}
              >
                {icon || null}
                {selectedData.id ? (
                  <span className="mr-2 text-center align-middle text-xs text-muted-foreground before:content-['('] after:content-[')']">
                    {selectedData.id}
                  </span>
                ) : null}
                {selectedData.label ||
                  data?.data.find((data) => data.id == defaultValue)?.name ||
                  placeholder ||
                  "Open popover"}
              </Button>
            </PopoverTrigger>
          </CustomErrorTooltipWrapper>
        </FormControl>
        <PopoverContent>
          <Input onChange={(e) => setSearch(e.target.value)} value={search} />
          <div className="flex flex-col gap-1 pt-2">
            {isLoading ? (
              <div className="loader"></div>
            ) : (
              <>
                {data?.data.map((data) => {
                  return (
                    <PopoverClose asChild key={data.id}>
                      <div
                        className="flex cursor-pointer items-center justify-between rounded p-2 hover:bg-primary/20 data-[active=true]:bg-primary/10"
                        key={data.id + ""}
                        data-active={selectedData.id === data.id + ""}
                        onClick={() => {
                          setSelectedData({
                            id: data.id + "",
                            label: data.name,
                          });
                          field.onChange(data.id);
                        }}
                      >
                        <p>{data.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {data.id}
                        </p>
                      </div>
                    </PopoverClose>
                  );
                })}
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </FormItem>
  );
}
