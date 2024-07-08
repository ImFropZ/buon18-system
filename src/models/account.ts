import { GenderSchema, SocialMediaSchema } from "@models"
import { FieldValues } from "react-hook-form";
import * as z from "zod";

export const AccountCreateSchema = z.object({
    code: z.string().min(2, {
        message: "Code must be at least 2 characters.",
    }),
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    gender: GenderSchema.optional(),
    email: z.string().email({
        message: "Invalid email address.",
    }).optional(),
    address: z.string().min(2, {
        message: "Address must be at least 2 characters.",
    }).optional(),
    phone: z.string().min(9, {
        message: "Phone must be at least 9 characters.",
    }),
    secondary_phone: z.string().min(9, {
        message: "Secondary Phone must be at least 9 characters.",
    }).optional(),
    social_medias: z.array(SocialMediaSchema),
});

export const AccountEditSchema = z.object({
    code: z.string().min(2, {
        message: "Code must be at least 2 characters.",
    }).optional(),
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }).optional(),
    gender: GenderSchema.optional(),
    email: z.string().email({
        message: "Invalid email address.",
    }).optional(),
    address: z.string().min(2, {
        message: "Address must be at least 2 characters.",
    }).optional(),
    phone: z.string().min(9, {
        message: "Phone must be at least 9 characters.",
    }).optional(),
    secondary_phone: z.string().min(9, {
        message: "Secondary Phone must be at least 9 characters.",
    }).optional(),
    social_medias: z.array(SocialMediaSchema),
});

export type Account = FieldValues & z.infer<typeof AccountCreateSchema> & { id: string | number };