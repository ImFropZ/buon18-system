import { numberInString } from "@models";
import { generateSystemDefaultResponseSchema } from "@modules/shared/model";
import { z } from "zod";

export const transactionSchema = z.object({
  id: z.string(),
  amount: z.number(),
  status: z.enum(["manually_pending", "pending", "completed", "failed"]),
  user_uuid: z.string(),
  token: z.string().optional(),
});

export const transactionsResponseSchema = generateSystemDefaultResponseSchema(
  z.object({ transactions: z.array(transactionSchema) }),
);

export const createTransactionSchema = z.object({
  id: z.string().min(1),
  amount: numberInString.pipe(z.number().positive()),
});

export const createTransactionsSchema = z.object({
  transactions: z.array(createTransactionSchema),
});

export const updateTransactionSchema = z.object({
  id: z.string().min(1),
  amount: numberInString.pipe(z.number().positive()),
  status: z.enum(["completed", "failed"]).optional(),
});
