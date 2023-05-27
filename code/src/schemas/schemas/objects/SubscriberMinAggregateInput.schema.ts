import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SubscriberMinAggregateInputType> = z
  .object({
    id: z.literal(true).optional(),
    email: z.literal(true).optional(),
    firstname: z.literal(true).optional(),
    lastname: z.literal(true).optional(),
    token: z.literal(true).optional(),
    createTime: z.literal(true).optional(),
  })
  .strict();

export const SubscriberMinAggregateInputObjectSchema = Schema;
