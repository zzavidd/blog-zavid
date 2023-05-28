import { z } from 'zod';
import { WishlistCategorySelectObjectSchema } from './WishlistCategorySelect.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.WishlistCategoryArgs> = z
  .object({
    select: z.lazy(() => WishlistCategorySelectObjectSchema).optional(),
  })
  .strict();

export const WishlistCategoryArgsObjectSchema = Schema;
