import { paymentTermSchema } from "@modules/accounting/models";
import { quotationSchema } from "./quotation";
import { z } from "zod";
import { generateSystemDefaultResponseSchema } from "@modules/shared/model";

export const orderSchema = z.object({
  id: z.number(),
  name: z.string(),
  commitment_date: z.string(),
  note: z.string(),
  quotation: quotationSchema,
  payment_term: paymentTermSchema,
});

export const orderResponseSchema = generateSystemDefaultResponseSchema(
  z.object({ order: orderSchema }),
);

export const ordersResponseSchema = generateSystemDefaultResponseSchema(
  z.object({ orders: z.array(orderSchema) }),
);

export const createOrderSchema = z.object({
  name: z.string().min(1),
  commitment_date: z.date(),
  note: z.string(),
  quotation: quotationSchema,
  payment_term: paymentTermSchema,
});

export const updateOrderSchema = z.object({
  name: z.string().min(1),
  commitment_date: z.date(),
  note: z.string(),
  quotation: quotationSchema,
  payment_term: paymentTermSchema,
});
