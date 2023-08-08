import { z } from 'zod';
import { ExclusiveSelectObjectSchema } from './ExclusiveSelect.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ExclusiveArgs> = z
  .object({
    select: z.lazy(() => ExclusiveSelectObjectSchema).optional(),
  })
  .strict();

export const ExclusiveArgsObjectSchema = Schema;
