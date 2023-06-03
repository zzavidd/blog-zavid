import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryWhereUniqueInput> = z
  .object({
    id: z.number().optional(),
    entryNumber: z.number().optional(),
  })
  .strict();

export const DiaryWhereUniqueInputObjectSchema = Schema;
