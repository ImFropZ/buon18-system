import { numberInString } from "@models";
import { z } from "zod";

export interface RedeemCode {
  id: number;
  code: string;
  amount: number;
  amount_left: number;
  credit: number;
  expired_at: string;
}

export const CreateRedeemCodeSchema = z.object({
  code: z
    .string()
    .min(1, { message: "Code must be at least 1 character" })
    .max(16, { message: "Code must be at most 16 characters" }),
  credit: numberInString.pipe(
    z.number().int().min(1, { message: "Credit must be at least 1" }),
  ),
  amount: numberInString.pipe(
    z.number().int().min(1, { message: "Amount must be at least 1" }),
  ),
  expired_at: z
    .date()
    .min(new Date(), { message: "Expired date must be in the future" }),
});

export const CreateRedeemCodesSchema = z.object({
  redeemCodes: z.array(CreateRedeemCodeSchema),
});

export const UpdateRedeemCodeSchema = z.object({
  code: z
    .string()
    .min(1, { message: "Code must be at least 1 character" })
    .max(16, { message: "Code must be at most 16 characters" }),
  credit: numberInString.pipe(
    z.number().int().min(1, { message: "Credit must be at least 1" }),
  ),
  amount: numberInString.pipe(
    z.number().int().min(1, { message: "Amount must be at least 1" }),
  ),
  expired_at: z
    .date()
    .min(new Date(), { message: "Expired date must be in the future" }),
});
