import { z } from 'zod';
import { DiaryCategorySelectObjectSchema } from './DiaryCategorySelect.schema';
import { DiaryCategoryIncludeObjectSchema } from './DiaryCategoryInclude.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryCategoryArgs> = z
  .object({
    select: z.lazy(() => DiaryCategorySelectObjectSchema).optional(),
    include: z.lazy(() => DiaryCategoryIncludeObjectSchema).optional(),
  })
  .strict();

export const DiaryCategoryArgsObjectSchema = Schema;
