import { z } from 'zod';
import { DiaryCategoryFindManySchema } from '../findManyDiaryCategory.schema';
import { DiaryCountOutputTypeArgsObjectSchema } from './DiaryCountOutputTypeArgs.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiarySelect> = z
  .object({
    id: z.boolean().optional(),
    title: z.boolean().optional(),
    date: z.boolean().optional(),
    content: z.boolean().optional(),
    categories: z
      .union([z.boolean(), z.lazy(() => DiaryCategoryFindManySchema)])
      .optional(),
    status: z.boolean().optional(),
    entryNumber: z.boolean().optional(),
    footnote: z.boolean().optional(),
    isFavourite: z.boolean().optional(),
    tags: z.boolean().optional(),
    _count: z
      .union([z.boolean(), z.lazy(() => DiaryCountOutputTypeArgsObjectSchema)])
      .optional(),
  })
  .strict();

export const DiarySelectObjectSchema = Schema;
