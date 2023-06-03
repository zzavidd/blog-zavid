import { z } from 'zod';
import { WishlistPrioritySchema } from '../enums/WishlistPriority.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EnumWishlistPriorityFieldUpdateOperationsInput> =
  z
    .object({
      set: z.lazy(() => WishlistPrioritySchema).optional(),
    })
    .strict();

export const EnumWishlistPriorityFieldUpdateOperationsInputObjectSchema =
  Schema;
