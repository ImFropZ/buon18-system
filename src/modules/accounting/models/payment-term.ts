import { numberInString } from "@models";
import { generateSystemDefaultResponseSchema } from "@modules/shared/model";
import { z } from "zod";

export const paymentTermLineSchema = z.object({
  id: z.number(),
  sequence: z.number(),
  value_amount_percent: z.number(),
  number_of_days: z.number(),
});

export const paymentTermSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  lines: z.array(paymentTermLineSchema),
});

export const paymentTermResponseSchema = generateSystemDefaultResponseSchema(
  z.object({ payment_term: paymentTermSchema }),
);

export const paymentTermsResponseSchema = generateSystemDefaultResponseSchema(
  z.object({ payment_terms: z.array(paymentTermSchema) }),
);

export const createPaymentTermLineSchema = z.object({
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

export const createPaymentTermSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  lines: z.array(createPaymentTermLineSchema),
});

export const updatePaymentTermLineSchema = z.object({
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

export const updatePaymentTermSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  remove_line_ids: z.array(z.number()),
  update_lines: z.array(updatePaymentTermLineSchema),
  add_lines: z.array(createPaymentTermLineSchema),
});
