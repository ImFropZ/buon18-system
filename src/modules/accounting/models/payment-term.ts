export interface PaymentTerm {
  id: number;
  name: string;
  description: string;
  lines: PaymentTermLine[];
}

export interface PaymentTermLine {
  id: number;
  sequence: number;
  value_amount_percent: number;
  number_of_days: number;
}
