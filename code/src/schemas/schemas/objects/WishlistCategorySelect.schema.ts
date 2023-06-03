import { z } from 'zod';
import { WishlistItemFindManySchema } from '../findManyWishlistItem.schema';
import { WishlistCategoryCountOutputTypeArgsObjectSchema } from './WishlistCategoryCountOutputTypeArgs.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.WishlistCategorySelect> = z
  .object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
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

export const WishlistCategorySelectObjectSchema = Schema;
