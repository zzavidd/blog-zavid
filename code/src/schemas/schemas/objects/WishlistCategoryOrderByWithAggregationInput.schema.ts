import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { WishlistCategoryCountOrderByAggregateInputObjectSchema } from './WishlistCategoryCountOrderByAggregateInput.schema';
import { WishlistCategoryAvgOrderByAggregateInputObjectSchema } from './WishlistCategoryAvgOrderByAggregateInput.schema';
import { WishlistCategoryMaxOrderByAggregateInputObjectSchema } from './WishlistCategoryMaxOrderByAggregateInput.schema';
import { WishlistCategoryMinOrderByAggregateInputObjectSchema } from './WishlistCategoryMinOrderByAggregateInput.schema';
import { WishlistCategorySumOrderByAggregateInputObjectSchema } from './WishlistCategorySumOrderByAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.WishlistCategoryOrderByWithAggregationInput> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    name: z.lazy(() => SortOrderSchema).optional(),
    _count: z
      .lazy(() => WishlistCategoryCountOrderByAggregateInputObjectSchema)
      .optional(),
    _avg: z
      .lazy(() => WishlistCategoryAvgOrderByAggregateInputObjectSchema)
      .optional(),
    _max: z
      .lazy(() => WishlistCategoryMaxOrderByAggregateInputObjectSchema)
      .optional(),
    _min: z
      .lazy(() => WishlistCategoryMinOrderByAggregateInputObjectSchema)
      .optional(),
    _sum: z
      .lazy(() => WishlistCategorySumOrderByAggregateInputObjectSchema)
      .optional(),
  })
  .strict();

export const WishlistCategoryOrderByWithAggregationInputObjectSchema = Schema;
