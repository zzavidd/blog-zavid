import { z } from 'zod';
import { WishlistItemCreateWithoutCategoryInputObjectSchema } from './WishlistItemCreateWithoutCategoryInput.schema';
import { WishlistItemUncheckedCreateWithoutCategoryInputObjectSchema } from './WishlistItemUncheckedCreateWithoutCategoryInput.schema';
import { WishlistItemCreateOrConnectWithoutCategoryInputObjectSchema } from './WishlistItemCreateOrConnectWithoutCategoryInput.schema';
import { WishlistItemUpsertWithWhereUniqueWithoutCategoryInputObjectSchema } from './WishlistItemUpsertWithWhereUniqueWithoutCategoryInput.schema';
import { WishlistItemCreateManyCategoryInputEnvelopeObjectSchema } from './WishlistItemCreateManyCategoryInputEnvelope.schema';
import { WishlistItemWhereUniqueInputObjectSchema } from './WishlistItemWhereUniqueInput.schema';
import { WishlistItemUpdateWithWhereUniqueWithoutCategoryInputObjectSchema } from './WishlistItemUpdateWithWhereUniqueWithoutCategoryInput.schema';
import { WishlistItemUpdateManyWithWhereWithoutCategoryInputObjectSchema } from './WishlistItemUpdateManyWithWhereWithoutCategoryInput.schema';
import { WishlistItemScalarWhereInputObjectSchema } from './WishlistItemScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.WishlistItemUncheckedUpdateManyWithoutCategoryNestedInput> =
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
      upsert: z
        .union([
          z.lazy(
            () =>
              WishlistItemUpsertWithWhereUniqueWithoutCategoryInputObjectSchema,
          ),
          z
            .lazy(
              () =>
                WishlistItemUpsertWithWhereUniqueWithoutCategoryInputObjectSchema,
            )
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => WishlistItemCreateManyCategoryInputEnvelopeObjectSchema)
        .optional(),
      set: z
        .union([
          z.lazy(() => WishlistItemWhereUniqueInputObjectSchema),
          z.lazy(() => WishlistItemWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => WishlistItemWhereUniqueInputObjectSchema),
          z.lazy(() => WishlistItemWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => WishlistItemWhereUniqueInputObjectSchema),
          z.lazy(() => WishlistItemWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => WishlistItemWhereUniqueInputObjectSchema),
          z.lazy(() => WishlistItemWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(
            () =>
              WishlistItemUpdateWithWhereUniqueWithoutCategoryInputObjectSchema,
          ),
          z
            .lazy(
              () =>
                WishlistItemUpdateWithWhereUniqueWithoutCategoryInputObjectSchema,
            )
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(
            () =>
              WishlistItemUpdateManyWithWhereWithoutCategoryInputObjectSchema,
          ),
          z
            .lazy(
              () =>
                WishlistItemUpdateManyWithWhereWithoutCategoryInputObjectSchema,
            )
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => WishlistItemScalarWhereInputObjectSchema),
          z.lazy(() => WishlistItemScalarWhereInputObjectSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const WishlistItemUncheckedUpdateManyWithoutCategoryNestedInputObjectSchema =
  Schema;
