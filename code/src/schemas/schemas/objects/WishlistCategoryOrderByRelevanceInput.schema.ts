import { z } from 'zod';
import { WishlistCategoryOrderByRelevanceFieldEnumSchema } from '../enums/WishlistCategoryOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.WishlistCategoryOrderByRelevanceInput> = z
  .object({
    fields: z.union([
      z.lazy(() => WishlistCategoryOrderByRelevanceFieldEnumSchema),
      z.lazy(() => WishlistCategoryOrderByRelevanceFieldEnumSchema).array(),
    ]),
    sort: z.lazy(() => SortOrderSchema),
    search: z.string(),
  })
  .strict();

export const WishlistCategoryOrderByRelevanceInputObjectSchema = Schema;
