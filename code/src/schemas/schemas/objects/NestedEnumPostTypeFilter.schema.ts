import { z } from 'zod';
import { PostTypeSchema } from '../enums/PostType.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.NestedEnumPostTypeFilter> = z
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

export const NestedEnumPostTypeFilterObjectSchema = Schema;
