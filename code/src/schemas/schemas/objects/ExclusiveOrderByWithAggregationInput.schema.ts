import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ExclusiveCountOrderByAggregateInputObjectSchema } from './ExclusiveCountOrderByAggregateInput.schema';
import { ExclusiveAvgOrderByAggregateInputObjectSchema } from './ExclusiveAvgOrderByAggregateInput.schema';
import { ExclusiveMaxOrderByAggregateInputObjectSchema } from './ExclusiveMaxOrderByAggregateInput.schema';
import { ExclusiveMinOrderByAggregateInputObjectSchema } from './ExclusiveMinOrderByAggregateInput.schema';
import { ExclusiveSumOrderByAggregateInputObjectSchema } from './ExclusiveSumOrderByAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ExclusiveOrderByWithAggregationInput> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    subject: z.lazy(() => SortOrderSchema).optional(),
    content: z.lazy(() => SortOrderSchema).optional(),
    preview: z.lazy(() => SortOrderSchema).optional(),
    endearment: z.lazy(() => SortOrderSchema).optional(),
    date: z
      .union([
        z.lazy(() => SortOrderSchema),
        z.lazy(() => SortOrderInputObjectSchema),
      ])
      .optional(),
    status: z.lazy(() => SortOrderSchema).optional(),
    slug: z
      .union([
        z.lazy(() => SortOrderSchema),
        z.lazy(() => SortOrderInputObjectSchema),
      ])
      .optional(),
    _count: z
      .lazy(() => ExclusiveCountOrderByAggregateInputObjectSchema)
      .optional(),
    _avg: z
      .lazy(() => ExclusiveAvgOrderByAggregateInputObjectSchema)
      .optional(),
    _max: z
      .lazy(() => ExclusiveMaxOrderByAggregateInputObjectSchema)
      .optional(),
    _min: z
      .lazy(() => ExclusiveMinOrderByAggregateInputObjectSchema)
      .optional(),
    _sum: z
      .lazy(() => ExclusiveSumOrderByAggregateInputObjectSchema)
      .optional(),
  })
  .strict();

export const ExclusiveOrderByWithAggregationInputObjectSchema = Schema;
