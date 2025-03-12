import { CustomErrorTooltipWrapper } from "@components/CustomTooltip";
import { FormControl, FormItem } from "@components/ui/form";
import { Switch } from "@components/ui/switch";
import { cn } from "@lib/utils";
import {
  ControllerRenderProps,
  FieldError,
  FieldErrorsImpl,
  Merge,
} from "react-hook-form";

interface SwitchFormFieldProps extends React.HTMLAttributes<HTMLButtonElement> {
  field: ControllerRenderProps<any, string>;
  errorField?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  onUpdate?: (value: boolean) => void;
}

export function SwitchFormField({
  field,
  errorField,
  onUpdate,
  ...props
}: SwitchFormFieldProps) {
  return (
    <FormItem className={props.className}>
      <FormControl>
        <CustomErrorTooltipWrapper
          errorMessage={errorField?.message?.toString() || ""}
        >
          <Switch
            {...props}
            checked={field.value !== undefined ? field.value : false}
            onCheckedChange={(e) => {
              onUpdate?.(e);
              field.onChange(e);
            }}
            className={cn(
              `border border-gray-300 bg-gray-300 aria-[checked="true"]:bg-[#98CB33]`,
              !!errorField && "outline outline-1 outline-red-600",
            )}
            aria-readonly
            type="button"
          />
        </CustomErrorTooltipWrapper>
      </FormControl>
    </FormItem>
  );
}
