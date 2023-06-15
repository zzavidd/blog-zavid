import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { DiaryCategoryCountOrderByAggregateInputObjectSchema } from './DiaryCategoryCountOrderByAggregateInput.schema';
import { DiaryCategoryAvgOrderByAggregateInputObjectSchema } from './DiaryCategoryAvgOrderByAggregateInput.schema';
import { DiaryCategoryMaxOrderByAggregateInputObjectSchema } from './DiaryCategoryMaxOrderByAggregateInput.schema';
import { DiaryCategoryMinOrderByAggregateInputObjectSchema } from './DiaryCategoryMinOrderByAggregateInput.schema';
import { DiaryCategorySumOrderByAggregateInputObjectSchema } from './DiaryCategorySumOrderByAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryCategoryOrderByWithAggregationInput> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    name: z.lazy(() => SortOrderSchema).optional(),
    _count: z
      .lazy(() => DiaryCategoryCountOrderByAggregateInputObjectSchema)
      .optional(),
    _avg: z
      .lazy(() => DiaryCategoryAvgOrderByAggregateInputObjectSchema)
      .optional(),
    _max: z
      .lazy(() => DiaryCategoryMaxOrderByAggregateInputObjectSchema)
      .optional(),
    _min: z
      .lazy(() => DiaryCategoryMinOrderByAggregateInputObjectSchema)
      .optional(),
    _sum: z
      .lazy(() => DiaryCategorySumOrderByAggregateInputObjectSchema)
      .optional(),
  })
  .strict();

export const DiaryCategoryOrderByWithAggregationInputObjectSchema = Schema;
