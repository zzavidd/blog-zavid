import { z } from 'zod';
import { WishlistItemCreateWithoutCategoryInputObjectSchema } from './WishlistItemCreateWithoutCategoryInput.schema';
import { WishlistItemUncheckedCreateWithoutCategoryInputObjectSchema } from './WishlistItemUncheckedCreateWithoutCategoryInput.schema';
import { WishlistItemCreateOrConnectWithoutCategoryInputObjectSchema } from './WishlistItemCreateOrConnectWithoutCategoryInput.schema';
import { WishlistItemCreateManyCategoryInputEnvelopeObjectSchema } from './WishlistItemCreateManyCategoryInputEnvelope.schema';
import { WishlistItemWhereUniqueInputObjectSchema } from './WishlistItemWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.WishlistItemUncheckedCreateNestedManyWithoutCategoryInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => WishlistItemCreateWithoutCategoryInputObjectSchema),
          z
            .lazy(() => WishlistItemCreateWithoutCategoryInputObjectSchema)
            .array(),
          z.lazy(
            () => WishlistItemUncheckedCreateWithoutCategoryInputObjectSchema,
          ),
          z
            .lazy(
              () => WishlistItemUncheckedCreateWithoutCategoryInputObjectSchema,
            )
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(
            () => WishlistItemCreateOrConnectWithoutCategoryInputObjectSchema,
          ),
          z
            .lazy(
              () => WishlistItemCreateOrConnectWithoutCategoryInputObjectSchema,
            )
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => WishlistItemCreateManyCategoryInputEnvelopeObjectSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => WishlistItemWhereUniqueInputObjectSchema),
          z.lazy(() => WishlistItemWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const WishlistItemUncheckedCreateNestedManyWithoutCategoryInputObjectSchema =
  Schema;
