import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.PageCountOrderByAggregateInput> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    title: z.lazy(() => SortOrderSchema).optional(),
    content: z.lazy(() => SortOrderSchema).optional(),
    excerpt: z.lazy(() => SortOrderSchema).optional(),
    slug: z.lazy(() => SortOrderSchema).optional(),
    lastModified: z.lazy(() => SortOrderSchema).optional(),
    isEmbed: z.lazy(() => SortOrderSchema).optional(),
  })
  .strict();

export const PageCountOrderByAggregateInputObjectSchema = Schema;
