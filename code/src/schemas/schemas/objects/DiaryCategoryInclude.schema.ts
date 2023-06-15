import { z } from 'zod';
import { DiaryFindManySchema } from '../findManyDiary.schema';
import { DiaryCategoryCountOutputTypeArgsObjectSchema } from './DiaryCategoryCountOutputTypeArgs.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryCategoryInclude> = z
  .object({
    entries: z
      .union([z.boolean(), z.lazy(() => DiaryFindManySchema)])
      .optional(),
    _count: z
      .union([
        z.boolean(),
        z.lazy(() => DiaryCategoryCountOutputTypeArgsObjectSchema),
      ])
      .optional(),
  })
  .strict();

export const DiaryCategoryIncludeObjectSchema = Schema;
