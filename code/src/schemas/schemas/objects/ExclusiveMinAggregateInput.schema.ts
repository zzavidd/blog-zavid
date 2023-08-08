import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ExclusiveMinAggregateInputType> = z
  .object({
    id: z.literal(true).optional(),
    subject: z.literal(true).optional(),
    content: z.literal(true).optional(),
    preview: z.literal(true).optional(),
    endearment: z.literal(true).optional(),
    date: z.literal(true).optional(),
    status: z.literal(true).optional(),
  })
  .strict();

export const ExclusiveMinAggregateInputObjectSchema = Schema;
