import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { ExclusiveOrderByRelevanceInputObjectSchema } from './ExclusiveOrderByRelevanceInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ExclusiveOrderByWithRelationAndSearchRelevanceInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      subject: z.lazy(() => SortOrderSchema).optional(),
      content: z.lazy(() => SortOrderSchema).optional(),
      preview: z.lazy(() => SortOrderSchema).optional(),
      endearment: z.lazy(() => SortOrderSchema).optional(),
      date: z.lazy(() => SortOrderSchema).optional(),
      status: z.lazy(() => SortOrderSchema).optional(),
      slug: z.lazy(() => SortOrderSchema).optional(),
      _relevance: z
        .lazy(() => ExclusiveOrderByRelevanceInputObjectSchema)
        .optional(),
    })
    .strict();

export const ExclusiveOrderByWithRelationAndSearchRelevanceInputObjectSchema =
  Schema;
