import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { WishlistCategoryOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './WishlistCategoryOrderByWithRelationAndSearchRelevanceInput.schema';
import { WishlistItemOrderByRelevanceInputObjectSchema } from './WishlistItemOrderByRelevanceInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.WishlistItemOrderByWithRelationAndSearchRelevanceInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      name: z.lazy(() => SortOrderSchema).optional(),
      price: z.lazy(() => SortOrderSchema).optional(),
      quantity: z.lazy(() => SortOrderSchema).optional(),
      categoryId: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputObjectSchema),
        ])
        .optional(),
      priority: z.lazy(() => SortOrderSchema).optional(),
      visibility: z.lazy(() => SortOrderSchema).optional(),
      image: z.lazy(() => SortOrderSchema).optional(),
      href: z.lazy(() => SortOrderSchema).optional(),
      comments: z.lazy(() => SortOrderSchema).optional(),
      reservees: z.lazy(() => SortOrderSchema).optional(),
      purchaseDate: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputObjectSchema),
        ])
        .optional(),
      createTime: z.lazy(() => SortOrderSchema).optional(),
      category: z
        .lazy(
          () =>
            WishlistCategoryOrderByWithRelationAndSearchRelevanceInputObjectSchema,
        )
        .optional(),
      _relevance: z
        .lazy(() => WishlistItemOrderByRelevanceInputObjectSchema)
        .optional(),
    })
    .strict();

export const WishlistItemOrderByWithRelationAndSearchRelevanceInputObjectSchema =
  Schema;
