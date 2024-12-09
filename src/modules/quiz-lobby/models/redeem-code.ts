import { numberInString } from "@models";
import { generateSystemDefaultResponseSchema } from "@modules/shared/model";
import { z } from "zod";

export const redeemCodeSchema = z.object({
  id: z.number(),
  code: z.string(),
  amount: z.number(),
  amount_left: z.number(),
  credit: z.number(),
  expired_at: z.string().datetime(),
});

export const redeemCodesResponseSchema = generateSystemDefaultResponseSchema(
  z.object({
    redeem_codes: z.array(redeemCodeSchema),
  }),
);

export const createRedeemCodeSchema = z.object({
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

export const createRedeemCodesSchema = z.object({
  redeemCodes: z.array(createRedeemCodeSchema),
});

export const updateRedeemCodeSchema = z.object({
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
