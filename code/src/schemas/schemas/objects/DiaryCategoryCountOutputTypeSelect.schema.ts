import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryCategoryCountOutputTypeSelect> = z
  .object({
    entries: z.boolean().optional(),
  })
  .strict();

export const DiaryCategoryCountOutputTypeSelectObjectSchema = Schema;
