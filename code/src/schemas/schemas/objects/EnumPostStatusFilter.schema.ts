import { z } from 'zod';
import { PostStatusSchema } from '../enums/PostStatus.schema';
import { NestedEnumPostStatusFilterObjectSchema } from './NestedEnumPostStatusFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EnumPostStatusFilter> = z
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

export const EnumPostStatusFilterObjectSchema = Schema;
