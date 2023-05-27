import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryMaxAggregateInputType> = z
  .object({
    id: z.literal(true).optional(),
    title: z.literal(true).optional(),
    date: z.literal(true).optional(),
    content: z.literal(true).optional(),
    slug: z.literal(true).optional(),
    status: z.literal(true).optional(),
    entryNumber: z.literal(true).optional(),
    footnote: z.literal(true).optional(),
    isFavourite: z.literal(true).optional(),
    tags: z.literal(true).optional(),
  })
  .strict();

export const DiaryMaxAggregateInputObjectSchema = Schema;
