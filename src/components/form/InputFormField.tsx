import { CustomErrorTooltipWrapper } from "@components/CustomTooltip";
import { FormControl, FormItem } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { cn } from "@lib/utils";
import {
  ControllerRenderProps,
  FieldError,
  FieldErrorsImpl,
  Merge,
} from "react-hook-form";

interface InputFormFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  field: ControllerRenderProps<any, string>;
  errorField?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  placeholder?: string;
  defaultValue?: string;
}

export function InputFormField({
  field,
  errorField,
  placeholder,
  defaultValue,
  ...props
}: InputFormFieldProps) {
  return (
    <FormItem>
      <FormControl>
        <CustomErrorTooltipWrapper
          errorMessage={errorField?.message?.toString() || ""}
        >
          <Input
            {...props}
            {...field}
            className={cn(
              "mt-0 text-primary",
              !!errorField && "outline outline-1 outline-red-600",
              props.className,
            )}
            value={field.value !== undefined ? field.value : defaultValue || ""}
            placeholder={placeholder || ""}
            data-error={!!errorField}
          />
        </CustomErrorTooltipWrapper>
      </FormControl>
    </FormItem>
  );
}
