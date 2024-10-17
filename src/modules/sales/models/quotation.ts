import { Customer } from "@modules/setting/models";
import { OrderItem } from "./order-item";

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
