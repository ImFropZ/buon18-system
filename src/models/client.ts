import { numberInString, SocialMediaSchema } from "@models";
import { FieldValues } from "react-hook-form";
import * as z from "zod";

export const ClientCreateSchema = z.object({
  code: z.string().min(2, {
    message: "Code must be at least 2 characters.",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  address: z
    .string()
    .min(2, {
      message: "Address must be at least 2 characters.",
    })
    .optional(),
  phone: z.string().min(9, {
    message: "Phone must be at least 9 characters.",
  }),
  latitude: numberInString,
  longitude: numberInString,
  social_medias: z.array(SocialMediaSchema),
});

export const ClientEditSchema = z.object({
  code: z
    .string()
    .min(2, {
      message: "Code must be at least 2 characters.",
    })
    .optional(),
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .optional(),
  address: z
    .string()
    .min(2, {
      message: "Address must be at least 2 characters.",
    })
    .optional(),
  phone: z
    .string()
    .min(9, {
      message: "Phone must be at least 9 characters.",
    })
    .optional(),
  latitude: numberInString.optional(),
  longitude: numberInString.optional(),
  social_medias: z.array(SocialMediaSchema),
});

export type Client = FieldValues &
  z.infer<typeof ClientCreateSchema> & { id: string | number };
