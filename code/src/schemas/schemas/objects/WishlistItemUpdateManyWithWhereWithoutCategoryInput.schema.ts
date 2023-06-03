import { z } from 'zod';
import { WishlistItemScalarWhereInputObjectSchema } from './WishlistItemScalarWhereInput.schema';
import { WishlistItemUpdateManyMutationInputObjectSchema } from './WishlistItemUpdateManyMutationInput.schema';
import { WishlistItemUncheckedUpdateManyWithoutWishlistItemInputObjectSchema } from './WishlistItemUncheckedUpdateManyWithoutWishlistItemInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.WishlistItemUpdateManyWithWhereWithoutCategoryInput> =
  z
    .object({
      where: z.lazy(() => WishlistItemScalarWhereInputObjectSchema),
      data: z.union([
        z.lazy(() => WishlistItemUpdateManyMutationInputObjectSchema),
        z.lazy(
          () =>
            WishlistItemUncheckedUpdateManyWithoutWishlistItemInputObjectSchema,
        ),
      ]),
    })
    .strict();

export const WishlistItemUpdateManyWithWhereWithoutCategoryInputObjectSchema =
  Schema;
