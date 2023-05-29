import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiarySelect> = z
  .object({
    id: z.boolean().optional(),
    title: z.boolean().optional(),
    date: z.boolean().optional(),
    content: z.boolean().optional(),
    status: z.boolean().optional(),
    entryNumber: z.boolean().optional(),
    footnote: z.boolean().optional(),
    isFavourite: z.boolean().optional(),
    tags: z.boolean().optional(),
  })
  .strict();

export const DiarySelectObjectSchema = Schema;
