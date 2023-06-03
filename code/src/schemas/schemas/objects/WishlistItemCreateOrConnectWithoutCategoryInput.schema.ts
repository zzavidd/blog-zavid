import { z } from 'zod';
import { WishlistItemWhereUniqueInputObjectSchema } from './WishlistItemWhereUniqueInput.schema';
import { WishlistItemCreateWithoutCategoryInputObjectSchema } from './WishlistItemCreateWithoutCategoryInput.schema';
import { WishlistItemUncheckedCreateWithoutCategoryInputObjectSchema } from './WishlistItemUncheckedCreateWithoutCategoryInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.WishlistItemCreateOrConnectWithoutCategoryInput> =
  z
    .object({
      where: z.lazy(() => WishlistItemWhereUniqueInputObjectSchema),
      create: z.union([
        z.lazy(() => WishlistItemCreateWithoutCategoryInputObjectSchema),
        z.lazy(
          () => WishlistItemUncheckedCreateWithoutCategoryInputObjectSchema,
        ),
      ]),
    })
    .strict();

export const WishlistItemCreateOrConnectWithoutCategoryInputObjectSchema =
  Schema;
