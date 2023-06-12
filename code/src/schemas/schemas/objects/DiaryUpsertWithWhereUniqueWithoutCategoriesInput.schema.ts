import { z } from 'zod';
import { DiaryWhereUniqueInputObjectSchema } from './DiaryWhereUniqueInput.schema';
import { DiaryUpdateWithoutCategoriesInputObjectSchema } from './DiaryUpdateWithoutCategoriesInput.schema';
import { DiaryUncheckedUpdateWithoutCategoriesInputObjectSchema } from './DiaryUncheckedUpdateWithoutCategoriesInput.schema';
import { DiaryCreateWithoutCategoriesInputObjectSchema } from './DiaryCreateWithoutCategoriesInput.schema';
import { DiaryUncheckedCreateWithoutCategoriesInputObjectSchema } from './DiaryUncheckedCreateWithoutCategoriesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryUpsertWithWhereUniqueWithoutCategoriesInput> =
  z
    .object({
      where: z.lazy(() => DiaryWhereUniqueInputObjectSchema),
      update: z.union([
        z.lazy(() => DiaryUpdateWithoutCategoriesInputObjectSchema),
        z.lazy(() => DiaryUncheckedUpdateWithoutCategoriesInputObjectSchema),
      ]),
      create: z.union([
        z.lazy(() => DiaryCreateWithoutCategoriesInputObjectSchema),
        z.lazy(() => DiaryUncheckedCreateWithoutCategoriesInputObjectSchema),
      ]),
    })
    .strict();

export const DiaryUpsertWithWhereUniqueWithoutCategoriesInputObjectSchema =
  Schema;
