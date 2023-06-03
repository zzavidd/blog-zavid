import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.PostSumOrderByAggregateInput> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    typeId: z.lazy(() => SortOrderSchema).optional(),
    domainId: z.lazy(() => SortOrderSchema).optional(),
  })
  .strict();

export const PostSumOrderByAggregateInputObjectSchema = Schema;
