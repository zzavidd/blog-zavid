import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryCountOutputTypeSelect> = z
  .object({
    categories: z.boolean().optional(),
  })
  .strict();

export const DiaryCountOutputTypeSelectObjectSchema = Schema;
