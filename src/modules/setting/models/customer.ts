import { z } from "zod";

export interface Customer {
  id: number;
  full_name: string;
  gender: string;
  email: string;
  phone: string;
  additional_info: {
    [key: string]: any;
  };
}

export const CreateCustomerSchema = z.object({
  full_name: z.string().min(1),
  gender: z.enum(["m", "f", "u"], {
    message: "You must select either one of the options.",
  }),
  email: z.string().email(),
  phone: z.string().min(10),
  additional_info: z.record(z.string(), z.any()),
});
