import { Customer } from "@modules/setting/models";
import { CreateOrderItemSchema, OrderItem } from "./order-item";
import { z } from "zod";

export interface Quotation {
  id: number;
  name: string;
  creation_date: string;
  validity_date: string;
  discount: number;
  amount_delivery: number;
  total_amount: number;
  status: "quotation" | "quotation_sent" | "sales_order" | "cancelled";
  items: OrderItem[];
  customer: Customer;
}

export const CreateQuotationSchema = z.object({
  name: z.string().min(1),
  creation_date: z.date(),
  validity_date: z.date(),
  discount: z.number().min(0),
  amount_delivery: z.number().min(0),
  status: z.enum(["quotation", "quotation_sent", "sales_order", "cancelled"]),
  items: z.array(CreateOrderItemSchema).min(1),
  customer: z.object({
    id: z.number().min(1),
    full_name: z.string(),
  }),
});