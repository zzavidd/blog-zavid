import { z } from 'zod';
import { ExclusiveStatusSchema } from '../enums/ExclusiveStatus.schema';
import { NestedEnumExclusiveStatusWithAggregatesFilterObjectSchema } from './NestedEnumExclusiveStatusWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumExclusiveStatusFilterObjectSchema } from './NestedEnumExclusiveStatusFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EnumExclusiveStatusWithAggregatesFilter> = z
  .object({
    equals: z.lazy(() => ExclusiveStatusSchema).optional(),
    in: z
      .union([
        z.lazy(() => ExclusiveStatusSchema).array(),
        z.lazy(() => ExclusiveStatusSchema),
      ])
      .optional(),
    notIn: z
      .union([
        z.lazy(() => ExclusiveStatusSchema).array(),
        z.lazy(() => ExclusiveStatusSchema),
      ])
      .optional(),
    not: z
      .union([
        z.lazy(() => ExclusiveStatusSchema),
        z.lazy(() => NestedEnumExclusiveStatusWithAggregatesFilterObjectSchema),
      ])
      .optional(),
    _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
    _min: z.lazy(() => NestedEnumExclusiveStatusFilterObjectSchema).optional(),
    _max: z.lazy(() => NestedEnumExclusiveStatusFilterObjectSchema).optional(),
  })
  .strict();

export const EnumExclusiveStatusWithAggregatesFilterObjectSchema = Schema;
