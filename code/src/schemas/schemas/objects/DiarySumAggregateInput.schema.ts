import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiarySumAggregateInputType> = z
  .object({
    id: z.literal(true).optional(),
    entryNumber: z.literal(true).optional(),
  })
  .strict();

export const DiarySumAggregateInputObjectSchema = Schema;
