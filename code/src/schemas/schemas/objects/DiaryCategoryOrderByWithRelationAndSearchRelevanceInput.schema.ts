import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { DiaryOrderByRelationAggregateInputObjectSchema } from './DiaryOrderByRelationAggregateInput.schema';
import { DiaryCategoryOrderByRelevanceInputObjectSchema } from './DiaryCategoryOrderByRelevanceInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryCategoryOrderByWithRelationAndSearchRelevanceInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      name: z.lazy(() => SortOrderSchema).optional(),
      entries: z
        .lazy(() => DiaryOrderByRelationAggregateInputObjectSchema)
        .optional(),
      _relevance: z
        .lazy(() => DiaryCategoryOrderByRelevanceInputObjectSchema)
        .optional(),
    })
    .strict();

export const DiaryCategoryOrderByWithRelationAndSearchRelevanceInputObjectSchema =
  Schema;
