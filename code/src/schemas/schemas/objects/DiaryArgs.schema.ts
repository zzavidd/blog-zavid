import { z } from 'zod';
import { DiarySelectObjectSchema } from './DiarySelect.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryArgs> = z
  .object({
    select: z.lazy(() => DiarySelectObjectSchema).optional(),
  })
  .strict();

export const DiaryArgsObjectSchema = Schema;
