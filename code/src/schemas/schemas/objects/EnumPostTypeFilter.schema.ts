import { z } from 'zod';
import { PostTypeSchema } from '../enums/PostType.schema';
import { NestedEnumPostTypeFilterObjectSchema } from './NestedEnumPostTypeFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EnumPostTypeFilter> = z
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
        z.lazy(() => NestedEnumPostTypeFilterObjectSchema),
      ])
      .optional(),
  })
  .strict();

export const EnumPostTypeFilterObjectSchema = Schema;
