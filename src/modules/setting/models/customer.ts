import { generateSystemDefaultResponseSchema } from "@modules/shared/model";
import { z } from "zod";

export const customerSchema = z.object({
  id: z.number(),
  full_name: z.string(),
  gender: z.string(),
  email: z.string(),
  phone: z.string(),
  additional_info: z.record(z.string(), z.any()),
});

export const customerResponseSchema = generateSystemDefaultResponseSchema(
  z.object({ customer: customerSchema }),
);

export const customersResponseSchema = generateSystemDefaultResponseSchema(
  z.object({ customers: z.array(customerSchema) }),
);

export const createCustomerSchema = z.object({
  full_name: z.string().min(1),
  gender: z.enum(["m", "f", "u"], {
    message: "You must select either one of the options.",
  }),
  email: z.string().email(),
  phone: z.string().min(10),
  additional_info: z.record(z.string(), z.any()),
});

export const updateCustomerSchema = z.object({
  full_name: z.string().min(1),
  gender: z.enum(["m", "f", "u"], {
    message: "You must select either one of the options.",
  }),
  email: z.string().email(),
  phone: z.string().min(10),
  additional_info: z.record(z.string(), z.any()),
});
