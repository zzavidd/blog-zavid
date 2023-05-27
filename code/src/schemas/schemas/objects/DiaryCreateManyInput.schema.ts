import { z } from 'zod';
import { DiaryStatusSchema } from '../enums/DiaryStatus.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryCreateManyInput> = z
  .object({
    id: z.number().optional(),
    title: z.string(),
    date: z.coerce.date(),
    content: z.string(),
    slug: z.string(),
    status: z.lazy(() => DiaryStatusSchema),
    entryNumber: z.number(),
    footnote: z.string(),
    isFavourite: z.number(),
    tags: z.string(),
  })
  .strict();

export const DiaryCreateManyInputObjectSchema = Schema;
