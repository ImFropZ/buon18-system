import { numberInString } from "@models";
import { z } from "zod";

export const orderItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  discount: z.number(),
  amount_total: z.number(),
});

export const createOrderItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: numberInString.pipe(z.number()),
  discount: numberInString.pipe(z.number()),
});

export const updateOrderItemSchema = z.object({
  id: z.number().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  price: numberInString.pipe(z.number()),
  discount: numberInString.pipe(z.number()),
});
