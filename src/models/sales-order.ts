import * as z from "zod";

export const SalesOrderCreateSchema = z.object({
    code: z.string(),
    delivery_date: z.date(),
    accept_date: z.date().optional(),
    note: z.string().optional(),
});