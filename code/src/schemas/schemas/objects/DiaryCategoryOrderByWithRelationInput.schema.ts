import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { DiaryOrderByRelationAggregateInputObjectSchema } from './DiaryOrderByRelationAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryCategoryOrderByWithRelationInput> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    name: z.lazy(() => SortOrderSchema).optional(),
    entries: z
      .lazy(() => DiaryOrderByRelationAggregateInputObjectSchema)
      .optional(),
  })
  .strict();

export const DiaryCategoryOrderByWithRelationInputObjectSchema = Schema;
