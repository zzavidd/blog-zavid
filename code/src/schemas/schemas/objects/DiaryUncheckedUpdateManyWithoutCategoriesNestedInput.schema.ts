import { z } from 'zod';
import { DiaryCreateWithoutCategoriesInputObjectSchema } from './DiaryCreateWithoutCategoriesInput.schema';
import { DiaryUncheckedCreateWithoutCategoriesInputObjectSchema } from './DiaryUncheckedCreateWithoutCategoriesInput.schema';
import { DiaryCreateOrConnectWithoutCategoriesInputObjectSchema } from './DiaryCreateOrConnectWithoutCategoriesInput.schema';
import { DiaryUpsertWithWhereUniqueWithoutCategoriesInputObjectSchema } from './DiaryUpsertWithWhereUniqueWithoutCategoriesInput.schema';
import { DiaryWhereUniqueInputObjectSchema } from './DiaryWhereUniqueInput.schema';
import { DiaryUpdateWithWhereUniqueWithoutCategoriesInputObjectSchema } from './DiaryUpdateWithWhereUniqueWithoutCategoriesInput.schema';
import { DiaryUpdateManyWithWhereWithoutCategoriesInputObjectSchema } from './DiaryUpdateManyWithWhereWithoutCategoriesInput.schema';
import { DiaryScalarWhereInputObjectSchema } from './DiaryScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryUncheckedUpdateManyWithoutCategoriesNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => DiaryCreateWithoutCategoriesInputObjectSchema),
          z.lazy(() => DiaryCreateWithoutCategoriesInputObjectSchema).array(),
          z.lazy(() => DiaryUncheckedCreateWithoutCategoriesInputObjectSchema),
          z
            .lazy(() => DiaryUncheckedCreateWithoutCategoriesInputObjectSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => DiaryCreateOrConnectWithoutCategoriesInputObjectSchema),
          z
            .lazy(() => DiaryCreateOrConnectWithoutCategoriesInputObjectSchema)
            .array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(
            () => DiaryUpsertWithWhereUniqueWithoutCategoriesInputObjectSchema,
          ),
          z
            .lazy(
              () =>
                DiaryUpsertWithWhereUniqueWithoutCategoriesInputObjectSchema,
            )
            .array(),
        ])
        .optional(),
      set: z
        .union([
          z.lazy(() => DiaryWhereUniqueInputObjectSchema),
          z.lazy(() => DiaryWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => DiaryWhereUniqueInputObjectSchema),
          z.lazy(() => DiaryWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => DiaryWhereUniqueInputObjectSchema),
          z.lazy(() => DiaryWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => DiaryWhereUniqueInputObjectSchema),
          z.lazy(() => DiaryWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(
            () => DiaryUpdateWithWhereUniqueWithoutCategoriesInputObjectSchema,
          ),
          z
            .lazy(
              () =>
                DiaryUpdateWithWhereUniqueWithoutCategoriesInputObjectSchema,
            )
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(
            () => DiaryUpdateManyWithWhereWithoutCategoriesInputObjectSchema,
          ),
          z
            .lazy(
              () => DiaryUpdateManyWithWhereWithoutCategoriesInputObjectSchema,
            )
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => DiaryScalarWhereInputObjectSchema),
          z.lazy(() => DiaryScalarWhereInputObjectSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const DiaryUncheckedUpdateManyWithoutCategoriesNestedInputObjectSchema =
  Schema;
