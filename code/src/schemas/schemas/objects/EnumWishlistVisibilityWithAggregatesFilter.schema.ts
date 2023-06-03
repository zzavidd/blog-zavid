import { z } from 'zod';
import { WishlistVisibilitySchema } from '../enums/WishlistVisibility.schema';
import { NestedEnumWishlistVisibilityWithAggregatesFilterObjectSchema } from './NestedEnumWishlistVisibilityWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumWishlistVisibilityFilterObjectSchema } from './NestedEnumWishlistVisibilityFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EnumWishlistVisibilityWithAggregatesFilter> = z
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
        z.lazy(
          () => NestedEnumWishlistVisibilityWithAggregatesFilterObjectSchema,
        ),
      ])
      .optional(),
    _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
    _min: z
      .lazy(() => NestedEnumWishlistVisibilityFilterObjectSchema)
      .optional(),
    _max: z
      .lazy(() => NestedEnumWishlistVisibilityFilterObjectSchema)
      .optional(),
  })
  .strict();

export const EnumWishlistVisibilityWithAggregatesFilterObjectSchema = Schema;
