import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.PostAvgAggregateInputType> = z
  .object({
    id: z.literal(true).optional(),
    typeId: z.literal(true).optional(),
    domainId: z.literal(true).optional(),
  })
  .strict();

export const PostAvgAggregateInputObjectSchema = Schema;