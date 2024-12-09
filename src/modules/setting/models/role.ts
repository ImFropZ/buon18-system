import { generateSystemDefaultResponseSchema } from "@modules/shared/model";
import { permissionSchema } from "./permission";
import { z } from "zod";

export const roleSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  permissions: z.array(permissionSchema),
});

export const roleResponseSchema = generateSystemDefaultResponseSchema(
  z.object({ role: roleSchema }),
);

export const rolesResponseSchema = generateSystemDefaultResponseSchema(
  z.object({
    roles: z.array(roleSchema),
  }),
);

export const createRoleSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  permissions: z.array(permissionSchema).min(1),
});

export const updateRoleSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  permissions: z.array(permissionSchema).min(1),
  add_permissions: z.array(permissionSchema).min(1),
  remove_permission_ids: z.array(z.number()).min(1),
});
