import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.WishlistCategoryCountOutputTypeSelect> = z
  .object({
    WishlistItem: z.boolean().optional(),
  })
  .strict();

export const WishlistCategoryCountOutputTypeSelectObjectSchema = Schema;
