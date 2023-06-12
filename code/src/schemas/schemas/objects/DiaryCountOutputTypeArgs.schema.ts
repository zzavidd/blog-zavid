import { z } from 'zod';
import { DiaryCountOutputTypeSelectObjectSchema } from './DiaryCountOutputTypeSelect.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryCountOutputTypeArgs> = z
  .object({
    select: z.lazy(() => DiaryCountOutputTypeSelectObjectSchema).optional(),
  })
  .strict();

export const DiaryCountOutputTypeArgsObjectSchema = Schema;
