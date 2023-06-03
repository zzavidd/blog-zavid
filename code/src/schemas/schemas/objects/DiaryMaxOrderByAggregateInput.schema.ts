import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryMaxOrderByAggregateInput> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    title: z.lazy(() => SortOrderSchema).optional(),
    date: z.lazy(() => SortOrderSchema).optional(),
    content: z.lazy(() => SortOrderSchema).optional(),
    status: z.lazy(() => SortOrderSchema).optional(),
    entryNumber: z.lazy(() => SortOrderSchema).optional(),
    footnote: z.lazy(() => SortOrderSchema).optional(),
    isFavourite: z.lazy(() => SortOrderSchema).optional(),
  })
  .strict();

export const DiaryMaxOrderByAggregateInputObjectSchema = Schema;