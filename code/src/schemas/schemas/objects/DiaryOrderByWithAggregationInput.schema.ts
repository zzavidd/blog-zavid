import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { DiaryCountOrderByAggregateInputObjectSchema } from './DiaryCountOrderByAggregateInput.schema';
import { DiaryAvgOrderByAggregateInputObjectSchema } from './DiaryAvgOrderByAggregateInput.schema';
import { DiaryMaxOrderByAggregateInputObjectSchema } from './DiaryMaxOrderByAggregateInput.schema';
import { DiaryMinOrderByAggregateInputObjectSchema } from './DiaryMinOrderByAggregateInput.schema';
import { DiarySumOrderByAggregateInputObjectSchema } from './DiarySumOrderByAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryOrderByWithAggregationInput> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    title: z.lazy(() => SortOrderSchema).optional(),
    date: z.lazy(() => SortOrderSchema).optional(),
    content: z.lazy(() => SortOrderSchema).optional(),
    slug: z.lazy(() => SortOrderSchema).optional(),
    status: z.lazy(() => SortOrderSchema).optional(),
    entryNumber: z.lazy(() => SortOrderSchema).optional(),
    footnote: z.lazy(() => SortOrderSchema).optional(),
    isFavourite: z.lazy(() => SortOrderSchema).optional(),
    tags: z.lazy(() => SortOrderSchema).optional(),
    _count: z
      .lazy(() => DiaryCountOrderByAggregateInputObjectSchema)
      .optional(),
    _avg: z.lazy(() => DiaryAvgOrderByAggregateInputObjectSchema).optional(),
    _max: z.lazy(() => DiaryMaxOrderByAggregateInputObjectSchema).optional(),
    _min: z.lazy(() => DiaryMinOrderByAggregateInputObjectSchema).optional(),
    _sum: z.lazy(() => DiarySumOrderByAggregateInputObjectSchema).optional(),
  })
  .strict();

export const DiaryOrderByWithAggregationInputObjectSchema = Schema;
