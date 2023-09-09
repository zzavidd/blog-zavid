import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { WishlistItemCountOrderByAggregateInputObjectSchema } from './WishlistItemCountOrderByAggregateInput.schema';
import { WishlistItemAvgOrderByAggregateInputObjectSchema } from './WishlistItemAvgOrderByAggregateInput.schema';
import { WishlistItemMaxOrderByAggregateInputObjectSchema } from './WishlistItemMaxOrderByAggregateInput.schema';
import { WishlistItemMinOrderByAggregateInputObjectSchema } from './WishlistItemMinOrderByAggregateInput.schema';
import { WishlistItemSumOrderByAggregateInputObjectSchema } from './WishlistItemSumOrderByAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.WishlistItemOrderByWithAggregationInput> = z
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
    _count: z
      .lazy(() => WishlistItemCountOrderByAggregateInputObjectSchema)
      .optional(),
    _avg: z
      .lazy(() => WishlistItemAvgOrderByAggregateInputObjectSchema)
      .optional(),
    _max: z
      .lazy(() => WishlistItemMaxOrderByAggregateInputObjectSchema)
      .optional(),
    _min: z
      .lazy(() => WishlistItemMinOrderByAggregateInputObjectSchema)
      .optional(),
    _sum: z
      .lazy(() => WishlistItemSumOrderByAggregateInputObjectSchema)
      .optional(),
  })
  .strict();

export const WishlistItemOrderByWithAggregationInputObjectSchema = Schema;
