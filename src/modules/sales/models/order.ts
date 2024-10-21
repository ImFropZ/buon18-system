import { PaymentTerm } from "@modules/accounting/models";
import { Quotation } from "./quotation";

export interface Order {
  id: number;
  name: string;
  commitment_date: string;
  note: string;
  quotation: Quotation;
  payment_term: PaymentTerm;
}
