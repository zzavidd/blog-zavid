import { z } from 'zod';
import { WishlistVisibilitySchema } from '../enums/WishlistVisibility.schema';
import { NestedEnumWishlistVisibilityFilterObjectSchema } from './NestedEnumWishlistVisibilityFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EnumWishlistVisibilityFilter> = z
  .object({
    equals: z.lazy(() => WishlistVisibilitySchema).optional(),
    in: z
      .union([
        z.lazy(() => WishlistVisibilitySchema).array(),
        z.lazy(() => WishlistVisibilitySchema),
      ])
      .optional(),
    notIn: z
      .union([
        z.lazy(() => WishlistVisibilitySchema).array(),
        z.lazy(() => WishlistVisibilitySchema),
      ])
      .optional(),
    not: z
      .union([
        z.lazy(() => WishlistVisibilitySchema),
        z.lazy(() => NestedEnumWishlistVisibilityFilterObjectSchema),
      ])
      .optional(),
  })
  .strict();

export const EnumWishlistVisibilityFilterObjectSchema = Schema;
