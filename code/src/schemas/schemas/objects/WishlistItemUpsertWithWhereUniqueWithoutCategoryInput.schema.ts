import { z } from 'zod';
import { WishlistItemWhereUniqueInputObjectSchema } from './WishlistItemWhereUniqueInput.schema';
import { WishlistItemUpdateWithoutCategoryInputObjectSchema } from './WishlistItemUpdateWithoutCategoryInput.schema';
import { WishlistItemUncheckedUpdateWithoutCategoryInputObjectSchema } from './WishlistItemUncheckedUpdateWithoutCategoryInput.schema';
import { WishlistItemCreateWithoutCategoryInputObjectSchema } from './WishlistItemCreateWithoutCategoryInput.schema';
import { WishlistItemUncheckedCreateWithoutCategoryInputObjectSchema } from './WishlistItemUncheckedCreateWithoutCategoryInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.WishlistItemUpsertWithWhereUniqueWithoutCategoryInput> =
  z
    .object({
      where: z.lazy(() => WishlistItemWhereUniqueInputObjectSchema),
      update: z.union([
        z.lazy(() => WishlistItemUpdateWithoutCategoryInputObjectSchema),
        z.lazy(
          () => WishlistItemUncheckedUpdateWithoutCategoryInputObjectSchema,
        ),
      ]),
      create: z.union([
        z.lazy(() => WishlistItemCreateWithoutCategoryInputObjectSchema),
        z.lazy(
          () => WishlistItemUncheckedCreateWithoutCategoryInputObjectSchema,
        ),
      ]),
    })
    .strict();

export const WishlistItemUpsertWithWhereUniqueWithoutCategoryInputObjectSchema =
  Schema;
