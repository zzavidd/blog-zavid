import { z } from 'zod';
import { PostStatusSchema } from '../enums/PostStatus.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.NestedEnumPostStatusFilter> = z
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
        z.lazy(() => NestedEnumPostStatusFilterObjectSchema),
      ])
      .optional(),
  })
  .strict();

export const NestedEnumPostStatusFilterObjectSchema = Schema;
