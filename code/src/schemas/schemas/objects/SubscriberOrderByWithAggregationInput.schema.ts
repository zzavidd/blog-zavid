import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { SubscriberCountOrderByAggregateInputObjectSchema } from './SubscriberCountOrderByAggregateInput.schema';
import { SubscriberAvgOrderByAggregateInputObjectSchema } from './SubscriberAvgOrderByAggregateInput.schema';
import { SubscriberMaxOrderByAggregateInputObjectSchema } from './SubscriberMaxOrderByAggregateInput.schema';
import { SubscriberMinOrderByAggregateInputObjectSchema } from './SubscriberMinOrderByAggregateInput.schema';
import { SubscriberSumOrderByAggregateInputObjectSchema } from './SubscriberSumOrderByAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SubscriberOrderByWithAggregationInput> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    email: z.lazy(() => SortOrderSchema).optional(),
    firstname: z
      .union([
        z.lazy(() => SortOrderSchema),
        z.lazy(() => SortOrderInputObjectSchema),
      ])
      .optional(),
    lastname: z
      .union([
        z.lazy(() => SortOrderSchema),
        z.lazy(() => SortOrderInputObjectSchema),
      ])
      .optional(),
    subscriptions: z.lazy(() => SortOrderSchema).optional(),
    token: z.lazy(() => SortOrderSchema).optional(),
    createTime: z.lazy(() => SortOrderSchema).optional(),
    _count: z
      .lazy(() => SubscriberCountOrderByAggregateInputObjectSchema)
      .optional(),
    _avg: z
      .lazy(() => SubscriberAvgOrderByAggregateInputObjectSchema)
      .optional(),
    _max: z
      .lazy(() => SubscriberMaxOrderByAggregateInputObjectSchema)
      .optional(),
    _min: z
      .lazy(() => SubscriberMinOrderByAggregateInputObjectSchema)
      .optional(),
    _sum: z
      .lazy(() => SubscriberSumOrderByAggregateInputObjectSchema)
      .optional(),
  })
  .strict();

export const SubscriberOrderByWithAggregationInputObjectSchema = Schema;
