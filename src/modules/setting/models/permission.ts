import { generateSystemDefaultResponseSchema } from "@modules/shared/model";
import { z } from "zod";

export const permissionSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const permissionResponseSchema = generateSystemDefaultResponseSchema(
  z.object({ permission: permissionSchema }),
);

export const permissionsResponseSchema = generateSystemDefaultResponseSchema(
  z.object({ permissions: z.array(permissionSchema) }),
);
