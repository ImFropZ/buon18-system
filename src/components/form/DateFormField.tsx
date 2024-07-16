import { CustomErrorTooltipWrapper } from "@components/CustomTooltip";
import { Button } from "@components/ui/button";
import { Calendar } from "@components/ui/calendar";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
} from "@components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { cn } from "@lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  ControllerRenderProps,
  FieldError,
  FieldErrorsImpl,
  Merge,
} from "react-hook-form";

interface DateFormFieldProps extends React.HTMLAttributes<HTMLButtonElement> {
  field: ControllerRenderProps<any, string>;
  errorField?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  label?: string;
  placeholder?: string;
  description?: string;
  _defaultValue?: Date;
}

export function DateFormField({
  field,
  errorField,
  label,
  placeholder,
  description,
  _defaultValue,
  ...props
}: DateFormFieldProps) {
  return (
    <FormItem className="flex flex-col">
      <FormLabel hidden={!label} className="text-primary">
        {label}
      </FormLabel>
      <Popover>
        <CustomErrorTooltipWrapper
          errorMessage={errorField?.message?.toString() || ""}
        >
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                {...props}
                type="button"
                variant={"outline"}
                className={cn(
                  "w-[240px] pl-3 text-left font-normal",
                  !field.value && "text-muted-foreground",
                  !!errorField && "outline outline-1 outline-red-600",
                  props.className,
                )}
              >
                {field.value ? (
                  format(field.value, "PP")
                ) : _defaultValue ? (
                  format(_defaultValue, "PP")
                ) : (
                  <span>{placeholder || "Pick a date"}</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
        </CustomErrorTooltipWrapper>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={field.value}
            onSelect={field.onChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {description ? <FormDescription>{description}</FormDescription> : null}
    </FormItem>
  );
}
