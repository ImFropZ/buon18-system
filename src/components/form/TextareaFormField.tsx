import { CustomErrorTooltipWrapper } from "@components/CustomTooltip";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
} from "@components/ui/form";
import { Textarea } from "@components/ui/textarea";
import { cn } from "@lib/utils";
import {
  ControllerRenderProps,
  FieldError,
  FieldErrorsImpl,
  Merge,
} from "react-hook-form";

interface DateFormFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  field: ControllerRenderProps<any, string>;
  errorField?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  label?: string | React.ReactNode;
  placeholder?: string;
  description?: string;
}

export function TextareaFormField({
  field,
  errorField,
  label,
  placeholder,
  description,
  defaultValue,
  ...props
}: DateFormFieldProps) {
  return (
    <FormItem className={cn("w-full", props.className)}>
      <FormLabel hidden={!label}>{label}</FormLabel>
      <FormControl>
        <CustomErrorTooltipWrapper
          errorMessage={errorField?.message?.toString() || ""}
        >
          <Textarea
            {...props}
            {...field}
            placeholder={placeholder}
            className={cn(
              "resize-none",
              !!errorField && "outline outline-1 outline-red-600",
            )}
            defaultValue={defaultValue}
          />
        </CustomErrorTooltipWrapper>
      </FormControl>
      <FormDescription hidden={!description}>{description}</FormDescription>
    </FormItem>
  );
}
