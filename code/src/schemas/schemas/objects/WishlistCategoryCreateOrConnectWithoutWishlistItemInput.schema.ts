import { z } from 'zod';
import { WishlistCategoryWhereUniqueInputObjectSchema } from './WishlistCategoryWhereUniqueInput.schema';
import { WishlistCategoryCreateWithoutWishlistItemInputObjectSchema } from './WishlistCategoryCreateWithoutWishlistItemInput.schema';
import { WishlistCategoryUncheckedCreateWithoutWishlistItemInputObjectSchema } from './WishlistCategoryUncheckedCreateWithoutWishlistItemInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.WishlistCategoryCreateOrConnectWithoutWishlistItemInput> =
  z
    .object({
      where: z.lazy(() => WishlistCategoryWhereUniqueInputObjectSchema),
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

export const WishlistCategoryCreateOrConnectWithoutWishlistItemInputObjectSchema =
  Schema;
