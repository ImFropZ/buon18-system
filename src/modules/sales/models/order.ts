import { PaymentTerm } from "@modules/accounting/models";
import { Quotation } from "./quotation";
import { z } from "zod";

export interface Order {
  id: number;
  name: string;
  commitment_date: string;
  note: string;
  quotation: Quotation;
  payment_term: PaymentTerm;
}

export const CreateOrderSchema = z.object({
  name: z.string().min(1),
  commitment_date: z.date(),
  note: z.string(),
  quotation: z.object({
    id: z.number().min(1),
    name: z.string(),
  }),
  payment_term: z.object({
    id: z.number().min(1),
    name: z.string(),
  }),
});
