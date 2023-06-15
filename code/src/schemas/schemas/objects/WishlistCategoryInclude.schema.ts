import { z } from 'zod';
import { WishlistItemFindManySchema } from '../findManyWishlistItem.schema';
import { WishlistCategoryCountOutputTypeArgsObjectSchema } from './WishlistCategoryCountOutputTypeArgs.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.WishlistCategoryInclude> = z
  .object({
    WishlistItem: z
      .union([z.boolean(), z.lazy(() => WishlistItemFindManySchema)])
      .optional(),
    _count: z
      .union([
        z.boolean(),
        z.lazy(() => WishlistCategoryCountOutputTypeArgsObjectSchema),
      ])
      .optional(),
  })
  .strict();

export const WishlistCategoryIncludeObjectSchema = Schema;
