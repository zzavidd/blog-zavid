import { z } from 'zod';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { DiaryListRelationFilterObjectSchema } from './DiaryListRelationFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryCategoryWhereInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => DiaryCategoryWhereInputObjectSchema),
        z.lazy(() => DiaryCategoryWhereInputObjectSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => DiaryCategoryWhereInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => DiaryCategoryWhereInputObjectSchema),
        z.lazy(() => DiaryCategoryWhereInputObjectSchema).array(),
      ])
      .optional(),
    id: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
    name: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    entries: z.lazy(() => DiaryListRelationFilterObjectSchema).optional(),
  })
  .strict();

export const DiaryCategoryWhereInputObjectSchema = Schema;
