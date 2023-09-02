import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SubscriberOrderByRelevanceInputObjectSchema } from './SubscriberOrderByRelevanceInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SubscriberOrderByWithRelationAndSearchRelevanceInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      email: z.lazy(() => SortOrderSchema).optional(),
      firstname: z.lazy(() => SortOrderSchema).optional(),
      lastname: z.lazy(() => SortOrderSchema).optional(),
      subscriptions: z.lazy(() => SortOrderSchema).optional(),
      token: z.lazy(() => SortOrderSchema).optional(),
      createTime: z.lazy(() => SortOrderSchema).optional(),
      _relevance: z
        .lazy(() => SubscriberOrderByRelevanceInputObjectSchema)
        .optional(),
    })
    .strict();

export const SubscriberOrderByWithRelationAndSearchRelevanceInputObjectSchema =
  Schema;