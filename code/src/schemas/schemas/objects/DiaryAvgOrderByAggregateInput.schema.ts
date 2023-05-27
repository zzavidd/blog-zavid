import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryAvgOrderByAggregateInput> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    entryNumber: z.lazy(() => SortOrderSchema).optional(),
    isFavourite: z.lazy(() => SortOrderSchema).optional(),
  })
  .strict();

export const DiaryAvgOrderByAggregateInputObjectSchema = Schema;
