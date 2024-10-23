import { numberInString } from "@models";
import { z } from "zod";

export interface PaymentTerm {
  id: number;
  name: string;
  description: string;
  lines: PaymentTermLine[];
}

export interface PaymentTermLine {
  id: number;
  sequence: number;
  value_amount_percent: number;
  number_of_days: number;
}

export const CreatePaymentTermLineSchema = z.object({
  sequence: numberInString.pipe(
    z.number().int({ message: "Sequence must be an integer" }),
  ),
  value_amount_percent: numberInString.pipe(
    z
      .number()
      .min(1, {
        message: "Value amount percent must be greater than or equal to 1",
      })
      .max(100, {
        message: "Value amount percent must be less than or equal to 100",
      }),
  ),
  number_of_days: numberInString.pipe(
    z
      .number()
      .min(0, { message: "Number of days must be greater than or equal to 0" })
      .int({ message: "Number of days must be an integer" }),
  ),
});

export const CreatePaymentTermSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  lines: z.array(CreatePaymentTermLineSchema),
});

export const UpdatePaymentTermLineSchema = z.object({
  id: z.number(),
  sequence: numberInString.pipe(
    z.number().int({ message: "Sequence must be an integer" }),
  ),
  value_amount_percent: numberInString.pipe(
    z
      .number()
      .min(1, {
        message: "Value amount percent must be greater than or equal to 1",
      })
      .max(100, {
        message: "Value amount percent must be less than or equal to 100",
      }),
  ),
  number_of_days: numberInString.pipe(
    z
      .number()
      .min(0, { message: "Number of days must be greater than or equal to 0" })
      .int({ message: "Number of days must be an integer" }),
  ),
});

export const UpdatePaymentTermSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  remove_line_ids: z.array(z.number()),
  update_lines: z.array(UpdatePaymentTermLineSchema),
  add_lines: z.array(CreatePaymentTermLineSchema),
});
