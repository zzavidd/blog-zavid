import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { DiaryCategoryOrderByRelationAggregateInputObjectSchema } from './DiaryCategoryOrderByRelationAggregateInput.schema';
import { DiaryOrderByRelevanceInputObjectSchema } from './DiaryOrderByRelevanceInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryOrderByWithRelationAndSearchRelevanceInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      title: z.lazy(() => SortOrderSchema).optional(),
      date: z
        .union([
          z.lazy(() => SortOrderSchema),
          z.lazy(() => SortOrderInputObjectSchema),
        ])
        .optional(),
      content: z.lazy(() => SortOrderSchema).optional(),
      status: z.lazy(() => SortOrderSchema).optional(),
      entryNumber: z.lazy(() => SortOrderSchema).optional(),
      footnote: z.lazy(() => SortOrderSchema).optional(),
      isFavourite: z.lazy(() => SortOrderSchema).optional(),
      tags: z.lazy(() => SortOrderSchema).optional(),
      categories: z
        .lazy(() => DiaryCategoryOrderByRelationAggregateInputObjectSchema)
        .optional(),
      _relevance: z
        .lazy(() => DiaryOrderByRelevanceInputObjectSchema)
        .optional(),
    })
    .strict();

export const DiaryOrderByWithRelationAndSearchRelevanceInputObjectSchema =
  Schema;
