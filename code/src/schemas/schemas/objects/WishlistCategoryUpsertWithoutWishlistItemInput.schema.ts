import { z } from 'zod';
import { WishlistCategoryUpdateWithoutWishlistItemInputObjectSchema } from './WishlistCategoryUpdateWithoutWishlistItemInput.schema';
import { WishlistCategoryUncheckedUpdateWithoutWishlistItemInputObjectSchema } from './WishlistCategoryUncheckedUpdateWithoutWishlistItemInput.schema';
import { WishlistCategoryCreateWithoutWishlistItemInputObjectSchema } from './WishlistCategoryCreateWithoutWishlistItemInput.schema';
import { WishlistCategoryUncheckedCreateWithoutWishlistItemInputObjectSchema } from './WishlistCategoryUncheckedCreateWithoutWishlistItemInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.WishlistCategoryUpsertWithoutWishlistItemInput> =
  z
    .object({
      update: z.union([
        z.lazy(
          () => WishlistCategoryUpdateWithoutWishlistItemInputObjectSchema,
        ),
        z.lazy(
          () =>
            WishlistCategoryUncheckedUpdateWithoutWishlistItemInputObjectSchema,
        ),
      ]),
      create: z.union([
        z.lazy(
          () => WishlistCategoryCreateWithoutWishlistItemInputObjectSchema,
        ),
        z.lazy(
          () =>
            WishlistCategoryUncheckedCreateWithoutWishlistItemInputObjectSchema,
        ),
      ]),
    })
    .strict();

export const WishlistCategoryUpsertWithoutWishlistItemInputObjectSchema =
  Schema;
