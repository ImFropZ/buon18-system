import { numberInString } from "@models";
import { z } from "zod";

export interface Transaction {
  id: string;
  amount: number;
  status: "manually_pending" | "pending" | "completed" | "failed";
  user_uuid: string;
  token: string | undefined;
}

export const CreateTransactionSchema = z.object({
  id: z.string().min(1),
  amount: numberInString.pipe(z.number().positive()),
});

export const CreateTransactionsSchema = z.object({
  transactions: z.array(CreateTransactionSchema),
});

export const UpdateTransactionSchema = z.object({
  id: z.string().min(1),
  amount: numberInString.pipe(z.number().positive()),
  status: z.enum(["completed", "failed"]).optional(),
});
