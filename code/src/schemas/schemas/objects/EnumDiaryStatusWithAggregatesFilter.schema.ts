import { z } from 'zod';
import { DiaryStatusSchema } from '../enums/DiaryStatus.schema';
import { NestedEnumDiaryStatusWithAggregatesFilterObjectSchema } from './NestedEnumDiaryStatusWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumDiaryStatusFilterObjectSchema } from './NestedEnumDiaryStatusFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EnumDiaryStatusWithAggregatesFilter> = z
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
        z.lazy(() => NestedEnumDiaryStatusWithAggregatesFilterObjectSchema),
      ])
      .optional(),
    _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
    _min: z.lazy(() => NestedEnumDiaryStatusFilterObjectSchema).optional(),
    _max: z.lazy(() => NestedEnumDiaryStatusFilterObjectSchema).optional(),
  })
  .strict();

export const EnumDiaryStatusWithAggregatesFilterObjectSchema = Schema;
