import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SubscriberSelect> = z
  .object({
    id: z.boolean().optional(),
    email: z.boolean().optional(),
    firstname: z.boolean().optional(),
    lastname: z.boolean().optional(),
    subscriptions: z.boolean().optional(),
    token: z.boolean().optional(),
    createTime: z.boolean().optional(),
  })
  .strict();

export const SubscriberSelectObjectSchema = Schema;
