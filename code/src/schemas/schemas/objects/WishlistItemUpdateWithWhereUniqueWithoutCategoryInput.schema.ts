import { z } from 'zod';
import { WishlistItemWhereUniqueInputObjectSchema } from './WishlistItemWhereUniqueInput.schema';
import { WishlistItemUpdateWithoutCategoryInputObjectSchema } from './WishlistItemUpdateWithoutCategoryInput.schema';
import { WishlistItemUncheckedUpdateWithoutCategoryInputObjectSchema } from './WishlistItemUncheckedUpdateWithoutCategoryInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.WishlistItemUpdateWithWhereUniqueWithoutCategoryInput> =
  z
    .object({
      where: z.lazy(() => WishlistItemWhereUniqueInputObjectSchema),
      data: z.union([
        z.lazy(() => WishlistItemUpdateWithoutCategoryInputObjectSchema),
        z.lazy(
          () => WishlistItemUncheckedUpdateWithoutCategoryInputObjectSchema,
        ),
      ]),
    })
    .strict();

export const WishlistItemUpdateWithWhereUniqueWithoutCategoryInputObjectSchema =
  Schema;
