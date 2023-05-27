import { z } from 'zod';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { FloatFilterObjectSchema } from './FloatFilter.schema';
import { IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { EnumWishlistVisibilityFilterObjectSchema } from './EnumWishlistVisibilityFilter.schema';
import { WishlistVisibilitySchema } from '../enums/WishlistVisibility.schema';
import { EnumWishlistPriorityFilterObjectSchema } from './EnumWishlistPriorityFilter.schema';
import { WishlistPrioritySchema } from '../enums/WishlistPriority.schema';
import { JsonFilterObjectSchema } from './JsonFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.WishlistItemScalarWhereInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => WishlistItemScalarWhereInputObjectSchema),
        z.lazy(() => WishlistItemScalarWhereInputObjectSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => WishlistItemScalarWhereInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => WishlistItemScalarWhereInputObjectSchema),
        z.lazy(() => WishlistItemScalarWhereInputObjectSchema).array(),
      ])
      .optional(),
    id: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
    name: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    price: z
      .union([z.lazy(() => FloatFilterObjectSchema), z.number()])
      .optional(),
    comments: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    quantity: z
      .union([z.lazy(() => IntFilterObjectSchema), z.number()])
      .optional(),
    categoryId: z
      .union([z.lazy(() => IntNullableFilterObjectSchema), z.number()])
      .optional()
      .nullable(),
    visibility: z
      .union([
        z.lazy(() => EnumWishlistVisibilityFilterObjectSchema),
        z.lazy(() => WishlistVisibilitySchema),
      ])
      .optional(),
    priority: z
      .union([
        z.lazy(() => EnumWishlistPriorityFilterObjectSchema),
        z.lazy(() => WishlistPrioritySchema),
      ])
      .optional(),
    image: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    href: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    reservees: z.lazy(() => JsonFilterObjectSchema).optional(),
    purchaseDate: z
      .union([
        z.lazy(() => DateTimeNullableFilterObjectSchema),
        z.coerce.date(),
      ])
      .optional()
      .nullable(),
    createTime: z
      .union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()])
      .optional(),
  })
  .strict();

export const WishlistItemScalarWhereInputObjectSchema = Schema;
