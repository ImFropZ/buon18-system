import { numberInString } from "@models";
import { z } from "zod";

export interface OrderItem {
  id: number;
  name: string;
  description: string;
  price: number;
  discount: number;
  amount_total: number;
}

export const CreateOrderItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: numberInString.pipe(z.number()),
  discount: numberInString.pipe(z.number()),
});
