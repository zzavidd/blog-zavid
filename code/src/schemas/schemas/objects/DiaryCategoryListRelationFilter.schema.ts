import { z } from 'zod';
import { DiaryCategoryWhereInputObjectSchema } from './DiaryCategoryWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryCategoryListRelationFilter> = z
  .object({
    every: z.lazy(() => DiaryCategoryWhereInputObjectSchema).optional(),
    some: z.lazy(() => DiaryCategoryWhereInputObjectSchema).optional(),
    none: z.lazy(() => DiaryCategoryWhereInputObjectSchema).optional(),
  })
  .strict();

export const DiaryCategoryListRelationFilterObjectSchema = Schema;
