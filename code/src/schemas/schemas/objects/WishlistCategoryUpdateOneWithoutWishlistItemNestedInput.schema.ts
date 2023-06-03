import { z } from 'zod';
import { WishlistCategoryCreateWithoutWishlistItemInputObjectSchema } from './WishlistCategoryCreateWithoutWishlistItemInput.schema';
import { WishlistCategoryUncheckedCreateWithoutWishlistItemInputObjectSchema } from './WishlistCategoryUncheckedCreateWithoutWishlistItemInput.schema';
import { WishlistCategoryCreateOrConnectWithoutWishlistItemInputObjectSchema } from './WishlistCategoryCreateOrConnectWithoutWishlistItemInput.schema';
import { WishlistCategoryUpsertWithoutWishlistItemInputObjectSchema } from './WishlistCategoryUpsertWithoutWishlistItemInput.schema';
import { WishlistCategoryWhereUniqueInputObjectSchema } from './WishlistCategoryWhereUniqueInput.schema';
import { WishlistCategoryUpdateWithoutWishlistItemInputObjectSchema } from './WishlistCategoryUpdateWithoutWishlistItemInput.schema';
import { WishlistCategoryUncheckedUpdateWithoutWishlistItemInputObjectSchema } from './WishlistCategoryUncheckedUpdateWithoutWishlistItemInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.WishlistCategoryUpdateOneWithoutWishlistItemNestedInput> =
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
      upsert: z
        .lazy(() => WishlistCategoryUpsertWithoutWishlistItemInputObjectSchema)
        .optional(),
      disconnect: z.boolean().optional(),
      delete: z.boolean().optional(),
      connect: z
        .lazy(() => WishlistCategoryWhereUniqueInputObjectSchema)
        .optional(),
      update: z
        .union([
          z.lazy(
            () => WishlistCategoryUpdateWithoutWishlistItemInputObjectSchema,
          ),
          z.lazy(
            () =>
              WishlistCategoryUncheckedUpdateWithoutWishlistItemInputObjectSchema,
          ),
        ])
        .optional(),
    })
    .strict();

export const WishlistCategoryUpdateOneWithoutWishlistItemNestedInputObjectSchema =
  Schema;
