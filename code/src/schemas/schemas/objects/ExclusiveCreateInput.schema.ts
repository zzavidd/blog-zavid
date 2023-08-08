import { z } from 'zod';
import { ExclusiveStatusSchema } from '../enums/ExclusiveStatus.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ExclusiveCreateInput> = z
  .object({
    subject: z.string(),
    content: z.string(),
    preview: z.string(),
    endearment: z.string(),
    date: z.coerce.date().optional().nullable(),
    status: z.lazy(() => ExclusiveStatusSchema),
  })
  .strict();

export const ExclusiveCreateInputObjectSchema = Schema;
