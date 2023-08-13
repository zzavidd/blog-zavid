import { z } from 'zod';
import { ExclusiveStatusSchema } from '../enums/ExclusiveStatus.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ExclusiveCreateManyInput> = z
  .object({
    id: z.number().optional(),
    subject: z.string(),
    content: z.string(),
    preview: z.string(),
    endearment: z.string(),
    date: z.coerce.date().optional().nullable(),
    status: z.lazy(() => ExclusiveStatusSchema),
    slug: z.string().optional().nullable(),
  })
  .strict();

export const ExclusiveCreateManyInputObjectSchema = Schema;
