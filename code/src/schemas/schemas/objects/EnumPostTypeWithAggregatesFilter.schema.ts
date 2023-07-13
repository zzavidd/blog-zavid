import { z } from 'zod';
import { PostTypeSchema } from '../enums/PostType.schema';
import { NestedEnumPostTypeWithAggregatesFilterObjectSchema } from './NestedEnumPostTypeWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumPostTypeFilterObjectSchema } from './NestedEnumPostTypeFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EnumPostTypeWithAggregatesFilter> = z
  .object({
    equals: z.lazy(() => PostTypeSchema).optional(),
    in: z
      .union([
        z.lazy(() => PostTypeSchema).array(),
        z.lazy(() => PostTypeSchema),
      ])
      .optional(),
    notIn: z
      .union([
        z.lazy(() => PostTypeSchema).array(),
        z.lazy(() => PostTypeSchema),
      ])
      .optional(),
    not: z
      .union([
        z.lazy(() => PostTypeSchema),
        z.lazy(() => NestedEnumPostTypeWithAggregatesFilterObjectSchema),
      ])
      .optional(),
    _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
    _min: z.lazy(() => NestedEnumPostTypeFilterObjectSchema).optional(),
    _max: z.lazy(() => NestedEnumPostTypeFilterObjectSchema).optional(),
  })
  .strict();

export const EnumPostTypeWithAggregatesFilterObjectSchema = Schema;
