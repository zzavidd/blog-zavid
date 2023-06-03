import { z } from 'zod';
import { WishlistCategoryCreateWithoutWishlistItemInputObjectSchema } from './WishlistCategoryCreateWithoutWishlistItemInput.schema';
import { WishlistCategoryUncheckedCreateWithoutWishlistItemInputObjectSchema } from './WishlistCategoryUncheckedCreateWithoutWishlistItemInput.schema';
import { WishlistCategoryCreateOrConnectWithoutWishlistItemInputObjectSchema } from './WishlistCategoryCreateOrConnectWithoutWishlistItemInput.schema';
import { WishlistCategoryWhereUniqueInputObjectSchema } from './WishlistCategoryWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.WishlistCategoryCreateNestedOneWithoutWishlistItemInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(
            () => WishlistCategoryCreateWithoutWishlistItemInputObjectSchema,
          ),
          z.lazy(
            () =>
              WishlistCategoryUncheckedCreateWithoutWishlistItemInputObjectSchema,
          ),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(
          () =>
            WishlistCategoryCreateOrConnectWithoutWishlistItemInputObjectSchema,
        )
        .optional(),
      connect: z
        .lazy(() => WishlistCategoryWhereUniqueInputObjectSchema)
        .optional(),
    })
    .strict();

export const WishlistCategoryCreateNestedOneWithoutWishlistItemInputObjectSchema =
  Schema;
