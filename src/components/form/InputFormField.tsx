import { FormControl, FormItem } from "@components/ui/form";
import { Input } from "@components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@components/ui/tooltip";
import { TriangleAlert } from "lucide-react";
import {
  ControllerRenderProps,
  FieldError,
  FieldErrorsImpl,
  FieldValues,
  Merge,
} from "react-hook-form";

export function InputFormField({
  field,
  errorField,
  placeholder,
  defaultValue,
}: {
  field: ControllerRenderProps<any, string>;
  errorField?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  placeholder?: string;
  defaultValue?: string;
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
        <FormControl>
          <Input
            {...field}
            className="mt-0 text-primary data-[error='true']:outline data-[error='true']:outline-[2px] data-[error='true']:outline-red-500"
            defaultValue={defaultValue || ""}
            placeholder={placeholder || ""}
            data-error={!!errorField}
          />
        </FormControl>
      </FormItem>
    </div>
  );
}
