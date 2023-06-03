import { z } from 'zod';
import { IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { FloatWithAggregatesFilterObjectSchema } from './FloatWithAggregatesFilter.schema';
import { IntNullableWithAggregatesFilterObjectSchema } from './IntNullableWithAggregatesFilter.schema';
import { EnumWishlistPriorityWithAggregatesFilterObjectSchema } from './EnumWishlistPriorityWithAggregatesFilter.schema';
import { WishlistPrioritySchema } from '../enums/WishlistPriority.schema';
import { EnumWishlistVisibilityWithAggregatesFilterObjectSchema } from './EnumWishlistVisibilityWithAggregatesFilter.schema';
import { WishlistVisibilitySchema } from '../enums/WishlistVisibility.schema';
import { JsonWithAggregatesFilterObjectSchema } from './JsonWithAggregatesFilter.schema';
import { DateTimeNullableWithAggregatesFilterObjectSchema } from './DateTimeNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.WishlistItemScalarWhereWithAggregatesInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => WishlistItemScalarWhereWithAggregatesInputObjectSchema),
        z
          .lazy(() => WishlistItemScalarWhereWithAggregatesInputObjectSchema)
          .array(),
      ])
      .optional(),
    OR: z
      .lazy(() => WishlistItemScalarWhereWithAggregatesInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => WishlistItemScalarWhereWithAggregatesInputObjectSchema),
        z
          .lazy(() => WishlistItemScalarWhereWithAggregatesInputObjectSchema)
          .array(),
      ])
      .optional(),
    id: z
      .union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number()])
      .optional(),
    name: z
      .union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()])
      .optional(),
    price: z
      .union([z.lazy(() => FloatWithAggregatesFilterObjectSchema), z.number()])
      .optional(),
    quantity: z
      .union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number()])
      .optional(),
    categoryId: z
      .union([
        z.lazy(() => IntNullableWithAggregatesFilterObjectSchema),
        z.number(),
      ])
      .optional()
      .nullable(),
    priority: z
      .union([
        z.lazy(() => EnumWishlistPriorityWithAggregatesFilterObjectSchema),
        z.lazy(() => WishlistPrioritySchema),
      ])
      .optional(),
    visibility: z
      .union([
        z.lazy(() => EnumWishlistVisibilityWithAggregatesFilterObjectSchema),
        z.lazy(() => WishlistVisibilitySchema),
      ])
      .optional(),
    image: z
      .union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()])
      .optional(),
    href: z
      .union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()])
      .optional(),
    comments: z
      .union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()])
      .optional(),
    reservees: z.lazy(() => JsonWithAggregatesFilterObjectSchema).optional(),
    purchaseDate: z
      .union([
        z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema),
        z.coerce.date(),
      ])
      .optional()
      .nullable(),
    createTime: z
      .union([
        z.lazy(() => DateTimeWithAggregatesFilterObjectSchema),
        z.coerce.date(),
      ])
      .optional(),
  })
  .strict();

export const WishlistItemScalarWhereWithAggregatesInputObjectSchema = Schema;
