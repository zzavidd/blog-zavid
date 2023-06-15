import { z } from 'zod';
import { DiaryCreateWithoutCategoriesInputObjectSchema } from './DiaryCreateWithoutCategoriesInput.schema';
import { DiaryUncheckedCreateWithoutCategoriesInputObjectSchema } from './DiaryUncheckedCreateWithoutCategoriesInput.schema';
import { DiaryCreateOrConnectWithoutCategoriesInputObjectSchema } from './DiaryCreateOrConnectWithoutCategoriesInput.schema';
import { DiaryWhereUniqueInputObjectSchema } from './DiaryWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryUncheckedCreateNestedManyWithoutCategoriesInput> =
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
      connect: z
        .union([
          z.lazy(() => DiaryWhereUniqueInputObjectSchema),
          z.lazy(() => DiaryWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const DiaryUncheckedCreateNestedManyWithoutCategoriesInputObjectSchema =
  Schema;
