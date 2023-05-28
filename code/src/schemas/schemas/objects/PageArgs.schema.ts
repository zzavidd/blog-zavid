import { z } from 'zod';
import { PageSelectObjectSchema } from './PageSelect.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.PageArgs> = z
  .object({
    select: z.lazy(() => PageSelectObjectSchema).optional(),
  })
  .strict();

export const PageArgsObjectSchema = Schema;
