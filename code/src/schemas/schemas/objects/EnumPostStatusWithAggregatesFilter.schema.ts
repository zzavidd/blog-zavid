import { z } from 'zod';
import { PostStatusSchema } from '../enums/PostStatus.schema';
import { NestedEnumPostStatusWithAggregatesFilterObjectSchema } from './NestedEnumPostStatusWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumPostStatusFilterObjectSchema } from './NestedEnumPostStatusFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EnumPostStatusWithAggregatesFilter> = z
  .object({
    equals: z.lazy(() => PostStatusSchema).optional(),
    in: z
      .union([
        z.lazy(() => PostStatusSchema).array(),
        z.lazy(() => PostStatusSchema),
      ])
      .optional(),
    notIn: z
      .union([
        z.lazy(() => PostStatusSchema).array(),
        z.lazy(() => PostStatusSchema),
      ])
      .optional(),
    not: z
      .union([
        z.lazy(() => PostStatusSchema),
        z.lazy(() => NestedEnumPostStatusWithAggregatesFilterObjectSchema),
      ])
      .optional(),
    _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
    _min: z.lazy(() => NestedEnumPostStatusFilterObjectSchema).optional(),
    _max: z.lazy(() => NestedEnumPostStatusFilterObjectSchema).optional(),
  })
  .strict();

export const EnumPostStatusWithAggregatesFilterObjectSchema = Schema;
