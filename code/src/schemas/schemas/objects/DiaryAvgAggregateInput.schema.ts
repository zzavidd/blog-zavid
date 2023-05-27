import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryAvgAggregateInputType> = z
  .object({
    id: z.literal(true).optional(),
    entryNumber: z.literal(true).optional(),
    isFavourite: z.literal(true).optional(),
  })
  .strict();

export const DiaryAvgAggregateInputObjectSchema = Schema;
