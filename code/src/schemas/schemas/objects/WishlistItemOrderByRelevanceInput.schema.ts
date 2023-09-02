import { z } from 'zod';
import { WishlistItemOrderByRelevanceFieldEnumSchema } from '../enums/WishlistItemOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.WishlistItemOrderByRelevanceInput> = z
  .object({
    fields: z.union([
      z.lazy(() => WishlistItemOrderByRelevanceFieldEnumSchema),
      z.lazy(() => WishlistItemOrderByRelevanceFieldEnumSchema).array(),
    ]),
    sort: z.lazy(() => SortOrderSchema),
    search: z.string(),
  })
  .strict();

export const WishlistItemOrderByRelevanceInputObjectSchema = Schema;
