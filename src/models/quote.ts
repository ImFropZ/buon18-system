import { dateInString, numberInString } from "@models";
import * as z from "zod";

export const QuoteItemSchema = z.object({
  id: z.string().or(z.number()),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  quantity: numberInString.pipe(
    z.number().min(1, {
      message: "Quantity must be at least 1.",
    }),
  ),
  unit_price: numberInString.pipe(
    z.number().min(0, {
      message: "Unit Price can not be negative.",
    }),
  ),
});

export const QuoteItemCreateSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  quantity: numberInString.pipe(
    z.number().min(1, {
      message: "Quantity must be at least 1.",
    }),
  ),
  unit_price: numberInString.pipe(
    z.number().min(0, {
      message: "Unit Price can not be negative.",
    }),
  ),
});

export const QuoteItemEditSchema = z.object({
  id: z.string().or(z.number()).optional(),
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .optional(),
  description: z
    .string()
    .min(2, {
      message: "Description must be at least 2 characters.",
    })
    .optional(),
  quantity: numberInString
    .pipe(
      z.number().min(1, {
        message: "Quantity must be at least 1.",
      }),
    )
    .optional(),
  unit_price: numberInString
    .pipe(
      z.number().min(0, {
        message: "Unit Price can not be negative.",
      }),
    )
    .optional(),
});

export const QuoteCreateSchema = z.object({
  code: z.string().min(2, {
    message: "Code must be at least 2 characters.",
  }),
  date: dateInString.or(z.date()),
  expiry_date: dateInString.or(z.date()),
  discount: numberInString
    .pipe(
      z.number().min(0, {
        message: "Discount can not be negative.",
      }),
    )
    .optional(),
  note: z.string().optional(),
  client_id: z.string().or(z.number()),
  account_id: z.string().or(z.number()),
  items: z.array(QuoteItemSchema).min(1, {
    message: "At least one item is required.",
  }),
});

export const QuoteEditSchema = z.object({
  code: z
    .string()
    .min(2, {
      message: "Code must be at least 2 characters.",
    })
    .optional(),
  date: dateInString.optional().or(z.date().optional()),
  expiry_date: dateInString.optional().or(z.date().optional()),
  discount: numberInString
    .pipe(
      z.number().min(0, {
        message: "Discount can not be negative.",
      }),
    )
    .optional(),
  note: z.string().optional(),
  client_id: z.string().or(z.number()).optional(),
  account_id: z.string().or(z.number()).optional(),
  items: z.array(QuoteItemEditSchema).optional(),
});

export const QuoteSchema = z.intersection(
  QuoteCreateSchema,
  z.object({
    id: z.string().or(z.number()),
    status: z.enum(["Draft", "Sent", "Accept", "Reject"]),
    subtotal: numberInString,
    total: numberInString,
    created_by_id: z.string().or(z.number()),
  }),
);

export type Quote = z.infer<typeof QuoteSchema>;
export type QuoteItem = z.infer<typeof QuoteItemSchema>;
