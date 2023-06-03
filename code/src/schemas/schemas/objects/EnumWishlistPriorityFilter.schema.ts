import { z } from 'zod';
import { WishlistPrioritySchema } from '../enums/WishlistPriority.schema';
import { NestedEnumWishlistPriorityFilterObjectSchema } from './NestedEnumWishlistPriorityFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EnumWishlistPriorityFilter> = z
  .object({
    equals: z.lazy(() => WishlistPrioritySchema).optional(),
    in: z
      .union([
        z.lazy(() => WishlistPrioritySchema).array(),
        z.lazy(() => WishlistPrioritySchema),
      ])
      .optional(),
    notIn: z
      .union([
        z.lazy(() => WishlistPrioritySchema).array(),
        z.lazy(() => WishlistPrioritySchema),
      ])
      .optional(),
    not: z
      .union([
        z.lazy(() => WishlistPrioritySchema),
        z.lazy(() => NestedEnumWishlistPriorityFilterObjectSchema),
      ])
      .optional(),
  })
  .strict();

export const EnumWishlistPriorityFilterObjectSchema = Schema;
