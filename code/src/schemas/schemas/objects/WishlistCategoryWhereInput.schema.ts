import { z } from 'zod';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { WishlistItemListRelationFilterObjectSchema } from './WishlistItemListRelationFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.WishlistCategoryWhereInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => WishlistCategoryWhereInputObjectSchema),
        z.lazy(() => WishlistCategoryWhereInputObjectSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => WishlistCategoryWhereInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => WishlistCategoryWhereInputObjectSchema),
        z.lazy(() => WishlistCategoryWhereInputObjectSchema).array(),
      ])
      .optional(),
    id: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
    name: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    WishlistItem: z
      .lazy(() => WishlistItemListRelationFilterObjectSchema)
      .optional(),
  })
  .strict();

export const WishlistCategoryWhereInputObjectSchema = Schema;
