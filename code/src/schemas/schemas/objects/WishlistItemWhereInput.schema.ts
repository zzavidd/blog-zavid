import { z } from 'zod';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { FloatFilterObjectSchema } from './FloatFilter.schema';
import { IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { EnumWishlistPriorityFilterObjectSchema } from './EnumWishlistPriorityFilter.schema';
import { WishlistPrioritySchema } from '../enums/WishlistPriority.schema';
import { EnumWishlistVisibilityFilterObjectSchema } from './EnumWishlistVisibilityFilter.schema';
import { WishlistVisibilitySchema } from '../enums/WishlistVisibility.schema';
import { JsonFilterObjectSchema } from './JsonFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { WishlistCategoryRelationFilterObjectSchema } from './WishlistCategoryRelationFilter.schema';
import { WishlistCategoryWhereInputObjectSchema } from './WishlistCategoryWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.WishlistItemWhereInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => WishlistItemWhereInputObjectSchema),
        z.lazy(() => WishlistItemWhereInputObjectSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => WishlistItemWhereInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => WishlistItemWhereInputObjectSchema),
        z.lazy(() => WishlistItemWhereInputObjectSchema).array(),
      ])
      .optional(),
    id: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
    name: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    price: z
      .union([z.lazy(() => FloatFilterObjectSchema), z.number()])
      .optional(),
    quantity: z
      .union([z.lazy(() => IntFilterObjectSchema), z.number()])
      .optional(),
    categoryId: z
      .union([z.lazy(() => IntNullableFilterObjectSchema), z.number()])
      .optional()
      .nullable(),
    priority: z
      .union([
        z.lazy(() => EnumWishlistPriorityFilterObjectSchema),
        z.lazy(() => WishlistPrioritySchema),
      ])
      .optional(),
    visibility: z
      .union([
        z.lazy(() => EnumWishlistVisibilityFilterObjectSchema),
        z.lazy(() => WishlistVisibilitySchema),
      ])
      .optional(),
    image: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    href: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    comments: z
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
    category: z
      .union([
        z.lazy(() => WishlistCategoryRelationFilterObjectSchema),
        z.lazy(() => WishlistCategoryWhereInputObjectSchema),
      ])
      .optional()
      .nullable(),
  })
  .strict();

export const WishlistItemWhereInputObjectSchema = Schema;
