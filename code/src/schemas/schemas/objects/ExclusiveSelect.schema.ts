import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ExclusiveSelect> = z
  .object({
    id: z.boolean().optional(),
    subject: z.boolean().optional(),
    content: z.boolean().optional(),
    preview: z.boolean().optional(),
    endearment: z.boolean().optional(),
    date: z.boolean().optional(),
    status: z.boolean().optional(),
  })
  .strict();

export const ExclusiveSelectObjectSchema = Schema;
