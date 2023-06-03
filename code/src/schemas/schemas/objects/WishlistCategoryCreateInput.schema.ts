import { z } from 'zod';
import { WishlistItemCreateNestedManyWithoutCategoryInputObjectSchema } from './WishlistItemCreateNestedManyWithoutCategoryInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.WishlistCategoryCreateInput> = z
  .object({
    name: z.string(),
    WishlistItem: z
      .lazy(() => WishlistItemCreateNestedManyWithoutCategoryInputObjectSchema)
      .optional(),
  })
  .strict();

export const WishlistCategoryCreateInputObjectSchema = Schema;
