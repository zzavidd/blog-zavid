import { z } from 'zod';
import { ExclusiveStatusSchema } from '../enums/ExclusiveStatus.schema';
import { NestedEnumExclusiveStatusFilterObjectSchema } from './NestedEnumExclusiveStatusFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EnumExclusiveStatusFilter> = z
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
        z.lazy(() => NestedEnumExclusiveStatusFilterObjectSchema),
      ])
      .optional(),
  })
  .strict();

export const EnumExclusiveStatusFilterObjectSchema = Schema;
