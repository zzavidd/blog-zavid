import { z } from 'zod';
import { WishlistVisibilitySchema } from '../enums/WishlistVisibility.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EnumWishlistVisibilityFieldUpdateOperationsInput> =
  z
    .object({
      set: z.lazy(() => WishlistVisibilitySchema).optional(),
    })
    .strict();

export const EnumWishlistVisibilityFieldUpdateOperationsInputObjectSchema =
  Schema;
