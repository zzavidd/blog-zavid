import { z } from 'zod';
import { DiaryCategoryFindManySchema } from '../findManyDiaryCategory.schema';
import { DiaryCountOutputTypeArgsObjectSchema } from './DiaryCountOutputTypeArgs.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryInclude> = z
  .object({
    categories: z
      .union([z.boolean(), z.lazy(() => DiaryCategoryFindManySchema)])
      .optional(),
    _count: z
      .union([z.boolean(), z.lazy(() => DiaryCountOutputTypeArgsObjectSchema)])
      .optional(),
  })
  .strict();

export const DiaryIncludeObjectSchema = Schema;
