import { z } from 'zod';
import { WishlistCategoryArgsObjectSchema } from './WishlistCategoryArgs.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.WishlistItemInclude> = z
  .object({
    category: z
      .union([z.boolean(), z.lazy(() => WishlistCategoryArgsObjectSchema)])
      .optional(),
  })
  .strict();

export const WishlistItemIncludeObjectSchema = Schema;
