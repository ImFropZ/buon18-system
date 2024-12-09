import { customerSchema } from "@modules/setting/models";
import {
  createOrderItemSchema,
  orderItemSchema,
  updateOrderItemSchema,
} from "./order-item";
import { z } from "zod";
import { generateSystemDefaultResponseSchema } from "@modules/shared/model";

export const quotationSchema = z.object({
  id: z.number(),
  name: z.string(),
  creation_date: z.string(),
  validity_date: z.string(),
  discount: z.number(),
  amount_delivery: z.number(),
  total_amount: z.number(),
  status: z.enum(["quotation", "quotation_sent", "sales_order", "cancelled"]),
  items: z.array(orderItemSchema),
  customer: customerSchema,
});

export const quotationResponseSchema = generateSystemDefaultResponseSchema(
  z.object({ quotation: quotationSchema }),
);

export const quotationsResponseSchema = generateSystemDefaultResponseSchema(
  z.object({ quotations: z.array(quotationSchema) }),
);

export const createQuotationSchema = z.object({
  name: z.string().min(1),
  creation_date: z.date(),
  validity_date: z.date(),
  discount: z.number().min(0),
  amount_delivery: z.number().min(0),
  status: z.enum(["quotation", "quotation_sent", "sales_order", "cancelled"]),
  items: z.array(createOrderItemSchema).min(1),
  customer: customerSchema,
});

export const updateQuotationSchema = z.object({
  name: z.string().min(1),
  creation_date: z.date(),
  validity_date: z.date(),
  discount: z.number().min(0),
  amount_delivery: z.number().min(0),
  status: z.enum(["quotation", "quotation_sent", "sales_order", "cancelled"]),
  customer: customerSchema,
  add_items: z.array(createOrderItemSchema).min(0),
  delete_item_ids: z.array(z.number()).min(0),
  update_items: z.array(updateOrderItemSchema).min(0),
});
