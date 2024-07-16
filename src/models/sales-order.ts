import * as z from "zod";

export const SalesOrderCreateSchema = z.object({
    code: z.string(),
    delivery_date: z.date(),
    accept_date: z.date().optional(),
    note: z.string().optional(),
});

export const SalesOrderSchema = z.intersection(SalesOrderCreateSchema, z.object({
    id: z.number(),
    created_by_id: z.number(),
    quote_id: z.number(),
    status: z.enum(["On-Going", "Sent", "Done", "Cancel"]),
}));