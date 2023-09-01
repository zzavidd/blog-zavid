import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { WishlistItemOrderByRelationAggregateInputObjectSchema } from './WishlistItemOrderByRelationAggregateInput.schema';
import { WishlistCategoryOrderByRelevanceInputObjectSchema } from './WishlistCategoryOrderByRelevanceInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.WishlistCategoryOrderByWithRelationAndSearchRelevanceInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      name: z.lazy(() => SortOrderSchema).optional(),
      WishlistItem: z
        .lazy(() => WishlistItemOrderByRelationAggregateInputObjectSchema)
        .optional(),
      _relevance: z
        .lazy(() => WishlistCategoryOrderByRelevanceInputObjectSchema)
        .optional(),
    })
    .strict();

export const WishlistCategoryOrderByWithRelationAndSearchRelevanceInputObjectSchema =
  Schema;
