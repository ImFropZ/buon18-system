import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover-dialog";
import { useDebounce } from "@hooks";
import { utils } from "@lib/utils";
import { PopoverClose } from "@radix-ui/react-popover";
import { useQuery } from "@tanstack/react-query";
import React from "react";

interface SearchPopoverProps {
  id: string;
  fetchResource: (searchPhase: string) => Promise<any>;
  optionValue: string;
  optionLabel: string;
  value?: any;
  placeholder?: string;
  onSelected: (data: any) => void;
}

export function SearchPopover({
  id,
  fetchResource,
  optionValue,
  optionLabel,
  value,
  placeholder,
  onSelected,
}: SearchPopoverProps) {
  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce({
    value: search,
    delay: utils.SEARCH_DEBOUNCE_DELAY,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["search", debouncedSearch, id],
    queryFn: async () => {
      if (fetchResource) {
        return await fetchResource(debouncedSearch);
      }
    },
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" className="w-full">
          {value
            ? `${value[optionValue]} - ${value[optionLabel]}`
            : placeholder || "Search"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-[40ch]">
        <Input onChange={(e) => setSearch(e.target.value)} value={search} />
        <div className="flex flex-col gap-1 pt-2">
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
                          data-active={
                            value
                              ? value[optionValue] === data[optionValue]
                              : false
                          }
                          onClick={() => onSelected(data)}
                        >
                          <p>
                            {data[optionValue]} -{" "}
                            {data[optionLabel].length > 29
                              ? data[optionLabel].slice(0, 30) + " ..."
                              : data[optionLabel]}
                          </p>
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
  );
}
