import { z } from 'zod';
import { SubscriberSelectObjectSchema } from './SubscriberSelect.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SubscriberArgs> = z
  .object({
    select: z.lazy(() => SubscriberSelectObjectSchema).optional(),
  })
  .strict();

export const SubscriberArgsObjectSchema = Schema;
