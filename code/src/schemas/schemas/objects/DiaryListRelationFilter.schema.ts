import { z } from 'zod';
import { DiaryWhereInputObjectSchema } from './DiaryWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryListRelationFilter> = z
  .object({
    every: z.lazy(() => DiaryWhereInputObjectSchema).optional(),
    some: z.lazy(() => DiaryWhereInputObjectSchema).optional(),
    none: z.lazy(() => DiaryWhereInputObjectSchema).optional(),
  })
  .strict();

export const DiaryListRelationFilterObjectSchema = Schema;
