import { z } from 'zod';
import { WishlistItemUncheckedCreateNestedManyWithoutCategoryInputObjectSchema } from './WishlistItemUncheckedCreateNestedManyWithoutCategoryInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.WishlistCategoryUncheckedCreateInput> = z
  .object({
    id: z.number().optional(),
    name: z.string(),
    WishlistItem: z
      .lazy(
        () =>
          WishlistItemUncheckedCreateNestedManyWithoutCategoryInputObjectSchema,
      )
      .optional(),
  })
  .strict();

export const WishlistCategoryUncheckedCreateInputObjectSchema = Schema;
