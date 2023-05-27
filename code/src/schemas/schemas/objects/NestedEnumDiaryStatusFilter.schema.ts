import { z } from 'zod';
import { DiaryStatusSchema } from '../enums/DiaryStatus.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.NestedEnumDiaryStatusFilter> = z
  .object({
    equals: z.lazy(() => DiaryStatusSchema).optional(),
    in: z
      .union([
        z.lazy(() => DiaryStatusSchema).array(),
        z.lazy(() => DiaryStatusSchema),
      ])
      .optional(),
    notIn: z
      .union([
        z.lazy(() => DiaryStatusSchema).array(),
        z.lazy(() => DiaryStatusSchema),
      ])
      .optional(),
    not: z
      .union([
        z.lazy(() => DiaryStatusSchema),
        z.lazy(() => NestedEnumDiaryStatusFilterObjectSchema),
      ])
      .optional(),
  })
  .strict();

export const NestedEnumDiaryStatusFilterObjectSchema = Schema;
